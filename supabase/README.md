# Supabase schema
Run: Supabase Dashboard > SQL Editor > paste `schema.sql` > Run.
Verify sizes: `select count(*) from public.sizes;` — expected: 14.
Verify RLS: `select relname, relrowsecurity from pg_class join pg_namespace on pg_namespace.oid = pg_class.relnamespace where nspname = 'public' and relname in ('sizes', 'products', 'variants', 'orders', 'order_items') order by relname;` — all five should be true.
Verify functions: `select proname from pg_proc join pg_namespace on pg_namespace.oid = pg_proc.pronamespace where nspname = 'public' and proname in ('create_order', 'complete_order', 'cancel_pending_order', 'return_order') order by proname;` — expected: all four names.
