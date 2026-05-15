<p align="center">
  <img src="assets/banner.png" width="100%" alt="AgriVision Banner" />
</p>

<h1 align="center">🌾 AgriVision AI</h1>

<p align="center">
  <strong>Government-Scale Agricultural Intelligence Ecosystem for Bangladesh</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.136-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Supabase-Realtime-3FCF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/LangGraph-Orchestration-blue?style=for-the-badge&logo=langchain" />
</p>

---

## 📖 Overview

**AgriVision** is an AI-native agricultural operating system designed to empower the Bangladeshi agricultural sector. It bridges the gap between rural farmers and government expertise using advanced computer vision, multi-agent orchestration, and real-time geospatial intelligence.

The platform is built on a **Modular Monorepo Architecture**, separating public-facing farmer tools from high-security administrative command centers.

---

## 🚀 The AgriVision Journey (Sequential Modules)

AgriVision is organized into logical layers that work together to deliver a seamless experience.

### 1. 🚜 Farmer Portal (`apps/web`)
The primary interface for farmers to interact with the AI.
*   **AI Disease Diagnosis**: Instant identification of rice diseases (Leaf Blast, Brown Spot, etc.) via image uploads.
*   **Multi-turn AI Advisor**: A conversational agent that remembers history and provides localized treatment steps in Bangla.
*   **Farmer Dashboard**: A premium glassmorphic interface featuring an **Animated Semantic Map** of Bangladesh for contextual awareness.
*   **Onboarding**: Tailored experience for new farmers to set up their crop profiles.

### 2. 🏛️ National Command Center (`apps/admin`)
The "War Room" for agricultural officials and experts.
*   **GIS Outbreak Intelligence**: Real-time hotspot mapping across districts (Dhaka, Rajshahi, etc.).
*   **National Alert System**: Broadcast emergency pest/weather warnings to thousands of farmers instantly.
*   **Disease Library Management**: A visual reference gallery used to update and verify the national agricultural knowledge base.
*   **Farmer Verification**: Ensuring data integrity across the platform.

### 3. 🤖 Intelligence Layer (`services/`)
The brain of the platform, powered by Python and FastAPI.
*   **Advisory Service**: Orchestrates LangGraph agents to process diagnosis results and generate expert advice.
*   **Crop Routing**: Automatically routes images to specialized models for higher accuracy.
*   **RAG Knowledge Engine**: Grounds AI responses in official BARI/BRRI research data.

### 4. 📦 Shared Infrastructure (`packages/`)
Common logic used across all applications.
*   **`@agri/ui`**: Shared React components and glassmorphic design tokens.
*   **`@agri/schemas`**: Unified Zod/Pydantic contracts for frontend-backend parity.
*   **`@agri/prompts`**: Centralized repository for all LLM instructions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 6 |
| **Backend** | FastAPI (Python 3.12), SQLAlchemy 2.0 |
| **Styling** | Tailwind CSS 4, Framer Motion (Animations), Shadcn UI |
| **Database** | Supabase (PostgreSQL), Realtime Sync |
| **AI/Agents** | Google Gemini 1.5 Flash, LangGraph, LangChain |
| **Mapping** | Leaflet.js with custom Pulse Animations |

---

## 🗺️ Roadmap & Status

| Phase | Milestone | Features | Status |
| :--- | :--- | :--- | :---: |
| **1** | **Foundation** | Auth, Onboarding, Basic Diagnosis | ✅ |
| **2** | **Intelligence** | LangGraph Advisor, Multi-turn Chat, History | ✅ |
| **3** | **Command** | GIS Heatmaps, National Alerts, Admin Portal | ✅ |
| **4** | **Stability** | Unified UI, Asset Sync, Model Optimization | ✅ |
| **5** | **Scale** | Satellite NDVI, Voice Interaction, Marketplace | ⏳ |

---

## 🏃 Getting Started

### Prerequisites
* **Node.js**: v20+
* **Python**: 3.12+
* **pnpm**: v9+
* **Supabase CLI** (optional)

### Setup & Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/RaiyaanReza/I-Powered-Smart-Agriculture-Advisory-Platform-for-Bangladesh.git
   pnpm install
   ```

2. **Environment Configuration**:
   Follow the templates in `.env.example` (if provided) or create:
   - `apps/web/.env.local`
   - `apps/admin/.env.local`
   - `services/advisory-service/.env`

3. **Database Migration**:
   Apply SQL scripts from `docs/sql/` to your Supabase instance.

### Running the Ecosystem

*   **Run Everything (Turbo)**:
    ```bash
    pnpm dev
    ```
*   **Run Specific App**:
    ```bash
    pnpm dev --filter web   # Farmer Portal (:3000)
    pnpm dev --filter admin # Admin Center (:3001)
    ```

---

## 📂 Documentation Guide

For deeper dives, explore our specialized documentation:

*   📑 **[Project Overview](docs/01_PROJECT_OVERVIEW.md)**: Vision and product philosophy.
*   🏗️ **[System Architecture](docs/02_SYSTEM_ARCHITECTURE.md)**: Technical deep dive into services and agents.
*   🎨 **[Design Architecture](docs/03_DESIGN_ARCHITECTURE.md)**: UI patterns, tokens, and UX strategy.
*   📜 **[Current State](CURRENT_STATE.md)**: Latest sprint progress and active tasks.

---

<p align="center">
  Made with ❤️ for the Farmers of Bangladesh.
</p>
