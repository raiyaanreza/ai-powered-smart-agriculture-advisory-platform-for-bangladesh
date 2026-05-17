# AGENTS.md

> **Role**: AI Coding Agent Instructions for the **AgriVision Admin Command Center**  
> **Target Folder**: `apps/admin/`  
> **Last Updated**: 2026-05-17

You are an AI coding agent working specifically on the **AgriVision Admin Command Center** dashboard. This app is dedicated to government officials, agricultural inspectors, and pathologists.

---

## 1. Local App Principles

1. **Role-Based Access Enforcement**  
   - Every view and subcomponent within `apps/admin/` is strictly gated to users with the `admin` role.
   - Session authentication is verified inside `app/page.tsx` using `useAuth` from `@/features/auth/hooks/useAuth`.
   - Never expose admin controls in open, unauthenticated pages.

2. **Feature-Based Decomposition & Modularity**  
   - Keep the core routing wrapper [page.tsx](file:///e:/agri-ai-platform/apps/admin/app/page.tsx) extremely lean (< 200 lines).
   - All sub-views and tab panels must reside inside their specific directories under `features/` (e.g. `features/overview/components/OverviewTab.tsx`, `features/verification/components/VerificationTab.tsx`).
   - Reusable layout components go to `features/common/components/`.

3. **Geospatial GIS Best Practices**  
   - The map layer [OutbreakMap.tsx](file:///e:/agri-ai-platform/apps/admin/features/admin/components/OutbreakMap.tsx) uses dynamic client-side loading to prevent Next.js server-side rendering (SSR) failures related to the Leaflet package.
   - Always load map packages dynamically via `next/dynamic` with `ssr: false`.

4. **Security & Supabase Integrity**  
   - All database sync transactions use `supabaseAdmin` wrapper from `@/lib/supabase` to handle administrative permissions securely on the backend.
   - Never leak or expose sensitive admin tokens/service role keys to public repositories or non-admin roles.

---

## 2. Design System Guidelines

- **Theme Colors**: Standardize on `#052E16` (Deep Forest Green) as the primary brand color for borders and backgrounds.
- **Glassmorphism**: Use pure white containers with `border-slate-100`, high rounded corners (`rounded-[2.5rem]` or `rounded-[3.5rem]`), and soft shadows (`shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)]`).
- **Smooth Animations**: Leverage `framer-motion` for transitions inside `AnimatePresence` when switching tabs.
