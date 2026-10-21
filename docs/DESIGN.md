# DESIGN.md

Visual system for **Scrub Store**.

## Direction

Clean, professional, and trustworthy, suited to healthcare workers and students. Lots of white
space, clear product photos, and large readable Arabic text.

## Colors

Defined in the Tailwind config as `brand`, `accent`, `neutral`, `danger`, and `success`.

| Token | Hex | Usage |
| --- | --- | --- |
| `brand-600` | `#0F766E` | Primary buttons and links. |
| `brand-50` | `#F0FDFA` | Light backgrounds. |
| `accent-500` | `#F59E0B` | Prices and highlights. |
| `neutral-900` | `#111827` | Headings. |
| `neutral-600` | `#4B5563` | Body text. |
| `neutral-100` | `#F3F4F6` | Borders and card backgrounds. |
| `danger-600` | `#DC2626` | Errors and out of stock. |
| `success-600` | `#16A34A` | Success messages. |

## Typography

- **Cairo** is the default sans font.
- Body text is `text-base` with a relaxed line-height.
- Headings are `font-bold`.
- Prices are `font-bold` in the accent color.

## Layout

- Outer (full-width) wrapper: `w-full px-4 sm:px-6 lg:px-10`.
- Inner content wrapper: `mx-auto w-full max-w-[1600px]`.
- The header, hero background, and section backgrounds span the full width; only their content uses the inner wrapper.
- The home page header overlays the hero with a translucent, blurred background; other pages use a
  sticky solid header. Both include the store name and a cart icon with count.
- Simple footer with the store name and copyright.
- Product cards are `rounded-2xl`, with a `neutral-100` border and a subtle shadow on hover. The image is a stretched link to product details; cards show category, a two-line-clamped name, price, and a round quick-view action. One-size products show a compact badge beside the price.
- Quick view is a responsive modal: a bottom sheet on mobile and a centered two-column dialog from `md`, with the product image at the start and variant selection at the end. Its close header and quantity/add-to-cart footer stay fixed while the modal body scrolls; sizes wrap on mobile, and one-size products show no size row.
- A fixed WhatsApp quick-inquiry button appears near the lower edge of customer pages when the store WhatsApp number is configured.

## Responsive Breakpoints

- **mobile** (default): 1 to 2 columns, full-width buttons.
- **sm** (640px): 2 columns.
- **md** (768px): 3 columns.
- **lg** (1024px): 4 columns and side-by-side product details.
- Product images are `aspect-square` at every size.

## Component Conventions

- Buttons have a minimum height of 44px, `rounded-xl`, and a clear disabled state.
- Category and size/color filter chips are `rounded-full`, with a `brand-600` background when
  selected.
- Loading and empty states are always present for lists.
- Images use lazy loading, `object-cover`, and a `neutral-100` placeholder background.
