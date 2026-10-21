# TASKS.md

Phase-by-phase checklist for **Scrub Store**. Check off items as they are completed.

## Phase 1: Setup and Layout

- [x] Project setup (Vite, React, Tailwind, router, Cairo font, RTL).
- [x] Header, footer, and layout wrapper.
- [x] Routing with placeholder pages.
- [x] Mock product data (scrubs, footwear, accessories) and `productService`.

## Phase 2: Customer Pages (UI with Mock Data)

- [x] Home grid with category filter and product-card size/color selection.
- [x] Simplified product cards with a Quick View modal for variant, quantity, and cart selection.
- [x] Whole-card product links with a Quick View action and consistent card heights.
- [x] Product details with image gallery, variant selection, and stock-limited quantity.
- [x] Size and color selection with stock logic.
- [x] One-size products use a color-only selector and retain the one-size value in the cart.
- [x] Empty and loading states.

## Phase 3: Cart and Checkout (UI)

- [x] Cart context with `localStorage`.
- [x] Cart icon with count.
- [x] Cart page with quantity, remove, and total.
- [x] WhatsApp invoice builder.
- [x] Checkout form with customer details and WhatsApp order submission.
- [x] Country selector, country-aware phone validation, and E.164 phone formatting in invoices.

## Phase 4: Admin UI (Mock Data, Temporary Local Persistence)

- [x] Admin layout and navigation.
- [x] Products list with name search and category filtering.
- [x] Product form (name, description, category, price, active toggle).
- [x] Image upload UI with previews and removal.
- [x] Structured color-and-size variants editor with category-specific sizes and stock.
- [x] Shared product data persisted in localStorage for customer and admin service calls.

## Phase 5: Backend (Supabase)

- [x] Database tables and RLS (written, not yet run).
- [x] Storage bucket for images (written, not yet run).
- [x] Replace mock service with Supabase-backed product reads, writes, and image upload (requires schema deployment and environment configuration).
- [ ] Admin auth.
- [ ] Real saving of products, variants, and images.

## Phase 6: Polish and Deploy

- [x] Responsive professional store header with navigation and product search.
- [x] About and contact pages.
- [x] Contact page with the message form removed and direct contact details in a centered single-column card.
- [x] Home page hero banner with responsive image and product call to action.
- [x] Full-bleed responsive Home hero banner aligned with the page content.
- [x] Full-width marketplace layout with centered 1600px content and responsive five-column product grid.
- [x] Full-width footer with store details and customer navigation links.
- [x] Branded footer with WhatsApp contact and current-year copyright.
- [x] Fixed WhatsApp button for quick inquiries on customer pages.
- [x] Shared back navigation on customer pages and a home link on the 404 page.
- [x] Responsive review on mobile, tablet, and desktop.
- [x] Arabic and RTL review.
- [ ] Deploy to Vercel and connect domain.
