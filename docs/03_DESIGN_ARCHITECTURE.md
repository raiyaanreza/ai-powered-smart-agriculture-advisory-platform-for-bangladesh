# AI Agriculture Advisory Platform — Design Architecture Planning

## 1. Purpose of This Document
This document defines the complete **Design Architecture Planning** of the AI Agriculture Advisory Platform. It serves as the primary "Interaction Contract" for frontend/backend engineers and designers, ensuring that every user journey—from a guest visitor to a government official—is modular, consistent, and logically integrated.

---

# 2. Core Product Experience Philosophy
The platform is designed to be an "Agricultural Operating System" that bridges the gap between complex AI and rural accessibility:
* **Simple for Rural Farmers**: Minimal cognitive load, high contrast, and voice-assisted.
* **Professional for Government Officials**: Data-heavy, analytical, and authoritative.
* **Bangla-native**: Regional language and voice-first interaction.
* **Trustworthy**: Transparent AI confidence levels and RAG-verified guidance.

---

# 3. User Roles & Detailed Journeys

### A. Guest User (Non-Registered)
*   **Description**: Visitors exploring the site for the first time.
*   **Goal**: Immediate value demonstration (Aha! moment).
*   **Allowed**: Limited AI diagnosis, article browsing, public alerts.
*   **Journey**: Landing Page → Upload Image → AI Result → Registration CTA.

### B. Registered Farmer/User
*   **Description**: The primary audience (rural farmers, rooftop gardeners).
*   **Goal**: Long-term crop health management.
*   **Allowed**: Full diagnosis history, severity tracking, localized alerts, personalized AI chat assistant.
*   **Journey**: Dashboard → Upload/History → Advisory → Action/Alerts.

### C. Agricultural Expert / Agronomist
*   **Description**: Verified specialists validating AI outputs.
*   **Goal**: Ensure quality and safety of advice.
*   **Allowed**: Review queue for low-confidence cases, manual advisory overriding, knowledge base publishing.

### D. Government / Admin User
*   **Description**: Regional/National agricultural officers.
*   **Goal**: High-level monitoring and policy enforcement.
*   **Allowed**: National disease heatmap, regional outbreak analytics, AI governance audit logs.

### E. Super Admin
*   **Description**: Technical platform operators.
*   **Goal**: System integrity and resource management.

---

# 4. Global UX Principles

*   **Mobile-First**: Primary usage on mobile devices; optimized for low bandwidth and slow processors.
*   **Confidence Transparency**: Every AI output must show a "Confidence Score" and a "Safety Disclaimer."
*   **Voice-First**: Integrated Bangla text-to-speech and speech-to-text for all advisory modules.
*   **Frictionless Diagnosis**: The diagnosis flow must be achievable in under 3 clicks from the homepage.

---

# 5. Layout & Navigation Strategy

### 5.1 Presentation Zones
*   **Public Zone**: Marketing-focused, simple, and high-conversion.
*   **Farmer Zone**: Task-oriented, card-based, and personalized.
*   **Expert Zone**: Analytical, queue-based, and verification-focused.
*   **Admin Zone**: Dashboard-heavy, visualization-first, and data-dense.

### 5.2 Navigation Maps
*   **Public**: Home | Diagnosis | Knowledge | Alerts | About | Login
*   **Farmer**: Dashboard | Diagnose | AI Assistant | History | Alerts | Profile
*   **Expert**: Review Queue | Analytics | Knowledge Base | Moderation | Profile
*   **Admin**: Overview | Regions | Users | AI Governance | Monitoring | Settings

---

# 6. Page Architecture & Functional Modules

### 6.1 Public Pages
*   **Landing Page**: Hero, Diagnosis CTA, Supported Crops, Outbreak Banners.
*   **Public Diagnosis**: Image Uploader (Camera/Gallery), Real-time Analysis Card.
*   **Knowledge Center**: Categorized articles, search filters, and "Crop Guides."

### 6.2 Farmer Dashboard
*   **Home Widgets**: Quick Diagnosis button, Recent Activity, Weather/Irrigation summary.
*   **Diagnosis History**: Searchable records with severity trend visualization.
*   **AI Advisory Center**: Persistent conversational assistant with context-aware farm guidance.

### 6.3 Admin/Expert Dashboard
*   **National Overview**: Interactive disease heatmap and regional spread analytics.
*   **AI Governance**: Token usage logs, model performance distribution, and prompt audit trails.
*   **Expert Review**: Side-by-side comparison of AI output vs. Human correction.

---

# 7. Design-Driven System Architecture

### 7.1 Backend Logic Layering
1.  **API Gateway**: Authentication, rate limiting, and request routing.
2.  **Business Services**: Diagnosis management, user state, reports, and notifications.
3.  **AI Orchestration**: LangGraph-based workflows, RAG, and model inference.

### 7.2 Database Domain Strategy
*   **Relational (PostgreSQL)**: Users, History, Reports, and Moderation logs.
*   **Vector (Qdrant)**: Knowledge embeddings and semantic memory.
*   **Object Storage**: Uploaded crop images and generated PDF advisories.

### 7.3 Authentication Flow
*   **Guest**: Session-based (temporary).
*   **User**: Email/Google Login (Phase 1) → Phone/OTP (Phase 2).
*   **Official**: Role-based Access Control (RBAC) with audit logging.

---

# 8. Core Interaction Workflows

### 8.1 Disease Diagnosis Workflow
```text
Upload Image → Validation → Crop Detection → Disease Routing → AI Inference → Severity Check → RAG Verification → Localized Response (Bangla) → Save/Share
```

### 8.2 AI Advisory Workflow
```text
Query → Intent Detection → Knowledge Retrieval → Context Injection → Generation → Safety Guardrail → Voice/Text Response
```

---

# 9. Modular Implementation Rules
*   **Feature Isolation**: Every major functional area (Diagnosis, Advisory, History, Admin) must own its own pages, components, hooks, and schemas. This prevents "side-effect" bugs during development.
*   **Layered Interaction**: UI components must never call AI models or databases directly. Communication must follow: `Component → Hook/State → API Client → Backend Service`.
*   **Shared UI Strategy**: Reusable primitives (Buttons, Inputs, Dialogs) reside in `packages/ui`. Feature-specific UI resides within the feature's local `components` folder.
*   **AI Integration Isolation**: All prompts, LLM configurations, and tool definitions are centralized in `packages/prompts` and `packages/ai-tools`.
*   **Contract-First Design**: Frontend and Backend teams must agree on Zod/Pydantic schemas before implementation.

---

# 10. AI-Agent-Friendly Design Principles
To ensure AI coding agents (Cursor, Antigravity, etc.) can work effectively:
*   **Predictable Naming**: Use standard suffixes: `-service`, `-hook`, `-component`, `-schema`.
*   **Self-Contained Services**: Minimize cross-service dependencies to reduce the context window required for any single task.
*   **Local Documentation**: Each major module folder must contain a `README.md` explaining its responsibility and API surface.
*   **Schema-Driven Generation**: AI agents should use the shared schemas as the primary source of truth for generating compatible code.

---

# 11. UI Design System Direction
*   **Visual Persona**: Calm, agricultural, government-grade, and premium-futuristic.
*   **Design System: Unified Glassmorphism**:
    *   **Core Style**: `bg-white/70 backdrop-blur-lg` panels with subtle borders.
    *   **Goal**: Create a high-fidelity, transparent interface that feels lightweight and modern.
*   **Interactive Element: Animated Semantic Map**:
    *   **Implementation**: A background-layer map of Bangladesh with glowing nodes for major districts (Dhaka, Chittagong, Rajshahi, etc.).
    *   **Motion**: Pulse animations and floating particle effects using `framer-motion` to represent real-time data flow.
*   **Palette**: Primary (Earth Green: #2D5A27), Secondary (Slate: #475569), Accent (Harvest Gold: #EAB308).
*   **Typography**: Inter for functional UI; Hind Siliguri for Bangla content.
*   **Accessibility**: High-contrast ratios, minimum 16px font for body text, and touch targets of at least 44x44px.

---

# 12. Final Design Architecture Summary
The platform is designed as a **Multi-Role AI Agriculture Ecosystem**. By maintaining strict modular boundaries and role-specific interaction zones, the system can scale from a simple diagnosis tool into a national-scale agricultural intelligence platform without structural debt.

> *Note: Technical infrastructure (monorepo, CI/CD, database engines) is detailed in `02_SYSTEM_ARCHITECTURE.md`.*
