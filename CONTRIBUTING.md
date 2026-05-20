# AgriVision AI — Developer Contribution Guide

Welcome to the AgriVision AI Monorepo! This guide helps you get started with running, developing, and contributing to the project.

---

## 🛠️ Monorepo Orchestration

This project uses **pnpm workspaces** and **Turborepo** for build caching and pipeline execution.

### Prerequisites
- **Node.js**: Version 22.0.0 or higher
- **pnpm**: Version 10.0.0 or higher
- **Python**: Version 3.12.x
- **Docker & Docker Compose** (for backend services and databases)

### Setup & Installation
1. Clone the repository and initialize local settings:
   ```bash
   cp .env.example .env.local
   # Customize .env.local files in apps/web/ and apps/admin/
   ```
2. Install workspace dependencies:
   ```bash
   pnpm install
   ```
3. Set up the Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Operational Commands
- Run Web app dev server: `pnpm dev:web` (port `3000`)
- Run Admin Command Center: `pnpm dev:admin` (port `3001`)
- Build all apps & packages: `pnpm run build`
- Run linting: `pnpm run lint`
- Run typechecks: `pnpm run type-check`
- Run frontend tests: `pnpm run test`

---

## 🏗️ Architecture Conventions

Before modifying any file, please read `AGENTS.md` and `docs/PROJECT_OVERVIEW.md`. Key golden rules:
1. **Strict App Separation**: Admin-only routes must reside in `apps/admin/`. Public and farmer-facing screens must reside in `apps/web/`.
2. **Contract-First Development**: Shared data schemas are located in `packages/schemas/` (Zod validation) and backend models in `services/*/app/schemas/` (Pydantic validation). Keep them in sync.
3. **No Local Credentials**: Always read security tokens (Supabase, Gemini API, Sentinel Hub) from environment variables. Never commit or hardcode fallback keys.
4. **Code Graph**: After editing code, run `graphify update .` to update the AST index graph.

---

Thank you for building the future of Bangladeshi agriculture!
