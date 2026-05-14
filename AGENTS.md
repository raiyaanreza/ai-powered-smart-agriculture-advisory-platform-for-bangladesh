# AGENTS.md

> **Role**: AI Coding Agent Instructions for the **AgriVision AI Agriculture Platform**  
> **Target Environment**: Google Antigravity (Gemini CLI)  
> **Last Updated**: 2026-05-14

You are an AI coding agent working on a **government‑scale, modular, AI‑native agricultural operating system** for Bangladesh.  
**Every action must respect the architecture, minimise token waste, and preserve modular integrity.**

---

## 1. Golden Rules (from the AI Agents Manual)

1. **Never work on undefined features**  
   → Every task must have a scope, allowed folders, and acceptance criteria.

2. **One agent = one scoped task**  
   → Do not modify multiple features or services in one request.  
   → Do not accept parallel edits on the same module from different agents.

3. **Humans do cheap repetitive setup**  
   → You will never be asked to install packages, initialise frameworks, or configure Docker.

4. **Use Graphify before searching the repo**  
   → Always consult `graphify-out/GRAPH_REPORT.md` or run `/graphify query` before glob/grep.

5. **Never explore the whole repository**  
   → The user will provide exact folders, APIs, and schemas. Stay inside them.

6. **Contract‑first development**  
   → Schemas in `packages/schemas/` (Zod) and `services/*/app/schemas/` (Pydantic) are the source of truth.

7. **AI prompts must stay in `packages/prompts/`**  
   → Never hardcode LLM instructions inside frontend components or backend endpoints.

8. **Each service/feature must have a local `AGENTS.md`**  
   → When you enter a new folder, read its `AGENTS.md` for local conventions.

---

## 2. Project‑Wide Context

### 2.1 Technology Stack (versions as of May 2026)

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, shadcn/ui 4 |
| Backend     | FastAPI 0.136, Python 3.12, SQLAlchemy 2.0, Celery 5.4 |
| AI/Agent    | LangGraph 1.1, LangChain 1.2, PyTorch 2.11, Qdrant 1.13 |
| Data        | PostgreSQL 18, Redis 7, S3‑compatible object storage |
| Infra       | Docker, Kubernetes (future), GitHub Actions |

### 2.2 Repository Structure (simplified)

```
agri-ai-platform/
├── apps/
│   ├── web/                # Public & farmer dashboard (Next.js)
│   └── admin/              # Government & expert dashboard
├── packages/
│   ├── ui/                 # Shared React components
│   ├── types/              # Shared TypeScript types
│   ├── schemas/            # Zod validation schemas
│   ├── prompts/            # Centralised LLM prompts
│   └── ai-tools/           # LangChain tools & utilities
├── services/               # FastAPI microservices
│   ├── api-gateway/
│   ├── crop-routing-service/
│   ├── disease-*-service/  # crop‑specific models
│   ├── agent-orchestrator/ # LangGraph workflows
│   ├── rag-service/
│   └── ...
├── models/                 # Model weights & training code
├── .ai/                    # Agent handoffs, temp contexts
└── graphify-out/           # Graphify knowledge graph
```

### 2.3 Important Meta‑Files

| File | Purpose |
|------|---------|
| `AGENTS.md` (this file) | Global rules for all agents |
| `apps/*/AGENTS.md` | Frontend‑specific rules |
| `services/*/AGENTS.md` | Backend‑specific rules |
| `packages/*/AGENTS.md` | Shared‑package rules |
| `CURRENT_STATE.md` | Current sprint focus & blockers |
| `DECISIONS.md` | Architectural decisions (never revert) |
| `ROADMAP.md` | Phase milestones |

---

## 3. Antigravity (Gemini CLI) Specific Instructions

### 3.1 Built‑in Commands to Use

- `/graphify query "<question>"` – Ask about code structure, dependencies, or “god nodes”.
- `/graphify status` – Verify graph is loaded.
- **Before any `grep` or `find`** → run `/graphify query "list files related to X"`.

### 3.2 Token Saving Workflow

1. **User provides a scoped task** (allowed folders, reference pattern, expected output).
2. **You run** `/graphify query "What are the main modules in [allowed folder]?"`
3. **You read only the 2–3 most relevant files** (never the whole folder).
4. **You implement** using existing patterns.
5. **You update** `CURRENT_STATE.md` and the feature’s `README.md`.

### 3.3 Prohibited Actions

- ❌ Running `grep -r .` or recursive search on root.
- ❌ Reading `node_modules`, `.venv`, `__pycache__`, `dist/`.
- ❌ Modifying files outside the allowed folders.
- ❌ Generating duplicate utility functions – reuse `packages/utils/`.
- ❌ Changing schemas without updating both Zod **and** Pydantic definitions.

---

## 4. Feature Implementation Checklist

Before you write a single line of code, confirm the following with the user (or read from the task prompt):

- [ ] **Allowed folders** (e.g., `apps/web/features/diagnosis/`)
- [ ] **Forbidden folders** (e.g., `services/auth-service/`)
- [ ] **Reference pattern** (existing component or service to copy)
- [ ] **Acceptance criteria** (pagination? voice output? loading states?)
- [ ] **Required tests** (unit, integration, or E2E)
- [ ] **Docs to update** (`README.md` inside feature folder, `CURRENT_STATE.md`)

**Example of a well‑formed task:**

> Build the `FarmerDashboard` widget that shows the last 3 diagnoses.  
> **Allowed:** `apps/web/features/dashboard/`, `packages/ui/`  
> **Forbidden:** `apps/web/features/auth/`, any backend service.  
> **Pattern:** copy the layout from `apps/web/features/advisory/ResultCard`.  
> **Accept:** shows loading skeleton, empty state, and click to view full report.  
> **Tests:** add unit tests for the data fetching hook.

---

## 5. Coding Standards (Automatic Enforcement)

### 5.1 Frontend (Next.js / TypeScript)

- Use `"use client"` only for interactive components.
- All data fetching must use TanStack Query hooks inside `features/*/hooks/`.
- Styles: Tailwind classes only; no custom CSS unless in `packages/ui`.
- Bangla strings must use the i18n system (`apps/web/i18n/`), never hardcoded.

### 5.2 Backend (FastAPI / Python)

- Define Pydantic models in `app/schemas/`.
- Database repositories in `app/repositories/`.
- Business logic in `app/services/`.
- Async endpoints: use `async def` and `await`.
- All services must expose `/health` and `/metrics` endpoints.

### 5.3 AI & Agent Code

- LangGraph workflows go in `services/agent-orchestrator/app/graphs/`.
- Each node in a graph must have a typed state (Pydantic model).
- Prompts are imported from `packages/prompts/` – never string literals.
- Tools are defined in `packages/ai-tools/` and registered with LangChain.

### 5.4 Testing

- Frontend: Vitest + React Testing Library.
- Backend: `pytest` with `pytest-asyncio`.
- Minimum coverage for new features: 70% (critical paths: 90%).

---

## 6. Handling Multi‑Agent Scenarios

Because you may work alongside other agents (or the same agent in a different session):

- **Always lock to a feature folder** – never two agents on the same folder simultaneously.
- **Use `.ai/handoffs/`** – if you stop mid‑task, write a short handoff note.
- **Merge conflicts** – prefer small, single‑file changes; ask human to rebase if needed.

---

## 7. What to Do When You Are Stuck

1. **Re‑read the relevant AGENTS.md** (local to the folder).
2. **Run** `/graphify query "What modules depend on X?"`
3. **Check `DECISIONS.md`** – the answer may already be there.
4. **Ask the user for clarification** – provide your current understanding and two possible paths.
5. **Do not guess** – speculating on architecture or API contracts leads to rework.

---

## 8. Success Criteria for Your Work

A task is complete only when:

- All acceptance criteria are met.
- Tests pass (`pnpm test` or `pytest`).
- No lint errors (`pnpm lint` or `ruff check`).
- The local `AGENTS.md` (if one exists) is updated with any new local conventions.
- `CURRENT_STATE.md` reflects the completed work.

---

## 9. Final Reminder

> **You are not a product manager, not a system architect, and not a designer.**  
> Your job is to implement **scoped, modular, testable code** that fits seamlessly into the existing architecture. When in doubt, refer to the `ARCHITECTURE.md` and the `DESIGN_ARCHITECTURE.md` documents the user provided.

**Now go build the future of Bangladeshi agriculture – one isolated feature at a time.**

---

## Appendix: Quick Reference Commands

| Action | Command |
|--------|---------|
| Build all packages | `pnpm run build` |
| Run web dev server | `pnpm dev:web` |
| Run admin dev server | `pnpm dev:admin` |
| Run backend service (e.g., api-gateway) | `cd services/api-gateway && uvicorn app.main:app --reload` |
| Run all tests | `pnpm test` (frontend) + `pytest` (backend) |
| Update Graphify graph | `graphify run .` |
| Query Graphify | `/graphify query "<question>"` in Antigravity |

---

