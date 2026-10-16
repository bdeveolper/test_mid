# AGENTS.md

Main instruction file for coding agents working on **Scrub Store**.

## Project Overview

Scrub Store is an Arabic (RTL), fully responsive e-commerce website for selling medical scrubs
(scrub sets, lab coats, and uniforms) and complementary accessories for doctors, nurses, and
medical students in Egypt. Accessories include shoes such as Crocs-style clogs, nurse watches,
badge reels, and stethoscope cases. Customers browse products, choose size and color, add to cart,
and send the order via WhatsApp as a formatted invoice. The store owner manages products from an
admin dashboard. Phase 1 uses mock data, and Phase 5 switches to Supabase.

**Before making any change, read these files first:**

- `docs/SPEC.md` - requirements, data model, page list, invoice format
- `docs/DESIGN.md` - visual system, colors, typography, layout, component conventions
- `docs/TASKS.md` - phase-by-phase checklist of what to build

## Tech Stack

- **React 18+** with **Vite**
- **Tailwind CSS**
- **react-router-dom** for routing
- **React Context** for cart state
- **Cairo** font from Google Fonts
- **Phase 1 to 4:** mock data in `src/services/productService.js`
- **Phase 5 onward:** Supabase (PostgreSQL, Storage, Auth)

## Commands

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Lint the codebase
npm run lint
```

Always run `npm run build` after changes and fix all errors before finishing.

## Language Rules

- All user-facing text is in **Arabic**.
- Code, variable names, comments, and file names are in **English**.
- The root element uses `dir="rtl"` and `lang="ar"`.
- Use **logical Tailwind classes** (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) instead of
  physical ones (`ml-`, `mr-`).
- Currency is **EGP**, shown as `ج.م`, with **Western digits**.

## Responsive Rules

- The site must work on all screen sizes.
- Breakpoints: **mobile** below 640px, **tablet** 640px to 1024px, **desktop** above 1024px.
- Mobile-first, using `sm:`, `md:`, `lg:`, `xl:` for larger screens.
- Product grid: **2 columns on mobile, 3 on tablet, 4 on desktop**.
- Tap targets at least **44px**.
- Never use fixed pixel widths for containers; use `max-w-*` with `mx-auto`.

## Architecture Rules

- Components live in `src/components/`.
- Pages live in `src/pages/`.
- Shared logic lives in `src/lib/`, `src/context/`, and `src/services/`.
- Pages never call Supabase or mock data directly; they go through
  `src/services/productService.js`.
- Cart logic lives only in `src/context/CartContext.jsx`.
- Invoice building lives only in `src/lib/whatsappInvoice.js`.
- Components stay under about **150 lines**.
- Secrets and config come from `import.meta.env.VITE_*`.

## Safety Rules When Editing

1. Read the relevant files before editing.
2. Make the smallest change that completes the task; no unrelated refactors.
3. Do not rename or remove exported functions, components, or routes unless asked, and update
   every import if you do.
4. Do not install new dependencies without asking first and naming the package and reason.
5. Do not remove existing features to make something work; explain blockers instead.
6. Never put the Supabase `service_role` key in frontend code.
7. Wrap every `localStorage` access in `try/catch`.
8. After finishing, run `npm run build`, list the changed files, and summarize in 3 to 5 lines.
9. Check off completed items in `docs/TASKS.md`.

## Things to Avoid

- No `<form>` tags that submit to a backend without `preventDefault`.
- No `alert()`; use inline messages or a toast.
- No hardcoded WhatsApp number, store name, or Supabase keys.
- No UI library (MUI, Chakra, etc.) unless asked.

## Scope Rule

Do only the task you are given. If the task is unclear or would touch many unrelated files, stop
and present a plan first.
