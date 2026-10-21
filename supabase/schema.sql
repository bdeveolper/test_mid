-- =========================================================
-- Scrub Store - schema v1
-- Stock model: reservation at order time (option A)
-- =========================================================

-- ---------- 1. Sizes (reference table) ----------
create table if not exists public.sizes (
  code text primary key,
  category text not null check (category in ('scrubs','footwear','accessories')),
  sort_order int not null default 0
);

insert into public.sizes (code, category, sort_order) values
  ('S','scrubs',1), ('M','scrubs',2), ('L','scrubs',3), ('XL','scrubs',4), ('XXL','scrubs',5),
  ('36','footwear',1), ('37','footwear',2), ('38','footwear',3), ('39','footwear',4),
  ('40','footwear',5), ('41','footwear',6), ('42','footwear',7), ('43','footwear',8),
  ('مقاس واحد','accessories',1)
on conflict (code) do nothing;

-- ---------- 2. Products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  category text not null check (category in ('scrubs','footwear','accessories')),
  price numeric(10,2) not null check (price > 0),
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 3. Variants (size + color + available stock) ----------
create table if not exists public.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null references public.sizes(code),
  color text not null check (length(trim(color)) > 0),
  stock int not null default 0 check (stock >= 0),
  unique (product_id, size, color)
);

-- ---------- 4. Orders ----------
do $$
begin
  create type public.order_status as enum ('pending','completed','returned','cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone_e164 text not null,
  dial_code text not null,
  address text not null,
  total numeric(10,2) not null default 0 check (total >= 0),
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now(),
  status_changed_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.variants(id) on delete set null,
  product_name text not null,
  size text not null,
  color text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity int not null check (quantity > 0),
  reserved_quantity int not null default 0 check (reserved_quantity >= 0),
  returned_quantity int not null default 0 check (returned_quantity >= 0),
  damaged_quantity int not null default 0 check (damaged_quantity >= 0),
  check (returned_quantity + damaged_quantity <= quantity)
);

create index if not exists idx_variants_product on public.variants(product_id);
create index if not exists idx_orders_status_created on public.orders(status, created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ---------- 5. Reserved totals per variant (admin dashboard helper) ----------
create or replace view public.variant_reserved_totals with (security_invoker = true) as
select variant_id, sum(reserved_quantity)::int as reserved
from public.order_items
where variant_id is not null and reserved_quantity > 0
group by variant_id;

-- ---------- 6. Row Level Security ----------
alter table public.sizes enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- sizes: anyone reads, only logged-in admin writes
create policy "sizes public read" on public.sizes
  for select to anon, authenticated using (true);
create policy "sizes admin write" on public.sizes
  for all to authenticated using (true) with check (true);

-- products: anon reads active only, admin does everything
create policy "products public read active" on public.products
  for select to anon, authenticated using (is_active);
create policy "products admin all" on public.products
  for all to authenticated using (true) with check (true);

-- variants: anon reads variants of active products only, admin does everything
create policy "variants public read active" on public.variants
  for select to anon using (
    exists (select 1 from public.products p where p.id = variants.product_id and p.is_active)
  );
create policy "variants admin all" on public.variants
  for all to authenticated using (true) with check (true);

-- orders: no anon access at all. Admin only.
create policy "orders admin all" on public.orders
  for all to authenticated using (true) with check (true);

-- order_items: no anon access. Admin only.
create policy "order_items admin all" on public.order_items
  for all to authenticated using (true) with check (true);

-- ---------- 7. Functions ----------

-- 7.1 Customer creates an order (reserves stock). Callable by anon.
create or replace function public.create_order(
  p_customer_name text,
  p_phone_e164 text,
  p_dial_code text,
  p_address text,
  p_items jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_row record;
  v_qty int;
  v_total numeric(10,2) := 0;
begin
  if length(trim(coalesce(p_customer_name, ''))) < 3 then raise exception 'invalid_name'; end if;
  if length(trim(coalesce(p_address, ''))) < 10 then raise exception 'invalid_address'; end if;
  if coalesce(p_phone_e164, '') !~ '^\+[0-9]{8,15}$' then raise exception 'invalid_phone'; end if;
  if coalesce(p_dial_code, '') !~ '^[0-9]{1,4}$' then raise exception 'invalid_dial_code'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'empty_cart';
  end if;

  insert into public.orders (customer_name, phone_e164, dial_code, address, total)
  values (trim(p_customer_name), p_phone_e164, p_dial_code, trim(p_address), 0)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::int;
    if v_qty is null or v_qty < 1 then raise exception 'invalid_quantity'; end if;

    select v.id, v.size, v.color, v.stock, p.name, p.price
      into v_row
      from public.variants v
      join public.products p on p.id = v.product_id
     where v.id = (v_item->>'variant_id')::uuid
       and p.is_active
     for update of v;

    if not found then raise exception 'variant_not_available'; end if;
    if v_row.stock < v_qty then raise exception 'insufficient_stock'; end if;

    -- reserve: take the quantity out of available stock now
    update public.variants set stock = stock - v_qty where id = v_row.id;

    insert into public.order_items (
      order_id, variant_id, product_name, size, color, unit_price,
      quantity, reserved_quantity
    ) values (
      v_order_id, v_row.id, v_row.name, v_row.size, v_row.color, v_row.price,
      v_qty, v_qty
    );

    v_total := v_total + v_row.price * v_qty;
  end loop;

  update public.orders set total = v_total where id = v_order_id;
  return v_order_id;
end;
$$;

-- 7.2 Admin marks a pending order as completed. Reservation becomes final.
create or replace function public.complete_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status public.order_status;
begin
  if auth.uid() is null then raise exception 'not_authorized'; end if;

  select status into v_status from public.orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_status <> 'pending' then raise exception 'invalid_status_transition'; end if;

  update public.order_items set reserved_quantity = 0 where order_id = p_order_id;
  update public.orders
     set status = 'completed', status_changed_at = now()
   where id = p_order_id;
end;
$$;

-- 7.3 Admin cancels a pending order. Reserved quantity goes back to stock.
create or replace function public.cancel_pending_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status public.order_status;
  v_item record;
begin
  if auth.uid() is null then raise exception 'not_authorized'; end if;

  select status into v_status from public.orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_status <> 'pending' then raise exception 'invalid_status_transition'; end if;

  for v_item in
    select id, variant_id, reserved_quantity
      from public.order_items
     where order_id = p_order_id and reserved_quantity > 0
  loop
    if v_item.variant_id is not null then
      update public.variants
         set stock = stock + v_item.reserved_quantity
       where id = v_item.variant_id;
    end if;
  end loop;

  update public.order_items set reserved_quantity = 0 where order_id = p_order_id;
  update public.orders
     set status = 'cancelled', status_changed_at = now()
   where id = p_order_id;
end;
$$;

-- 7.4 Admin records a return on a completed order.
-- p_returned: [{ "item_id": "<uuid>", "returned_quantity": <int> }, ...]
-- Every item of the order must be listed. Returned goes back to stock,
-- the rest is recorded as damaged (already sold, not restocked).
create or replace function public.return_order(p_order_id uuid, p_returned jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status public.order_status;
  v_item record;
  v_ret int;
begin
  if auth.uid() is null then raise exception 'not_authorized'; end if;

  select status into v_status from public.orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_status <> 'completed' then raise exception 'invalid_status_transition'; end if;
  if jsonb_typeof(p_returned) <> 'array' then raise exception 'invalid_payload'; end if;

  for v_item in
    select id, variant_id, quantity
      from public.order_items
     where order_id = p_order_id
  loop
    select (e.val->>'returned_quantity')::int
      into v_ret
      from jsonb_array_elements(p_returned) as e(val)
     where (e.val->>'item_id')::uuid = v_item.id;

    if not found then raise exception 'missing_item'; end if;
    if v_ret < 0 or v_ret > v_item.quantity then raise exception 'invalid_returned_quantity'; end if;

    if v_ret > 0 and v_item.variant_id is not null then
      update public.variants
         set stock = stock + v_ret
       where id = v_item.variant_id;
    end if;

    update public.order_items
       set returned_quantity = v_ret,
           damaged_quantity = v_item.quantity - v_ret,
           reserved_quantity = 0
     where id = v_item.id;
  end loop;

  update public.orders
     set status = 'returned', status_changed_at = now()
   where id = p_order_id;
end;
$$;

-- ---------- 8. Function permissions ----------
revoke all on function public.create_order(text, text, text, text, jsonb) from public;
grant execute on function public.create_order(text, text, text, text, jsonb) to anon, authenticated;

revoke all on function public.complete_order(uuid) from public;
grant execute on function public.complete_order(uuid) to authenticated;

revoke all on function public.cancel_pending_order(uuid) from public;
grant execute on function public.cancel_pending_order(uuid) to authenticated;

revoke all on function public.return_order(uuid, jsonb) from public;
grant execute on function public.return_order(uuid, jsonb) to authenticated;

-- ---------- 9. Storage bucket for product images ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');
create policy "product images admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');
create policy "product images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');
create policy "product images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');
