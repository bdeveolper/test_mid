# TASKS.md

Phase-by-phase checklist for **Scrub Store**. Check off items as they are completed.

## Phase 1: Setup and Layout

- [x] Project setup (Vite, React, Tailwind, router, Cairo font, RTL).
- [x] Header, footer, and layout wrapper.
- [x] Routing with placeholder pages.
- [x] Mock product data (scrubs, footwear, accessories) and `productService`.

## Phase 2: Customer Pages (UI with Mock Data)

- [x] Home grid with category filter and product-card size/color selection.
- [x] Product cards with variant stock availability and add-to-cart action.
- [x] Whole-card product links with mobile horizontal option chips and aligned card actions.
- [x] Product details with image gallery, variant selection, and stock-limited quantity.
- [x] Size and color selection with stock logic.
- [x] Empty and loading states.

## Phase 3: Cart and Checkout (UI)

- [x] Cart context with `localStorage`.
- [x] Cart icon with count.
- [x] Cart page with quantity, remove, and total.
- [x] WhatsApp invoice builder.
- [x] Checkout form with customer details and WhatsApp order submission.

## Phase 4: Admin UI (Mock Data, No Real Saving)

- [x] Admin layout and navigation.
- [x] Products list.
- [x] Product form (name, description, category, price, active toggle).
- [x] Image upload UI with previews and removal.
- [x] Variants editor with duplicate prevention.

## Phase 5: Backend (Supabase)

- [ ] Tables and RLS.
- [ ] Storage bucket.
- [ ] Replace mock service.
- [ ] Admin auth.
- [ ] Real saving of products, variants, and images.

## Phase 6: Polish and Deploy

- [x] Responsive professional store header with navigation and product search.
- [x] About and contact pages.
- [x] Home page hero banner with responsive image and product call to action.
- [x] Full-bleed responsive Home hero banner aligned with the page content.
- [x] Full-width marketplace layout with centered 1600px content and responsive five-column product grid.
- [x] Full-width footer with store details and customer navigation links.
- [x] Branded footer with WhatsApp contact and current-year copyright.
- [x] Shared back navigation on customer pages and a home link on the 404 page.
- [x] Responsive review on mobile, tablet, and desktop.
- [x] Arabic and RTL review.
- [ ] Deploy to Vercel and connect domain.
