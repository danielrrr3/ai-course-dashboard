# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Important: Non-standard Next.js version

This is **Next.js 16.2.4** — APIs and conventions may differ from training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev      # start dev server (usually http://localhost:3000)
npm run build    # production build
npm run start    # run production build
```

No test runner or linter is configured.

## Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`, not a `tailwind.config` file. Utility classes are available but most component styling uses inline CSS variables.
- **Fonts** loaded via `next/font/google` in `layout.tsx` and exposed as CSS variables (`--font-serif`, `--font-sans`).

## Architecture

**Layout model:** `layout.tsx` renders a fixed two-column shell — `<Sidebar>` (240px, fixed left) + `<main>` (flex: 1, scrollable). All pages render as children of `<main>`.

**Styling approach:** Custom CSS classes are defined in `globals.css` (`.sidebar`, `.nav-item`, `.nav-item--active`, etc.) for structural/stateful styles. Inline `style` props using CSS variables handle all component-level theming. Avoid adding Tailwind utility classes to existing components — the pattern here is CSS variables + inline styles.

**CSS variables** (defined in `:root` in `globals.css`) are the single source of truth for the color theme. Key tokens:
- `--bg`, `--sidebar`, `--surface` — backgrounds
- `--accent` — primary brand color (terracotta `#C4532A`)
- `--text-hi`, `--text-mid`, `--text-lo` — text hierarchy
- `--font-serif` / `--font-sans` — typography

**Data:** `frontend-sample-data.ts` in the project root exports typed arrays (`metrics`, `monthlyRevenue`, `weeklyCustomers`, `salesByCategory`, `recentOrders`, `reports`, `teamMembers`, `recentActivity`) for a fictional coffee shop (Riyadh Roast). Import directly: `import { metrics } from '../frontend-sample-data'`.

**Client vs Server components:** Components that use event handlers or `usePathname` must have `'use client'` at the top. `Sidebar` and `MetricCard` are both client components. `layout.tsx` and `page.tsx` are server components.
