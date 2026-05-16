# AI Coding Agent Instructions: apps/web (Farmer Portal)

> **Role**: Frontend Agent for the AgriVision Farmer Portal
> **Stack**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Zustand, TanStack Query

## 1. Golden Rules for Frontend
1. **Never use the Supabase Service Role Key** (`supabaseAdmin`) in this package, except strictly inside `app/api/` routes. Client-side code MUST ONLY use the anon key.
2. **Never call Gemini directly from the client**. Use `/api/diagnose` or a backend microservice.
3. **No God Components**. If a component exceeds 150 lines or handles state + fetching + UI, split it into:
   - `components/` (pure UI)
   - `hooks/` (state & React Query)
   - `api/` (Axios calls)
4. **No Hardcoded Strings**. Every English or Bengali text must be mapped through the `next-intl` system (using `messages/en.json` and `messages/bn.json`).

## 2. State Management
- **Server State**: Must use TanStack Query (`@tanstack/react-query`). Do NOT use `useEffect` for data fetching.
- **Client Global State**: Must use Zustand (`zustand`). Do NOT use Context API unless strictly necessary.
- **Client Local State**: Use `useState` only for simple, isolated UI toggles.

## 3. Styling Guidelines
- Use strictly Tailwind CSS 4 classes.
- Avoid inline `style={{...}}` blocks. The "premium" gradient/glassmorphism effects should be added via `tailwind.config.ts` (or `@tailwindcss/postcss` setup) as reusable utility classes.

<!-- BEGIN:nextjs-agent-rules -->
# Note: This is Next.js 16 (Experimental)
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
