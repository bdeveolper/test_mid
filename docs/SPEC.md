# SPEC.md

Functional specification for **Scrub Store**.

## Store Info

- Store name: **Scrub Store**, read from `VITE_STORE_NAME` (never hardcoded).
- Language: **Arabic only**.
- Currency: **EGP**, shown as `ج.م`.
- Orders are sent via **WhatsApp**. There is no online payment.
- No discounts, no coupons, and no shipping fees.
- Order confirmation and pickup time are handled by the store owner on WhatsApp.
- WhatsApp number comes from `VITE_WHATSAPP_NUMBER`, in international format without `+`
  (for example `2010XXXXXXXX`).
- Contact details may be customized with `VITE_STORE_EMAIL`, `VITE_STORE_ADDRESS`, and
  `VITE_STORE_HOURS`. Social profile links may be customized with `VITE_FACEBOOK_URL`,
  `VITE_INSTAGRAM_URL`, and `VITE_TIKTOK_URL`.

## Pages

| Route | Page | Description |
| --- | --- | --- |
| `/` | Home | Product grid with a category filter; customers select size and color on each product card. |
| `/about` | About | Arabic overview of the store. |
| `/contact` | Contact | WhatsApp contact button using the configured store number. |
| `/product/:id` | Product | Images, size and color selection, stock, add to cart. |
| `/cart` | Cart | Items, quantity, remove, total, WhatsApp order. |
| `/admin/login` | Admin Login | Admin authentication. |
| `/admin` | Admin Products | Products management list. |
| `/admin/products/new` | New Product | Create a product. |
| `/admin/products/:id` | Edit Product | Edit an existing product. |
| `*` | Not Found | Arabic 404 page. |

Admin routes are **Phase 4** (UI with mock data) and **Phase 5** (Supabase auth).

### Admin Product Variants

The product form organizes variants by color, then by the sizes available for the selected
category. Scrubs use S, M, L, XL, and XXL; footwear uses sizes 36 through 43; accessories use
مقاس واحد. Each checked size has an integer stock value of zero or more. A color cannot be
selected for multiple groups. Changing category removes sizes that are not valid for the new
category and notifies the admin. Active products must have at least one variant.

## Product Categories

- **scrubs**: scrub sets, lab coats, uniforms.
- **footwear**: clogs, medical shoes.
- **accessories**: badge reels, nurse watches, stethoscope cases, bags.

The product model includes a `category` field.

## Data Model

### Product

- `id` (string)
- `name` (Arabic string)
- `description` (string)
- `category` (one of the categories above)
- `price` (number, EGP)
- `images` (string array, zero or more)
- `isActive` (boolean)
- `createdAt` (ISO string)

### Variant

- `id` (string)
- `productId` (string)
- `size` (string, e.g. `"S"`, `"M"`, `"L"`, `"XL"`, `"XXL"`, or numeric shoe sizes `"38"`, `"40"`)
- `color` (Arabic name, e.g. `"أبيض"`, `"كحلي"`, `"أخضر زيتي"`)
- `stock` (integer, zero or more)

## Variant Rules

- Each `(productId, size, color)` combination is unique.
- Products whose variants all have size `مقاس واحد` show a one-size badge instead of a size selector; customers choose only a color. Mixed-size products continue to require size selection.
- Price is per product, not per variant.
- Stock `0` is shown as `غير متوفر` and cannot be added to cart.

## Cart

A cart item has: `productId`, `variantId`, `name`, `image`, `size`, `color`, `price`, `quantity`,
`stock`.

- Adding the same variant increases the quantity.
- Quantity never goes above the variant stock.
- The cart is stored in `localStorage` under the key `cart`, wrapped in `try/catch`.

## WhatsApp Invoice

Arabic text built in `src/lib/whatsappInvoice.js` in this format:

```text
طلب جديد 🛍️
اسم المتجر: [STORE NAME]

بيانات العميل:
الاسم: [CUSTOMER NAME]
رقم الهاتف: [+<DIAL CODE> <NATIONAL NUMBER>]
العنوان: [CUSTOMER ADDRESS]

المنتجات:
1) [name] - مقاس [size] - لون [color]
   الكمية: [qty] × [unitPrice] = [lineTotal] ج.م
2) ...

الإجمالي: [grandTotal] ج.م

يرجى تأكيد الطلب ومواعيد الاستلام. شكراً لك 🙏
```

Opened with `https://wa.me/<number>?text=<encodeURIComponent(message)>`. This works on mobile and
desktop.

In checkout, the customer selects a country and enters a national phone number. The number is
validated for that country's length and optional leading digits, normalized to E.164, and
displayed with a space after the dial code (for example `+20 1112360851`). Egypt is selected by
default; Egyptian mobile numbers must start with `1` and contain 10 national digits after an
optional trunk `0`.

## Out of Scope For Now

- Online payment.
- Coupons.
- Shipping.
- Order history stored in the database.
- Customer accounts.
