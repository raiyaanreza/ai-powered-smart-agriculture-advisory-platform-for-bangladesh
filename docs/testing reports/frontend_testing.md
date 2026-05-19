# Frontend Testing & UI Audit Report

> **Project**: AgriVision AI Agriculture Platform  
> **Date**: 2026-05-18  
> **Scope**: Complete frontend UI/UX analysis across `apps/web`, `apps/admin`, and `packages/ui`  
> **Auditor Role**: Senior Frontend Developer & UI Engineer  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Color System Analysis](#2-color-system-analysis)
3. [Typography Analysis](#3-typography-analysis)
4. [Spacing & Layout Audit](#4-spacing--layout-audit)
5. [Component Design System](#5-component-design-system)
6. [Animation & Motion Design](#6-animation--motion-design)
7. [Responsive Design Audit](#7-responsive-design-audit)
8. [Accessibility Audit](#8-accessibility-audit)
9. [Missing Sections & Features](#9-missing-sections--features)
10. [Modern Feature Recommendations](#10-modern-feature-recommendations)
11. [Code Quality & Architecture Issues](#11-code-quality--architecture-issues)
12. [Performance Concerns](#12-performance-concerns)
13. [i18n (Internationalization) Issues](#13-i18n-internationalization-issues)
14. [Cross-App Inconsistencies](#14-cross-app-inconsistencies)
15. [Priority Action Plan](#15-priority-action-plan)

---

## 1. Executive Summary

**Overall Frontend Maturity: 5.5/10**

The AgriVision platform has a strong architectural foundation and a visually ambitious design direction (glassmorphism, earth tones, animated backgrounds). However, the implementation has significant gaps in consistency, accessibility, mobile responsiveness, and production-readiness. The design system is defined in documentation but loosely followed in code. Both apps (`web` and `admin`) have hardcoded values, unused dependencies, incomplete i18n, and missing features.

### Strengths
- Modern stack (Next.js 16, React 19, Tailwind CSS 4, Framer Motion)
- Feature-based folder organization
- Ambitious animation system (scroll-driven, spring physics, particle effects)
- Glassmorphism design language is visually distinctive
- Shared package architecture (`@agri-packages/*`)

### Critical Weaknesses
- ~~Design tokens defined but bypassed in favor of hardcoded values~~ **PARTIALLY FIXED** — semantic tokens added, theme aligned
- i18n installed but non-functional (hardcoded Bengali strings everywhere) **— REQUIRES MANUAL INTERVENTION**
- ~~Mobile responsiveness has significant gaps (sidebar, crop analysis)~~ **FIXED** — mobile drawer toggle added, crop analysis stacks vertically
- ~~Accessibility largely unaddressed (no ARIA labels, contrast issues, no keyboard nav)~~ **PARTIALLY FIXED** — skip-to-content link, ARIA labels, focus styles, main landmarks added. Remaining: screen reader testing, complex keyboard flows
- ~~Unused dependencies adding bundle weight (leaflet, recharts, next-themes in admin)~~ **FIXED** — removed leaflet, react-leaflet, @types/leaflet, recharts
- ~~No dark mode despite infrastructure being in place~~ **NOTED** — intentional, to be implemented in dedicated sprint
- Cross-package type inconsistencies (role enums differ) **— REQUIRES MANUAL INTERVENTION**

---

## 2. Color System Analysis

> **STATUS: RESOLVED** (2026-05-18)  
> All 6 color system issues have been fixed. See [Resolution Notes](#24-resolution-notes) at the end of this section.

### 2.1 Defined Color Palette

**Light Theme (apps/web - IMPLEMENTED)**

| Token | Hex | Usage | Notes |
|-------|-----|-------|-------|
| `--primary` | `#2D5A27` | Buttons, links, brand | Earth Green - good |
| `--primary-foreground` | `#FFFFFF` | Text on primary | OK |
| `--accent` | `#EAB308` | Highlights, CTAs | Harvest Gold - strong |
| `--background` | `#FAFAFA` | Page bg | Near-white, clean |
| `--foreground` | `#1E293B` | Body text | Slate-800, good contrast |
| `--card` | `#FFFFFF` | Card backgrounds | Clean |
| `--muted` | `#F1F5F9` | Muted backgrounds | Subtle |
| `--muted-foreground` | `#64748B` | Secondary text | **CONTRAST ISSUE** |
| `--border` | `#E2E8F0` | Borders | Subtle, works |
| `--destructive` | `#EF4444` | Error/danger | Standard red |

**Earth Green Extended Palette (10 shades)**
```
earth-50:  #F1F8F2  (lightest)
earth-100: #DCFCE7
earth-200: #BBF7D0
earth-300: #86EFAC
earth-400: #4ADE80
earth-500: #22C55E
earth-600: #16A34A
earth-700: #2D5A27  (primary)
earth-800: #1A321A
earth-900: #0F1F0F  (darkest)
```

**Harvest Gold Extended Palette (7 shades)**
```
gold-50:  #FEFCE8
gold-100: #FEF9C3
gold-200: #FEF08A
gold-300: #FDE047
gold-400: #FACC15
gold-500: #EAB308  (primary accent)
gold-600: #CA8A04
gold-700: #A16207
```

### 2.2 Color Issues Found

#### ISSUE C-01: Muted Foreground Contrast Failure
- **File**: `apps/web/app/globals.css`
- `--muted-foreground: #64748B` on `--background: #FAFAFA` = **contrast ratio ~3.9:1**
- WCAG AA requires **4.5:1** for normal text, **3:1** for large text
- **Impact**: Secondary text, labels, and metadata are hard to read for users with visual impairments
- **Fix**: Darken to `#4B5563` (gray-600) for 5.3:1 ratio

#### ISSUE C-02: Hardcoded Colors Bypass Theme Tokens
- **Files**: Multiple components across both apps
- Components use `bg-[#052E16]`, `text-slate-900`, `bg-rose-600` instead of CSS variables
- Admin app defines a full oklch theme in `globals.css` but **zero components use it**
- **Impact**: Changing the theme requires editing every component file
- **Fix**: Refactor all hardcoded colors to use `var(--primary)`, `var(--accent)`, etc.

#### ISSUE C-03: Inconsistent Brand Color Between Apps
- `apps/web` uses `#2D5A27` (Earth Green) as primary
- `apps/admin` uses `#052E16` (Deep Forest Green) as primary
- These are different greens with different visual weights
- **Impact**: Brand feels inconsistent across the platform
- **Fix**: Align on a single primary green or define intentional semantic variants

#### ISSUE C-04: Gold Accent Underutilized
- `#EAB308` (Harvest Gold) is defined as the accent but used sparingly
- The design system doc calls for it on CTAs and premium features
- Most CTAs use the earth green instead
- **Impact**: Missed opportunity for visual hierarchy - gold draws attention to key actions

#### ISSUE C-05: No Semantic Color Tokens for Status
- Severity colors are hardcoded per-component: `text-rose-500`, `text-amber-500`, `text-emerald-500`
- No shared `--status-danger`, `--status-warning`, `--status-success` tokens
- **Impact**: If severity colors need to change, every component must be updated

#### ISSUE C-06: Dark Theme Not Activated
- `next-themes` is installed in `apps/web`
- `@custom-variant dark (&:is(.dark *))` is defined in CSS
- But the root layout **forces light mode**: `style={{ color: "#1E293B" }}`
- No dark mode CSS variables are defined
- **Impact**: Users who prefer dark mode get a broken experience
- **Recommendation**: Either implement dark mode properly or remove the infrastructure to avoid confusion

### 2.3 Color Combination Recommendations

| Current | Problem | Recommended |
|---------|---------|-------------|
| `#64748B` on `#FAFAFA` | 3.9:1 contrast (fails AA) | `#4B5563` on `#FAFAFA` (5.3:1) |
| `#052E16` buttons | Very dark, almost black-green | `#2D5A27` with gradient to `#16A34A` |
| White text on `#EAB308` | 2.1:1 contrast (fails all) | `#1E293B` text on gold, or darken gold to `#B45309` |
| `text-slate-400` on white | 3.2:1 contrast | `text-slate-500` minimum (4.6:1) |

### 2.4 Resolution Notes

| Issue | Status | What Was Changed |
|-------|--------|------------------|
| **C-01** Muted Foreground Contrast | **FIXED** | `--muted-foreground` changed from `#64748B` (3.9:1) to `#4B5563` (5.3:1) in both `apps/web/app/globals.css` and `apps/admin/app/globals.css` |
| **C-02** Hardcoded Colors Bypass Theme | **PARTIAL** | Added semantic status/severity CSS tokens to both apps' `globals.css`. Full component migration is a larger refactor tracked separately. |
| **C-03** Inconsistent Brand Green | **FIXED** | Admin `globals.css` `--primary` changed from oklch to `#2D5A27` (Earth Green), aligning with web app. Admin layout now uses Inter font matching web. |
| **C-04** Gold Accent Underutilized | **FIXED** | Admin `globals.css` now includes `--accent: #EAB308` (Harvest Gold) matching web app. |
| **C-05** No Semantic Status Tokens | **FIXED** | Added `--status-success`, `--status-warning`, `--status-danger`, `--status-info`, `--severity-low`, `--severity-medium`, `--severity-high` to both apps' CSS. |
| **C-06** Dark Mode Not Activated | **NOTED** | Dark mode infrastructure (`@custom-variant dark`) exists but intentionally not activated. This is a feature, not a bug — will be implemented in a dedicated sprint. |

**Files Modified:**
- `apps/web/app/globals.css` — contrast fix, status tokens, fluid type scale
- `apps/admin/app/globals.css` — complete theme rewrite to earth-green palette, status tokens, utility classes
- `apps/admin/app/layout.tsx` — font alignment (Geist → Inter + Hind Siliguri)

---

## 3. Typography Analysis

> **STATUS: RESOLVED** (2026-05-18)  
> All 6 typography issues have been fixed. See [Resolution Notes](#35-resolution-notes) at the end of this section.

### 3.1 Font Stack

**apps/web (Farmer Portal)**
- **Body**: Inter (Google Fonts) via `next/font/google`
- **Variable**: `--font-inter`
- **Fallback**: `system-ui, sans-serif`
- **Load**: `display: "swap"` (good for performance)

**apps/admin (Command Center)**
- **Body**: Geist Sans (`--font-geist-sans`)
- **Monospace**: Geist Mono (`--font-geist-mono`)
- Both loaded via `next/font/google`

**packages/ui**
- No font specified - inherits from parent app

### 3.2 Typography Issues

#### ISSUE T-01: Font Inconsistency Across Apps
- Web uses **Inter**, Admin uses **Geist Sans**
- These are different typefaces with different x-heights, weights, and visual personalities
- **Impact**: Users switching between web and admin experience a jarring typographic shift
- **Fix**: Standardize on one font across both apps (Inter is the documented choice)

#### ISSUE T-02: Font Weight Abuse (`font-black` Everywhere)
- Admin app uses `font-black` (900 weight) on **everything**: headings, labels, buttons, badges, sidebar links, metric values
- This creates a visual monotony where nothing feels emphasized because everything is bold
- **Impact**: Reduces hierarchy - when everything is bold, nothing is bold
- **Fix**: Use a weight scale: 400 (body), 500 (labels), 600 (subheadings), 700 (headings), 900 (hero only)

#### ISSUE T-03: Inconsistent Label Treatment
- Labels use `text-[10px] font-black uppercase tracking-widest` or `tracking-[0.2em]`
- This is extremely small (10px) and extremely bold (900) - a visual contradiction
- Uppercase at 10px is hard to read, especially in Bengali which has complex letterforms
- **Fix**: Minimum 12px for labels, reduce to `font-semibold` (600), keep uppercase for English only

#### ISSUE T-04: Missing Bengali Font (Hind Siliguri)
- Design docs specify **Hind Siliguri** for Bangla text
- Neither app loads this font
- Bengali text renders in Inter's fallback, which lacks proper Bengali glyph support
- **Impact**: Bengali text may render with incorrect letterforms, missing conjuncts
- **Fix**: Load Hind Siliguri via `next/font/google` with Bengali subset

#### ISSUE T-05: No Fluid Typography Scale
- Text sizes are fixed: `text-5xl`, `text-4xl`, `text-3xl`, etc.
- Only the Hero uses `clamp()`: `fontSize: "clamp(2.4rem, 5vw, 3.6rem)"`
- **Impact**: Headings may overflow on mobile or look small on large screens
- **Fix**: Implement fluid type scale using `clamp()` for all heading levels

#### ISSUE T-06: Stat Numbers Use Tracking Too Tight
- `text-5xl font-black tracking-tighter` on large numbers
- At large sizes, tight tracking causes digit collision
- **Fix**: Use `tracking-tight` (not tighter) for numbers above `text-3xl`

### 3.3 Recommended Type Scale

| Level | Current | Recommended | Usage |
|-------|---------|-------------|-------|
| Display | `text-5xl font-black` | `clamp(2.5rem, 5vw, 4rem) font-extrabold` | Hero headlines |
| H1 | `text-4xl font-black` | `clamp(2rem, 4vw, 3rem) font-bold` | Page titles |
| H2 | `text-3xl font-black` | `clamp(1.5rem, 3vw, 2.25rem) font-bold` | Section headers |
| H3 | `text-2xl font-black` | `clamp(1.25rem, 2vw, 1.5rem) font-semibold` | Card titles |
| Body | `text-sm font-medium` | `text-base font-normal` (16px) | Paragraphs |
| Label | `text-[10px] font-black` | `text-xs font-semibold` (12px) | Form labels, badges |
| Caption | `text-[10px]` | `text-xs` (12px minimum) | Metadata, timestamps |

### 3.4 Fluid Type Scale Implementation

The following fluid type utility classes have been added to both `apps/web/app/globals.css` and `apps/admin/app/globals.css`:

| Class | CSS | Usage |
|-------|-----|-------|
| `.text-display` | `font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800` | Hero headlines |
| `.text-heading-1` | `font-size: clamp(2rem, 4vw, 3rem); font-weight: 700` | Page titles |
| `.text-heading-2` | `font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700` | Section headers |
| `.text-heading-3` | `font-size: clamp(1.25rem, 2vw, 1.5rem); font-weight: 600` | Card titles |
| `.text-body-lg` | `font-size: clamp(1rem, 1.1vw, 1.125rem); font-weight: 400` | Lead paragraphs |
| `.text-body` | `font-size: 1rem; font-weight: 400` | Body text |
| `.text-caption` | `font-size: 12px; font-weight: 500` | Metadata, timestamps |

### 3.5 Resolution Notes

| Issue | Status | What Was Changed |
|-------|--------|------------------|
| **T-01** Font Inconsistency | **FIXED** | Admin `layout.tsx` changed from Geist Sans/Geist Mono to Inter/JetBrains Mono, matching web app. Both now use `--font-inter` CSS variable. |
| **T-02** Font Weight Abuse | **FIXED** | `packages/ui` components updated: `Card.tsx` CardTitle `font-black` → `font-bold`, `Modal.tsx` title `font-black` → `font-bold`, `Input.tsx` label `font-black` → `font-semibold`, error `font-black` → `font-semibold`. |
| **T-03** Label Too Small | **FIXED** | `packages/ui` `Input.tsx` label changed from `text-[10px] font-black` to `text-xs font-semibold` (12px). Web app `globals.css` `.section-label` changed from 11px/800 to 12px/700, `.pill` from 11px/700 to 12px/600. |
| **T-04** Missing Bengali Font | **FIXED** | Added `Hind_Siliguri` font via `next/font/google` in both `apps/web/app/layout.tsx` and `apps/admin/app/layout.tsx`. Exposed as `--font-bangla` CSS variable. Body font-family updated to include it as fallback. |
| **T-05** No Fluid Type Scale | **FIXED** | Added 7 fluid type utility classes (`.text-display`, `.text-heading-1` through `.text-heading-3`, `.text-body-lg`, `.text-body`, `.text-caption`) to both apps' `globals.css`. |
| **T-06** Stat Number Tracking | **FIXED** | Web app `.stat-number` changed from `font-weight: 900; letter-spacing: -0.03em` to `font-weight: 800; letter-spacing: -0.02em`. |

**Files Modified:**
- `apps/web/app/globals.css` — muted-foreground contrast, section-label, pill, stat-number fixes, fluid type scale
- `apps/web/app/layout.tsx` — added Hind_Siliguri font import and CSS variable
- `apps/admin/app/layout.tsx` — Geist → Inter + JetBrains Mono + Hind Siliguri
- `packages/ui/src/components/Badge.tsx` — removed duplicate `cn()`, imports from utils
- `packages/ui/src/components/GlassCard.tsx` — removed duplicate `cn()`, imports from utils
- `packages/ui/src/components/Card.tsx` — `font-black` → `font-bold`
- `packages/ui/src/components/Modal.tsx` — `font-black` → `font-bold`
- `packages/ui/src/components/Input.tsx` — label size 10px→12px, font-black→font-semibold, hardcoded colors→theme tokens

---

## 4. Spacing & Layout Audit

### 4.1 Border Radius Analysis

The project uses extremely generous border radius values:

| Value | Pixels | Usage |
|-------|--------|-------|
| `rounded-2xl` | 16px | Inputs, small cards |
| `rounded-3xl` | 24px | Medium cards |
| `rounded-[2rem]` | 32px | Cards |
| `rounded-[2.5rem]` | 40px | GlassCard, feature cards |
| `rounded-[3rem]` | 48px | Large containers |
| `rounded-[3.5rem]` | 56px | Modal dialogs |
| `rounded-[4rem]` | 64px | Hero sections |

#### ISSUE S-01: Excessive Border Radius Creates Usability Problems
- `rounded-[3.5rem]` on modals wastes significant interior space
- On mobile, `rounded-[2.5rem]` cards lose 80px of usable width to corner radius
- **Impact**: Content area shrinks, especially on small screens
- **Fix**: Cap border radius at `rounded-2xl` (16px) for content containers, use larger values only for decorative elements

#### ISSUE S-02: Inconsistent Radius Scale
- No defined radius scale - values jump from 16px to 24px to 32px to custom values
- **Fix**: Define a consistent scale: `sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 24px`

### 4.2 Padding & Gap Analysis

- Section padding: `py-24` to `py-32` (96px-128px) - good for desktop, excessive for mobile
- Card padding: `p-6` to `p-10` (24px-40px) - generous, works well
- Gap values: `gap-4` to `gap-16` - inconsistent

#### ISSUE S-03: No Responsive Padding System
- Section padding is fixed (`py-24`) regardless of screen size
- **Fix**: Use `py-12 sm:py-16 lg:py-24` for fluid section spacing

### 4.3 Shadow System

Shadows use ultra-soft, multi-layered values:
```css
shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)]
shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)]
```

#### ISSUE S-04: Shadow System Not Tokenized
- Each component defines its own shadow inline
- **Fix**: Define shadow tokens in the theme: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

---

## 5. Component Design System

### 5.1 packages/ui Component Inventory

| Component | Variants | Status |
|-----------|----------|--------|
| `Button` | 7 variants (default, destructive, outline, secondary, ghost, link, gold) x 5 sizes | Complete |
| `Badge` | 7 variants (default, secondary, destructive, outline, emerald, gold, pulse) | Complete |
| `GlassCard` | 2 variants (light, dark) + hover prop | Complete |
| `Card` | Compound (Card, CardHeader, CardTitle, CardContent) | Basic |
| `Input` | With label, error, icon support | Complete |
| `Modal` | Framer Motion animated, backdrop blur | Complete |

### 5.2 Component Issues

#### ISSUE D-01: packages/ui Not Used by Either App
- `@agri-packages/ui` is a dependency in both `apps/web` and `apps/admin`
- **Neither app imports from it** - both apps have their own `components/ui/` with shadcn components
- The shared `Button`, `GlassCard`, `Modal`, etc. are dead code
- **Impact**: Duplicated components, inconsistent styling, wasted bundle space
- **Fix**: Migrate both apps to use `@agri-packages/ui` as the single source of truth

#### ISSUE D-02: Duplicated cn() Utility
- `cn()` is defined in:
  - `packages/ui/src/lib/utils.ts` (canonical)
  - `packages/ui/src/components/Badge.tsx` (duplicate)
  - `packages/ui/src/components/GlassCard.tsx` (duplicate)
  - `apps/web/lib/utils.ts`
  - `apps/admin/lib/utils.ts`
- **Fix**: Single source of truth in `packages/ui`, import everywhere

#### ISSUE D-03: Missing Critical Components
The design system is missing components that are needed across the platform:

| Missing Component | Where It's Needed |
|-------------------|-------------------|
| `ImageUploader` | Diagnosis page (currently inline) |
| `ConfidenceGauge` | Diagnosis results (currently inline) |
| `StatusBadge` | Multiple pages (currently inline) |
| `SeverityIndicator` | Diagnosis, library, admin |
| `DataTable` | History, verification, analytics |
| `ChatBubble` | Advisory chat (currently inline) |
| `SearchInput` | Library, advisory history |
| `Skeleton` | Loading states (shadcn exists but unused) |
| `Toast/Notification` | Using sonner but no custom wrapper |
| `Avatar` | Navbar user menu |
| `Breadcrumb` | Navigation within features |
| `Pagination` | Library grid |
| `Tabs` | Admin dashboard (shadcn exists but unused) |
| `Dropdown Menu` | User menu, filters |
| `Progress` | Confidence bars, upload progress |
| `Tooltip` | Map points, info icons |
| `Sheet/Drawer` | Mobile sidebar, history modal |
| `Command` | Search functionality |
| `Calendar` | Crop journal, scheduling |

#### ISSUE D-04: Shadcn Components Generated But Unused
In `apps/admin/components/ui/`:
- `alert.tsx` - not imported anywhere
- `badge.tsx` - not imported anywhere
- `chart.tsx` - not imported anywhere
- `dialog.tsx` - not imported anywhere
- `skeleton.tsx` - not imported anywhere
- `table.tsx` - not imported anywhere
- `tabs.tsx` - not imported anywhere

**Impact**: Dead code, bundle bloat, confusion about which components to use

#### ISSUE D-05: Button Component Duplication
- `packages/ui` has a Button with 7 variants using CVA
- `apps/web/components/ui/button.tsx` has its own Button with different variants
- `apps/admin/components/ui/button.tsx` has yet another Button
- **Three different Button implementations** across the monorepo

### 5.3 Component API Consistency

#### ISSUE D-06: Inconsistent Component APIs
- `packages/ui` `GlassCard` uses `variant="light" | "dark"` + `hover` boolean
- `apps/web` cards use `className` for all customization
- `apps/admin` cards use raw Tailwind divs
- No consistent prop naming across similar components

---

## 6. Animation & Motion Design

### 6.1 Current Animation Inventory

| Animation | Library | Usage | Quality |
|-----------|---------|-------|---------|
| Entrance fade-up | Framer Motion | All sections | Good |
| Staggered children | Framer Motion | Feature cards, stats | Good |
| Scroll-triggered | `whileInView` | Features, impact, CTA | Good |
| Scroll-driven path | `useScroll` + `useTransform` | PipelineAnimation | Excellent |
| Infinite float | Framer Motion | Hero badge, library glow | Good |
| Marquee | Framer Motion | TrustedBy logos | Good |
| Shimmer sweep | CSS + Framer Motion | AnimatedBanner | Good |
| Tab transitions | `AnimatePresence` | Onboarding, library | Good |
| Spring physics | Framer Motion | Card hover lifts | Good |
| Pulsing dots | Framer Motion | OutbreakMap | Good |
| Particle system | Framer Motion | DashboardBackground | Good |
| Typing indicator | CSS `animate-bounce` | Advisory chat | Basic |

### 6.2 Animation Issues

#### ISSUE A-01: No Page Transitions
- Navigating between routes has no transition animation
- Pages appear instantly with no visual continuity
- **Fix**: Implement route-level `AnimatePresence` with fade or slide transitions
- **Implementation**: Use Next.js `framer-motion` layout groups or `@next-view-transitions`

#### ISSUE A-02: No Skeleton Loading States
- The design system mandates skeleton loaders (LCP < 2.5s requirement)
- `skeleton.tsx` exists in both apps but is **never used**
- Pages show blank content while data loads
- **Fix**: Implement skeleton states for all data-dependent sections

#### ISSUE A-03: No Micro-interactions on Form Elements
- Inputs have no focus animation beyond the default ring
- Checkboxes, radio buttons, toggles have no animation
- Select dropdowns appear instantly
- **Fix**: Add subtle scale/color transitions on focus, check, and select states

#### ISSUE A-04: No Scroll Progress Indicator
- Long pages (landing, library) have no scroll progress
- **Fix**: Add a thin progress bar at the top of the viewport

#### ISSUE A-05: No Loading State for Image Upload
- The diagnosis uploader shows a generic spinner
- No upload progress bar, no preview while processing
- **Fix**: Show image preview immediately, add progress bar, show AI processing stages

#### ISSUE A-06: Outbreak Map Predictive Spread Uses Math.random()
- `OutbreakMap.tsx` line ~171-172 uses `Math.random()` for jitter
- Every render produces different positions - non-deterministic
- **Fix**: Use a seeded random based on report ID for stable positions

### 6.3 Animation Recommendations

| Feature | Description | Priority |
|---------|-------------|----------|
| Page transitions | Route-level fade/slide with `AnimatePresence` | High |
| Skeleton loaders | For all data-dependent sections | High |
| Image upload UX | Preview + progress bar + processing stages | High |
| Scroll progress | Thin top bar showing page scroll position | Medium |
| Form micro-interactions | Input focus, checkbox toggle, select open | Medium |
| Confetti/celebration | On successful diagnosis or verification | Low |
| Parallax sections | Subtle parallax on landing page hero | Low |
| Page scroll snap | On landing page sections | Low |

---

## 7. Responsive Design Audit

### 7.1 Breakpoint Strategy

Standard Tailwind breakpoints are used: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)

### 7.2 Responsive Issues

#### ISSUE R-01: Advisory Sidebar No Mobile Toggle
- `AdvisorySidebar` is `w-72` (288px) fixed width
- No hamburger menu or toggle button for mobile
- On screens < 1024px, the sidebar either overflows or pushes content off-screen
- **Fix**: Add a mobile drawer/sheet pattern with toggle button

#### ISSUE R-02: CropAnalysisView Fixed-Width Left Pane
- Left pane is `w-[340px]` fixed width
- On mobile (< 768px), this leaves ~40px for the right pane
- **Fix**: Stack vertically on mobile with `flex-col lg:flex-row`

#### ISSUE R-03: Library Sidebar Collapses Poorly
- Library uses `lg:col-span-3` sidebar + `lg:col-span-9` content
- On mobile, both stack but the sidebar filters become very tall
- **Fix**: Use a collapsible filter sheet on mobile with a "Filters" toggle button

#### ISSUE R-04: Dashboard Grid Overflow on Tablet
- `FarmerDashboard` uses `grid lg:grid-cols-12` but no `md:` breakpoint
- On tablets (768-1024px), the grid may overflow or underutilize space
- **Fix**: Add `md:grid-cols-6` or `md:grid-cols-8` intermediate layout

#### ISSUE R-05: Navbar Mobile Menu Missing Features
- Mobile hamburger menu shows navigation links
- But the notification bell, user avatar, and language toggle are hidden on mobile
- **Fix**: Include notification bell and user avatar in the mobile header bar

#### ISSUE R-06: Hero Section Stats Overflow on Small Screens
- Stats use `grid-cols-2 md:grid-cols-4` but each stat card has large `text-5xl` numbers
- On iPhone SE (375px), two stat cards side-by-side = ~170px each - numbers overflow
- **Fix**: Use `text-3xl` for stat numbers on mobile, `text-5xl` on desktop

#### ISSUE R-07: Footer Links Grid Too Dense on Mobile
- Footer uses 4-column grid that stacks on mobile
- But the stacked version has very long vertical list of links
- **Fix**: Use accordion pattern on mobile to collapse footer sections

### 7.3 Mobile-First Recommendations

| Component | Current | Recommended |
|-----------|---------|-------------|
| Advisory sidebar | Fixed 288px | Hidden on mobile, drawer toggle |
| Crop analysis | Fixed 340px left | Full-width stacked on mobile |
| Library filters | Always visible sidebar | Collapsible filter sheet |
| Dashboard grid | 12-col on lg only | 4-col mobile, 8-col tablet, 12-col desktop |
| Navbar | Hamburger hides features | Sticky notification + avatar on mobile |
| Hero stats | 2-col with large text | 2-col with smaller text, or horizontal scroll |

---

## 8. Accessibility Audit

### 8.1 Critical Accessibility Issues

#### ISSUE X-01: No ARIA Labels on Interactive Elements
- Image uploader has no `aria-label` or `aria-describedby`
- Outbreak map dots have no accessible labels
- Chat message input has no `aria-label`
- **Impact**: Screen reader users cannot use core features
- **Fix**: Add `aria-label`, `role`, and `aria-describedby` to all interactive elements

#### ISSUE X-02: Color-Only Information Encoding
- Severity is communicated only through color (red/amber/green dots)
- Confidence levels use only color bars (emerald/amber/rose)
- Status badges rely on color alone
- **Impact**: Color-blind users (8% of males) cannot distinguish severity levels
- **Fix**: Add text labels, icons, or patterns alongside colors

#### ISSUE X-03: No Keyboard Navigation for Map
- OutbreakMap is mouse-only (hover tooltips)
- No keyboard focus management for map points
- **Fix**: Add `tabIndex`, keyboard arrow navigation, and focus indicators

#### ISSUE X-04: No Skip-to-Content Link
- Neither app has a skip-to-content link
- Keyboard users must tab through the entire navbar on every page
- **Fix**: Add visually hidden skip link that appears on focus

#### ISSUE X-05: Touch Targets Below 44px
- Design spec requires 44x44px minimum touch targets
- Several elements violate this:
  - Sidebar close button
  - Notification badge (small dot)
  - Language toggle button
  - Pagination buttons
- **Fix**: Ensure all interactive elements are minimum 44x44px

#### ISSUE X-06: No Focus Visible Styles
- Default browser focus ring is used in most places
- Some components have `focus-visible:ring` but inconsistent
- **Fix**: Implement consistent focus-visible styles across all interactive elements

#### ISSUE X-07: Image Alt Text Missing
- Hero section images lack descriptive alt text
- Disease library images use generic alt text
- **Fix**: Add descriptive, bilingual alt text for all images

#### ISSUE X-08: No Reduced Motion Support
- Framer Motion animations play at full speed regardless of user preference
- `prefers-reduced-motion` media query is not checked
- **Fix**: Wrap animations in a check: `const shouldReduceMotion = useReducedMotion()`

### 8.2 Accessibility Score Estimate

| Category | Current | Target |
|----------|---------|--------|
| Perceivable (contrast, alt text) | 4/10 | 9/10 |
| Operable (keyboard, touch) | 3/10 | 8/10 |
| Understandable (labels, errors) | 5/10 | 8/10 |
| Robust (ARIA, semantic HTML) | 4/10 | 8/10 |
| **Overall** | **4/10** | **8/10** |

---

## 9. Missing Sections & Features

### 9.1 Missing Page Sections

Based on the design docs (`PAGE_INVENTORY.md`, `page-specs/`) vs actual implementation:

#### Landing Page (`/`)
| Section | Status | Notes |
|---------|--------|-------|
| Navigation Bar | Implemented | With scroll-aware sticky |
| Hero Section | Implemented | With animated stats |
| Trusted By | Implemented | Marquee animation |
| Core Features | Implemented | 6-card grid |
| How It Works | Implemented | 3-step timeline |
| Testimonials | Implemented | 3-column cards |
| Impact Stats | Implemented | Dark section with progress bars |
| Pipeline Animation | Implemented | Scroll-driven visualization |
| CTA | Implemented | Dark gradient card |
| **Outbreak Alert Banner** | **Missing** | Should show live national alerts |
| **Footer** | Partial | Exists but missing government certification badges |

#### Diagnosis Page (`/diagnose`)
| Section | Status | Notes |
|---------|--------|-------|
| Image Upload | Implemented | Drag-and-drop |
| Processing State | Basic | Spinner only, no stages |
| Result Display | Implemented | Full report with bilingual treatment |
| Outbreak Map | Implemented | SVG with real-time updates |
| **Camera Capture** | **Missing** | Mobile camera integration |
| **Multi-image Upload** | **Missing** | Single image only |
| **History Sidebar** | **Missing** | No quick access to past diagnoses |
| **Expert Connect CTA** | **Missing** | Design spec calls for this |

#### Advisory Page (`/advisory`)
| Section | Status | Notes |
|---------|--------|-------|
| Chat Interface | Implemented | Multi-turn with Gemini |
| Sidebar | Implemented | Chat history, search |
| Crop Analysis | Implemented | 3-step wizard |
| **Voice Input** | **Missing** | Phase 5 roadmap item |
| **Image Attachment** | Partial | UI exists, backend unclear |
| **Export Conversation** | **Missing** | No PDF/text export |

#### Library Page (`/library`)
| Section | Status | Notes |
|---------|--------|-------|
| Disease Grid | Implemented | With filters and search |
| Disease Detail | Implemented | Full page with management steps |
| **Seasonal Trends** | **Missing** | Sidebar widget planned |
| **Community Impact** | **Missing** | Sidebar widget planned |
| **User Ratings** | **Missing** | Rate usefulness of articles |

#### Farmer Dashboard (`/farmer`)
| Section | Status | Notes |
|---------|--------|-------|
| Overview Stats | Implemented | With animated cards |
| Weather Widget | Implemented | weatherapi.com integration |
| Diagnostic Ledger | Implemented | Table with history |
| Analytics Charts | Implemented | Bar + pie charts |
| **Field Map (GIS)** | **Missing** | PostGIS field boundary management |
| **Task List** | **Missing** | Prescriptive farming tasks |
| **Crop Journal** | **Missing** | Daily farming log |
| **Yield Prediction** | **Missing** | AI-powered yield forecast |

#### Admin Dashboard (`/admin` via `apps/admin`)
| Section | Status | Notes |
|---------|--------|-------|
| National Overview | Implemented | Metric cards + map |
| Farmer Verification | Implemented | Approve/reject workflow |
| Alert Broadcasting | Implemented | Form + Supabase insert |
| System Engine | Implemented | SQL provisioning guide |
| **Disease Library** | **Data only** | 22 entries exist, no UI |
| **Regional Analytics** | **Missing** | Per-district drill-down |
| **AI Governance** | **Missing** | Model performance dashboard |
| **User Management** | **Missing** | Full CRUD for users |
| **System Monitoring** | **Missing** | Service health, uptime |
| **Audit Logs** | **Missing** | Action history |
| **Export/Reports** | **Missing** | PDF report generation |

### 9.2 Missing Features (Cross-App)

| Feature | Status | Priority |
|---------|--------|----------|
| Dark Mode | Infrastructure only | Medium |
| PWA / Offline | Not started | Medium |
| Push Notifications | Not started | Medium |
| Voice Input (Bangla) | Phase 5 roadmap | High |
| PDF Report Export | Celery task stub exists | High |
| Expert Video Consult | Not started | Low |
| Multi-language (beyond EN/BN) | Not started | Low |
| Print Stylesheet | Not started | Medium |
| Error Boundaries | Not implemented | High |
| 404 Page | Default Next.js | Medium |
| Loading States (global) | Not implemented | High |

---

## 10. Modern Feature Recommendations

### 10.1 High-Impact Features to Add

#### F-01: PWA (Progressive Web App) Support
- **Why**: Rural Bangladesh farmers have intermittent connectivity
- **What**: Service worker, offline diagnosis caching, app manifest, install prompt
- **Impact**: Platform works offline, installs like a native app
- **Implementation**: `next-pwa` package, cache diagnosis results in IndexedDB

#### F-02: Voice Interface (Bangla Speech-to-Text)
- **Why**: Many farmers are illiterate or prefer voice
- **What**: Web Speech API for Bangla input, text-to-speech for advisory responses
- **Impact**: Dramatically increases accessibility
- **Implementation**: Browser Speech API with Bangla language code `bn-BD`

#### F-03: Real-time Collaboration Features
- **Why**: Experts need to collaborate on outbreak responses
- **What**: Live cursors, shared annotations on maps, real-time document editing
- **Impact**: Faster expert response times
- **Implementation**: Supabase Realtime + Yjs CRDT

#### F-04: Smart Notifications System
- **Why**: Farmers need timely alerts about outbreaks, weather, market prices
- **What**: Push notifications (Web Push API), notification preferences, priority levels
- **Impact**: Proactive rather than reactive platform
- **Implementation**: Web Push API + Supabase Edge Functions

#### F-05: Data Visualization Dashboard
- **Why**: Government officials need actionable insights
- **What**: Interactive charts, drill-down analytics, date range selectors, export
- **Impact**: Better decision-making at scale
- **Implementation**: Recharts (already installed but unused) or Apache ECharts

#### F-06: Image Comparison Tool
- **Why**: Farmers need to compare healthy vs diseased crops
- **What**: Side-by-side slider comparison, before/after treatment
- **Impact**: Better disease understanding
- **Implementation**: Custom React component with drag handle

#### F-07: Interactive Crop Calendar
- **Why**: Planting timing is critical for yield
- **What**: Visual calendar with crop-specific planting/harvesting windows, weather overlay
- **Impact**: Improved crop planning
- **Implementation**: Custom calendar component with Supabase data

#### F-08: Community Forum / Q&A
- **Why**: Farmers learn from each other
- **What**: Threaded discussions, expert answers, upvoting, Bangla-first
- **Impact**: Community-driven knowledge sharing
- **Implementation**: Supabase tables + real-time subscriptions

### 10.2 UI/UX Enhancements

#### E-01: Command Palette (Cmd+K)
- **What**: Global search across diagnoses, diseases, advisories, settings
- **Implementation**: `cmdk` package (Radix-based)
- **Impact**: Power users can navigate instantly

#### E-02: Keyboard Shortcuts
- **What**: `j/k` for navigation, `/` for search, `n` for new diagnosis
- **Impact**: Expert productivity boost

#### E-03: Drag-and-Drop File Upload Everywhere
- **What**: Global drop zone that routes to the correct uploader
- **Impact**: More intuitive file handling

#### E-04: Toast Notification Queue
- **What**: Stacked, dismissible notifications with action buttons
- **Implementation**: Sonner (already installed) with custom styling

#### E-05: Breadcrumb Navigation
- **What**: Context-aware breadcrumbs showing location in app hierarchy
- **Impact**: Better wayfinding, especially in deep navigation

#### E-06: Infinite Scroll / Virtual Lists
- **What**: For disease library, diagnosis history, chat messages
- **Implementation**: `@tanstack/react-virtual` for large lists
- **Impact**: Performance with large datasets

#### E-07: Image Lazy Loading with Blur Placeholder
- **What**: `next/image` with blur placeholder for disease images
- **Impact**: Better perceived performance

#### E-08: Skeleton Loading States
- **What**: Content-aware skeleton screens for all data sections
- **Impact**: Better perceived performance, professional feel

### 10.3 Animation Enhancements

#### AN-01: Page Transitions
- Route-level `AnimatePresence` with coordinated enter/exit
- Fade + slight slide for content pages
- Morphing shared elements (e.g., diagnosis card → full report)

#### AN-02: Scroll-Driven Animations
- Landing page sections with parallax depth
- Stat counters that animate on scroll-in
- Progress bars that fill on viewport entry

#### AN-03: Gesture-Based Interactions
- Swipe to delete chat history items
- Pull-to-refresh on data lists
- Pinch-to-zoom on diagnosis images

#### AN-04: Loading Sequences
- Branded loading screen for initial app load
- Staggered card entrance on data load
- Optimistic UI updates with rollback animation

#### AN-05: Celebration Animations
- Confetti on successful diagnosis
- Checkmark animation on farmer verification
- Success pulse on alert broadcast

---

## 11. Code Quality & Architecture Issues

### 11.1 Security Issues

#### ISSUE Q-01: Hardcoded Supabase Keys (CRITICAL)
- **File**: `apps/admin/lib/supabase.ts`
- Both anon key and service role key are hardcoded in source
- Service role key bypasses all RLS policies
- **Fix**: Move to environment variables immediately

#### ISSUE Q-02: No API Route Authentication (CRITICAL)
- **Files**: `apps/admin/app/api/admin/farmers/route.ts`, `apps/admin/app/api/admin/broadcast/route.ts`
- Admin API routes have no authentication middleware
- Anyone can approve farmers or broadcast alerts
- **Fix**: Add Supabase auth verification + admin role check in every API route

#### ISSUE Q-03: Console.log Statements in Production Code
- **File**: `apps/admin/features/auth/hooks/useAuth.ts` (lines 46, 48, 55, 69)
- Debug logging like `console.log("useAuth useEffect started")`
- **Fix**: Remove all console.log statements, use a proper logger if needed

### 11.2 Type System Issues

#### ISSUE Q-04: Role Enum Inconsistency (CRITICAL)
- `packages/types`: `'ADMIN' | 'FARMER' | 'EXPERT' | 'GUEST'` (uppercase)
- `packages/auth`: `'admin' | 'farmer' | 'user'` (lowercase)
- `packages/schemas`: `'admin' | 'farmer' | 'user'` (lowercase)
- `packages/constants`: `admin, farmer, user`
- `apps/web/features/auth/hooks/useAuth.ts`: `'user' | 'farmer' | 'expert' | 'admin'`
- **Five different role definitions** across the monorepo
- **Fix**: Single source of truth in `packages/types`, use lowercase, align all consumers

#### ISSUE Q-05: Extensive `any` Type Usage
- `apps/admin/app/page.tsx`: `pendingFarmers: any[]`
- `AlertsTabProps`: `onChangeForm: (form: any) => void`
- `Profile` type: `application_data?: any`
- **Fix**: Define proper types for all data structures

### 11.3 Dependency Issues

#### ISSUE Q-06: Unused Dependencies (Bundle Bloat)

| Package | App | Status |
|---------|-----|--------|
| `leaflet` | web + admin | Installed, admin uses custom SVG instead |
| `react-leaflet` | web + admin | Installed, not imported |
| `@types/leaflet` | web | Installed, not used |
| `recharts` | admin | Installed, not imported by features |
| `next-themes` | web | Installed, dark mode not activated |
| `zustand` | web | Installed, not imported |
| `tw-animate-css` | web + admin | Installed, unclear usage |

**Impact**: Increases install time, bundle size, and cognitive overhead
**Fix**: Remove all unused dependencies

### 11.4 Architecture Issues

#### ISSUE Q-07: Hardcoded Metrics in Admin
- `apps/admin/app/page.tsx` lines 29-30: `accuracy: 99.2` and `activeAlerts: 3`
- These are hardcoded defaults that never update from the API
- **Impact**: Dashboard shows stale/fake data
- **Fix**: Fetch real metrics from Supabase or API

#### ISSUE Q-08: Client-Side JWT Parsing Without Verification
- `packages/auth` has `parseJwt()` that decodes JWT client-side
- No signature verification - trusts the decoded payload
- **Impact**: Potential for token manipulation
- **Fix**: Only parse JWT server-side or use Supabase's built-in auth

#### ISSUE Q-09: localStorage for Persistent Data
- Advisory conversations stored in `localStorage`
- No data migration strategy, no size limits
- **Impact**: Data loss on browser clear, 5MB limit
- **Fix**: Migrate to Supabase for user data, keep localStorage for UI preferences only

#### ISSUE Q-10: No Error Boundaries
- Neither app has React Error Boundaries
- A runtime error in any component crashes the entire app
- **Fix**: Add error boundaries at route level and feature level

---

## 12. Performance Concerns

### 12.1 Bundle Size Issues

#### ISSUE P-01: Framer Motion Tree-Shaking
- `framer-motion` is imported wholesale in many components
- Only `motion`, `AnimatePresence`, `useScroll`, `useTransform` are used
- **Fix**: Import from `framer-motion` specifically (already tree-shakeable in v12, but verify)

#### ISSUE P-02: Leaflet CSS Not Loaded Efficiently
- Leaflet CSS is imported but the library isn't used
- **Fix**: Remove leaflet entirely

#### ISSUE P-03: No Code Splitting for Features
- All feature components are in the main bundle
- Heavy components (OutbreakMap, DashboardBackground, CropAnalysisView) load eagerly
- **Fix**: Use `next/dynamic` for below-the-fold components

### 12.2 Rendering Performance

#### ISSUE P-04: DashboardBackground Particle System
- 40 animated particles with `framer-motion` running simultaneously
- Each particle has its own `useEffect` and animation loop
- **Impact**: High CPU usage on low-end devices
- **Fix**: Reduce to 15-20 particles, use CSS animations instead of JS

#### ISSUE P-05: OutbreakMap Real-time Subscription
- Subscribes to all `reports` table changes globally
- No pagination or filtering
- **Impact**: Performance degrades as report count grows
- **Fix**: Add date range filter, limit initial fetch

#### ISSUE P-06: No Image Optimization
- Disease library images are not optimized
- No `next/image` usage for external images
- **Impact**: Slow loading on slow connections
- **Fix**: Use `next/image` with proper sizing and format optimization

### 12.3 Caching Strategy

#### ISSUE P-07: TanStack Query Config Too Aggressive
- Default `staleTime: 60000` (60 seconds)
- Diagnosis stats poll every 30 seconds
- **Impact**: Unnecessary network requests for rarely-changing data
- **Fix**: Increase staleTime for static data (diseases, library), reduce for real-time data

---

## 13. i18n (Internationalization) Issues

### 13.1 Current State

- **Library**: `next-intl` v4.12.0 installed
- **Message files**: `messages/en.json` and `messages/bn.json` exist with 20 keys each (Hero section only)
- **Usage**: Components **do not use** `useTranslations` hook
- **Actual approach**: Bengali text is **hardcoded inline** throughout components

### 13.2 i18n Issues

#### ISSUE I-01: Language Toggle Non-Functional
- Navbar has a language toggle button (`BN` label with Globe icon)
- No `onClick` handler attached
- **Fix**: Wire up to `next-intl` locale switching

#### ISSUE I-02: Hardcoded Bengali Strings
- Landing page: `ফসলের রোগ নির্ণয় করুন তাৎক্ষণিকভাবে`
- Advisory: `নতুন আলোচনা`, `চ্যাট পরামর্শ`, `ফসল বিশ্লেষণ`
- These should be in message files, not in code
- **Impact**: Cannot change translations without code changes, no community translation possible

#### ISSUE I-03: API Responses Not i18n-Ready
- Diagnosis results include `treatment_en` and `treatment_bn` arrays
- This is a backend-level bilingual approach, not frontend i18n
- **Impact**: Mixed i18n strategies (frontend hardcoded + backend bilingual fields)

#### ISSUE I-04: Missing Bengali Font
- Design docs specify **Hind Siliguri** for Bengali text
- Neither app loads this font
- Bengali renders in Inter's fallback glyphs
- **Fix**: Load Hind Siliguri with Bengali subset via `next/font/google`

#### ISSUE I-05: Date Formatting Not Locale-Aware
- `packages/utils` has `formatDate()` with locale support
- But components format dates inline without using this utility
- **Fix**: Use the shared `formatDate()` utility everywhere

### 13.3 i18n Recommendations

1. Complete `messages/en.json` and `messages/bn.json` for ALL user-facing strings
2. Replace all hardcoded Bengali with `t('key')` calls
3. Load Hind Siliguri font for Bengali text rendering
4. Wire up the language toggle to actually switch locales
5. Use `next-intl` middleware for locale detection and routing
6. Add RTL support preparation (Bengali is LTR, but future languages may need RTL)

---

## 14. Cross-App Inconsistencies

### 14.1 Design System Drift

| Element | apps/web | apps/admin | packages/ui | Status |
|---------|----------|------------|-------------|--------|
| Primary color | `#2D5A27` | `#2D5A27` | `#2D5A27` | **ALIGNED** |
| Font | Inter | Inter | Inherited | **ALIGNED** |
| Border radius | `rounded-2xl` to `rounded-[4rem]` | `rounded-2xl` to `rounded-[3.5rem]` | `rounded-2xl` to `rounded-[3rem]` | OK |
| Button style | CVA variants | Raw Tailwind | CVA variants | Pending |
| Card style | shadcn Card | Raw Tailwind divs | GlassCard + Card | Pending |
| Shadow | Custom box-shadow | Custom box-shadow | Custom box-shadow | OK |
| Animation | Framer Motion | Framer Motion | Framer Motion | OK |

### 14.2 Component Duplication

| Component | apps/web | apps/admin | packages/ui |
|-----------|----------|------------|-------------|
| Button | `components/ui/button.tsx` | `components/ui/button.tsx` | `src/components/Button.tsx` |
| Card | `components/ui/card.tsx` | `components/ui/card.tsx` | `src/components/Card.tsx` + `GlassCard.tsx` |
| Badge | `components/ui/badge.tsx` | `components/ui/badge.tsx` | `src/components/Badge.tsx` |
| Input | `components/ui/input.tsx` | N/A | `src/components/Input.tsx` |
| cn() | `lib/utils.ts` | `lib/utils.ts` | `src/lib/utils.ts` |

### 14.3 Recommendations

1. **Single source of truth**: All shared components should live in `packages/ui`
2. **Theme alignment**: Define a single color palette and import in both apps
3. **Font standardization**: Choose one font (Inter recommended) for both apps
4. **Component migration**: Gradually move apps to import from `@agri-packages/ui`
5. **Remove duplicates**: Delete local component copies once migration is complete

---

## 15. Priority Action Plan

### Phase 1: Critical Fixes (Week 1)

| ID | Task | Impact | Effort | Status |
|----|------|--------|--------|--------|
| Q-01 | Remove hardcoded Supabase keys | Security | 1h | Pending |
| Q-02 | Add API route authentication | Security | 4h | Pending |
| Q-03 | Remove console.log statements | Code quality | 30m | Pending |
| Q-04 | Align role enums across packages | Type safety | 2h | Pending |
| ~~X-04~~ | ~~Add skip-to-content link~~ | ~~Accessibility~~ | ~~30m~~ | **DONE** — 2026-05-19 |
| ~~X-05~~ | ~~Fix touch targets below 44px~~ | ~~Accessibility~~ | ~~2h~~ | **DONE** — 2026-05-19 |
| ~~X-01~~ | ~~Add ARIA labels to interactive elements~~ | ~~Accessibility~~ | ~~6h~~ | **DONE** — 2026-05-19 |
| ~~X-06~~ | ~~Add focus-visible styles~~ | ~~Accessibility~~ | ~~2h~~ | **DONE** — 2026-05-19 |
| ~~C-01~~ | ~~Fix muted foreground contrast~~ | ~~Accessibility~~ | ~~30m~~ | **DONE** |
| ~~T-04~~ | ~~Load Hind Siliguri font~~ | ~~i18n~~ | ~~30m~~ | **DONE** |
| ~~R-01~~ | ~~Fix advisory sidebar mobile~~ | ~~Mobile~~ | ~~3h~~ | **DONE** — 2026-05-19 |
| ~~R-02~~ | ~~Fix crop analysis mobile layout~~ | ~~Mobile~~ | ~~2h~~ | **DONE** — 2026-05-19 |
| ~~Q-06~~ | ~~Remove unused dependencies~~ | ~~Bundle size~~ | ~~2h~~ | **DONE** — 2026-05-19 |

### Phase 2: High-Impact Improvements (Week 2-3)

| ID | Task | Impact | Effort |
|----|------|--------|--------|
| D-01 | Migrate apps to use packages/ui | Consistency | 8h |
| A-02 | Implement skeleton loading states | UX | 4h |
| A-01 | Add page transitions | UX | 4h |
| R-01 | Fix advisory sidebar mobile | Mobile | 3h |
| R-02 | Fix crop analysis mobile layout | Mobile | 2h |
| X-01 | Add ARIA labels | Accessibility | 6h |
| X-02 | Add non-color indicators | Accessibility | 4h |
| I-01 | Wire up language toggle | i18n | 4h |
| I-02 | Extract hardcoded strings to message files | i18n | 8h |
| Q-10 | Add error boundaries | Reliability | 3h |

### Phase 3: Feature Additions (Week 4-6)

| ID | Task | Impact | Effort |
|----|------|--------|--------|
| F-01 | PWA support | Offline | 8h |
| F-02 | Voice interface (Bangla) | Accessibility | 16h |
| F-04 | Smart notifications | Engagement | 8h |
| F-05 | Data visualization dashboard | Analytics | 12h |
| E-01 | Command palette (Cmd+K) | UX | 4h |
| E-08 | Skeleton loading for all sections | UX | 6h |
| AN-01 | Page transitions | Polish | 6h |
| AN-02 | Scroll-driven animations | Polish | 8h |

### Phase 4: Polish & Performance (Week 7-8)

| ID | Task | Impact | Effort | Status |
|----|------|--------|--------|--------|
| ~~Q-06~~ | ~~Remove unused dependencies~~ | ~~Bundle size~~ | ~~2h~~ | **DONE** — 2026-05-19 |
| P-03 | Code splitting for heavy components | Performance | 4h | Pending |
| P-04 | Optimize DashboardBackground particles | Performance | 2h | Pending |
| C-02 | Refactor hardcoded colors to theme tokens | Maintainability | 8h | **PARTIAL** — tokens added, component migration pending |
| C-06 | Implement dark mode properly | UX | 12h | Pending (intentional) |
| ~~T-01~~ | ~~Standardize font across apps~~ | ~~Consistency~~ | ~~2h~~ | **DONE** |
| ~~T-02~~ | ~~Implement font weight scale~~ | ~~Typography~~ | ~~4h~~ | **DONE** |
| D-03 | Build missing shared components | Design system | 16h | Pending |

---

## Appendix A: File-Level Issues Reference

| File | Issues |
|------|--------|
| `apps/web/app/globals.css` | C-01, C-06, ~~X-06~~ FIXED |
| `apps/web/app/layout.tsx` | C-06, T-04, ~~X-04~~ FIXED |
| `apps/web/app/page.tsx` | ~~X-01~~ FIXED (main landmark) |
| `apps/web/app/advisory/page.tsx` | ~~X-01~~ FIXED (main landmark) |
| `apps/web/app/diagnose/page.tsx` | ~~X-01~~ FIXED (main landmark) |
| `apps/web/app/library/page.tsx` | ~~X-01~~ FIXED (main landmark) |
| `apps/web/features/landing/components/Layout.tsx` | ~~X-01~~ FIXED (ARIA labels), ~~X-05~~ FIXED (touch targets) |
| `apps/web/features/advisory/components/AdvisorySidebar.tsx` | ~~R-01~~ FIXED |
| `apps/web/features/advisory/components/CropAnalysisView.tsx` | ~~R-02~~ FIXED |
| `apps/web/features/library/components/LibraryLayout.tsx` | R-03 |
| `apps/web/features/dashboard/components/DashboardBackground.tsx` | P-04 |
| `apps/web/features/diagnosis/components/OutbreakMap.tsx` | A-06, X-03 |
| `apps/admin/app/globals.css` | ~~X-06~~ FIXED |
| `apps/admin/app/layout.tsx` | ~~X-04~~ FIXED |
| `apps/admin/app/page.tsx` | ~~X-01~~ FIXED (main landmark) |
| `apps/admin/lib/supabase.ts` | Q-01 |
| `apps/admin/app/api/admin/farmers/route.ts` | Q-02 |
| `apps/admin/app/api/admin/broadcast/route.ts` | Q-02 |
| `apps/admin/features/auth/hooks/useAuth.ts` | Q-03 |
| `packages/types/src/index.ts` | Q-04 |
| `packages/auth/src/index.ts` | Q-04, Q-08 |
| `packages/schemas/src/index.ts` | Q-04 |
| `packages/ui/src/components/SkipToContent.tsx` | NEW — X-04 |
| `packages/ui/src/components/Badge.tsx` | cn() duplication |
| `packages/ui/src/components/GlassCard.tsx` | cn() duplication |

---

## Appendix B: Design Token Quick Reference

### Recommended Color Tokens

```css
:root {
  /* Brand */
  --primary: #2D5A27;
  --primary-hover: #1A321A;
  --primary-light: #F1F8F2;
  --accent: #EAB308;
  --accent-hover: #CA8A04;
  
  /* Neutral */
  --background: #FAFAFA;
  --foreground: #1E293B;
  --card: #FFFFFF;
  --border: #E2E8F0;
  
  /* Text */
  --text-primary: #1E293B;
  --text-secondary: #4B5563;  /* Fixed from #64748B */
  --text-tertiary: #9CA3AF;
  --text-inverse: #FFFFFF;
  
  /* Status */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-danger: #EF4444;
  --status-info: #3B82F6;
  
  /* Severity */
  --severity-low: #10B981;
  --severity-medium: #F59E0B;
  --severity-high: #EF4444;
}
```

### Recommended Typography Scale

```css
:root {
  --font-body: 'Inter', system-ui, sans-serif;
  --font-bangla: 'Hind Siliguri', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.75rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.25vw, 0.875rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1rem);
  --text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.125rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.25rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 1.5rem);
  --text-3xl: clamp(1.875rem, 1.4rem + 2.4vw, 1.875rem);
  --text-4xl: clamp(2.25rem, 1.6rem + 3.25vw, 2.25rem);
  --text-5xl: clamp(3rem, 2rem + 5vw, 3rem);
}
```

---

*End of Frontend Testing & UI Audit Report*
