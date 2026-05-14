# AI Agriculture Advisory Platform — Design & Interaction Planning

## 1. Purpose of This Document

This document defines the **User Interaction Architecture** for the platform. It provides the "Interaction Contract" for engineers and designers to build consistent user experiences across all roles.

**Primary Focus**: UI/UX direction, role-based journeys, page hierarchy, and interaction workflows.

---

# 2. User Roles & Permissions

The system supports five distinct user categories, each with tailored visibility and workflows.

### A. Guest User (Non-Registered)
* **Goal**: Immediate accessibility and trust building.
* **Capabilities**: Limited AI diagnosis, article browsing, public alerts.
* **Restriction**: No history, no personalized alerts, no dashboard.

### B. Registered Farmer/User
* **Goal**: Personalised crop management and advisory.
* **Capabilities**: Full diagnosis history, severity tracking, localized weather/outbreak alerts, and AI chat assistant with voice support.

### C. Agricultural Expert / Agronomist
* **Goal**: Validation and knowledge expansion.
* **Capabilities**: Review queue for low-confidence cases, advisory correction tools, and content publishing.

### D. Government / Admin User
* **Goal**: National monitoring and governance.
* **Capabilities**: Disease heatmaps, regional analytics, user/expert management, and AI governance audit logs.

### E. Super Admin
* **Goal**: Technical operations.
* **Capabilities**: System health monitoring, role management, and global configuration.

---

# 3. Global UX Principles

* **Mobile-First**: Optimized for slow devices and low bandwidth; minimal clicks.
* **Bangla-First**: Native language labels and voice playback for all critical advisories.
* **Confidence Transparency**: Always display AI confidence levels; never present uncertain advice as absolute truth.
* **Accessibility**: Large touch targets and high-contrast design for low-literacy or elderly users.

---

# 4. Navigation Architecture

### Farmer Navigation
* **Dashboard**: Overview of farm status and recent activity.
* **Diagnose**: Primary entry point for crop image upload.
* **AI Assistant**: Persistent conversational guidance.
* **History**: Record of all previous reports and treatments.
* **Alerts**: Location-based disease and weather warnings.

### Admin/Expert Navigation
* **Overview/Review Queue**: Task-oriented lists for data oversight.
* **Analytics**: Geospatial and trend-based visualizations.
* **Management**: Tools for overseeing users and content.

---

# 5. Core User Workflows

### 5.1 Disease Diagnosis Flow
1. **Upload**: User captures/uploads crop image.
2. **Analysis**: System detects crop type and routes to specialized model.
3. **Report**: User receives diagnosis, severity, and treatment advice.
4. **Action**: User can ask the AI follow-up questions or export the report.

### 5.2 AI Advisory Flow
1. **Query**: User asks via text or voice.
2. **Retrieval**: System uses RAG to fetch verified BARI/BRRI documents.
3. **Response**: AI provides grounded, localized advice in Bangla.

---

# 6. UI Component System Direction

The UI should feel **modern, agricultural, and trustworthy** using a soft earth-tone palette.

**Core Components**:
* **Confidence Badges**: Visual indicators of model certainty.
* **Advisory Blocks**: Clear, step-by-step treatment instructions.
* **Impact Heatmaps**: For admin-level regional monitoring.
* **Voice Interactive Panels**: For accessible AI communication.

---

# 7. Authentication Strategy

* **Phase 1**: Email/Password and Social (Google) login.
* **Phase 2**: Phone OTP (Bangladeshi providers) for rural accessibility.
* **Phase 3**: Integration with national government identity systems.

---

> *For system-level architecture and tech stack, refer to `project_architecture.md`.*
