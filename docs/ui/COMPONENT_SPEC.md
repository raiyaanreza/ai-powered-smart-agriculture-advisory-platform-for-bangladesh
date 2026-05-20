# AI Agriculture Advisory Platform — Components & Implementation Spec

## 1. Purpose & Scope
This document serves as the **executable functional blueprint** for the AgriVision frontend. It maps page inventories, layouts, and AI-native features to specific monorepo folders, state contracts, and backend schemas.

**Goal**: To enable modular, agent-driven implementation while ensuring consistency across Farmer, Expert, and Admin roles.

---

## 2. Technical Standards & Architecture

### FOLDER OWNERSHIP RULES
AI Agents and Developers MUST follow these directory conventions:
- `apps/web/app/(public)/`          → Public routes (Landing, Diagnosis, Library)
- `apps/web/app/(dashboard)/farmer/` → Farmer-specific dashboard routes
- `apps/web/app/(dashboard)/expert/` → Expert/Agronomist dashboard routes
- `apps/web/app/(dashboard)/admin/`  → Government/Admin dashboard routes
- `apps/web/features/[feature]/`    → Feature-specific components, hooks, and logic
- `packages/ui/src/components/`     → Pure, reusable UI components (atomic/molecule level)
- `packages/schemas/src/`           → Zod schemas shared between frontend and backend
- `packages/prompts/src/`           → AI prompt templates used by the frontend

### State & Data Flow Pattern
- **Data Fetching**: Use TanStack Query (React Query) hooks located in `features/*/hooks/`.
- **Validation**: All form inputs and API responses MUST be validated using schemas from `@agri-packages/schemas`.
- **Global State**: Use Zustand for lightweight global state (e.g., user preferences, active crop).
- **SSR**: Prefer Server Components for static content; use Client Components for interactive/AI features.

### Testing Requirements (Per Component)
| Type | Requirements |
|---|---|
| **Atomic UI** | Prop rendering, snapshot, event handler triggers. |
| **Forms/Upload** | Validation logic, error message visibility, submission state. |
| **Data Widgets** | Skeleton loading state, Empty state, Error fallback UI. |
| **AI Workflows** | Mocked AI responses, Safety disclaimer visibility, Latency handling. |

---

## 3. Core Component API Contracts

| Component | Props (TypeScript) | Folder | Tests |
|-----------|--------------------|--------|-------|
| `ImageUploader` | `maxFiles?: number`, `onUpload: (f: File[]) => void`, `acceptedTypes?: string[]` | `packages/ui/upload/` | File limit, Type validation, Preview render |
| `ConfidenceGauge` | `score: number` (0-100), `label?: string`, `size?: 'sm'|'md'` | `packages/ui/charts/` | Color-coding thresholds, Animation trigger |
| `StatusBadge` | `type: 'success'|'warning'|'error'`, `text: string`, `pulse?: boolean` | `packages/ui/badges/` | variant styling, pulse animation |
| `AIProcessingState` | `step: string`, `progress?: number`, `isComplete: boolean` | `packages/ui/ai/` | Text updates, completion transition |

---

## 4. Global Layout System

### A. Public Layout
<!-- OWNER: apps/web/app/layout.tsx -->
- **Components**: Navbar (frosted glass), Footer (dark), AnimatedBanner.
- **State**: Language context (i18n), Auth session (optional).

### B. Dashboard Layouts (Farmer/Expert/Admin)
<!-- OWNER: apps/web/app/(dashboard)/layout.tsx -->
- **Components**: Collapsible Sidebar, Role-based Topbar, Breadcrumbs.
- **State**: User role permissions, active farm/region context.

---

## 5. Public Website Pages

### 5.1 Landing Page
<!-- OWNER: apps/web/app/(public)/page.tsx -->
<!-- FEATURES_DIR: apps/web/features/landing/components/ -->

#### Hero Section
- **UI**: 2-Column Grid + Floating Stats.
- **Features**: Bilingual headlines, AI Diagnosis CTA, Interactive App Mockup.
- **Tests**: CTA navigation, Responsive layout switch.

#### Features Section
- **UI**: 3-Column Bento Grid (6 Cards).
- **Features**: Diagnosis, Advisory, Alerts, Weather, Offline Sync, Gov Integration.
- **Tests**: Hover states, Icon rendering.

#### Impact & Results
<!-- OWNER: apps/web/features/landing/components/Impact.tsx -->
- **Data**: Static/API hybrid.
- **Tests**: Animation on scroll (whileInView).

---

### 5.2 Public Diagnosis Page
<!-- OWNER: apps/web/app/(public)/diagnose/page.tsx -->
<!-- FEATURE_DIR: apps/web/features/diagnosis/ -->

#### Upload & Processing
- **Component**: `ImageUploader`
- **Logic**: Trigger `POST /api/v1/diagnose`
- **Schema**: `DiagnosisRequest` → `DiagnosisResponse`
- **Tests**: Upload success, Model failure handling.

#### Results & Advisory
- **UI**: Confidence Gauge, Treatment Step-cards, Fertilizer Guide.
- **Data**: `DiagnosisResponse` ( diseaseNameBn, confidence, severity, treatmentSteps )
- **Tests**: PDF Export trigger, Bangla text rendering.

---

## 6. Farmer Dashboard

### 6.1 Dashboard Home
<!-- OWNER: apps/web/app/(dashboard)/farmer/page.tsx -->
<!-- FEATURE_DIR: apps/web/features/dashboard/ -->

#### Recent Diagnoses Widget
- **Hook**: `useRecentDiagnoses(limit: 5)`
- **Schema**: `DiagnosisSummarySchema`
- **Tests**: Skeleton loader, empty state navigation to /diagnose.

#### Active Alerts
- **Hook**: `useRegionalAlerts(regionId: string)`
- **UI**: `AlertCard` with severity-based coloring.
- **Tests**: High-severity alert prominence.

---

## 7. Expert & Admin Systems

### 7.1 Review Queue (Expert)
<!-- OWNER: apps/web/app/(dashboard)/expert/review/page.tsx -->
- **Data**: `GET /api/v1/expert/queue`
- **Actions**: Approve, Edit, Reject, Escalate.
- **Tests**: Optimistic UI updates on approval.

### 7.2 National Monitoring (Admin)
<!-- OWNER: apps/web/app/(dashboard)/admin/monitoring/page.tsx -->
- **Component**: `OutbreakHeatmap` (GIS)
- **Features**: Layer toggles (Paddy, Potato, Wheat), Temporal playback.
- **Tests**: Map bounds initialization, Filter reactivity.

---

## 8. Advanced Strategy & Specialized Systems

### A. Offline & Low-Bandwidth Strategy
- **Behavior**: Components use `IndexedDB` (via TanStack Query persist) for offline access to diagnosis history.
- **Upload**: Detect low-bandwidth; offer "Compressed Upload" (client-side resizing) before sending.

### B. Real-time Notifications (WebSockets)
- **Socket Events**: `outbreak_alert`, `diagnosis_ready`, `expert_feedback`.
- **UI**: Toast notifications + Sidebar badge increments.

### C. Internationalization (i18n)
- **Structure**: `apps/web/i18n/[lang].json`
- **Pattern**: Use `next-intl` or similar. Default to `bn` (Bangla).

### D. Accessibility & Performance Budget
- [ ] Contrast Ratio ≥ 4.5:1 (Earth Green vs White).
- [ ] Touch Targets ≥ 44x44px for farmer dashboard.
- [ ] LCP < 2.5s; Skeleton loaders mandatory for all data-fetching cards.

---

## 9. Final Component Strategy Summary
The AgriVision frontend is an **AI Agriculture Operating System**. It must remain:
1. **Modular**: Feature logic isolated in `features/`.
2. **Type-Safe**: Strictly coupled to `packages/schemas`.
3. **Agent-Ready**: Documented with explicit folder and prop contracts.
4. **Resilient**: Optimized for rural Bangladesh connectivity.
