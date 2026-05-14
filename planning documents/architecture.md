# AI Agriculture Advisory Platform — Architecture Planning

## 1. Purpose of This Document

This document defines the root architecture for the AI agriculture advisory platform so that AI agents, developers, and future engineers can work independently without breaking system integrity. It is written as the primary reference for incremental development, modular implementation, and future scale-up toward government and business deployment in Bangladesh.

The system is designed to support:

* crop image diagnosis through specialized models,
* agentic advisory workflows,
* Bangla-first user interaction,
* public-scale web access,
* modular feature development,
* future expansion into mobile, IoT, and government analytics.

This document should be treated as a living architecture contract.

---

## 2. Product Architecture Goals

### 2.1 Primary goals

* Serve farmers with fast, trustworthy, localized agricultural guidance.
* Support crop disease detection using crop-specific routing.
* Keep every major subsystem independently maintainable.
* Make the platform easy for AI agents to extend.
* Reduce human engineering cost by creating a strong AI-friendly code structure.
* Prepare the platform for public sector and large-user deployments.

### 2.2 Non-goals for early phases

* No single monolithic model for all crops.
* No tightly coupled frontend-backend logic.
* No hardcoded AI prompts inside UI components.
* No feature implementation directly inside shared utility files unless it is truly reusable.
* No premature optimization outside the core diagnosis and advisory flows.

---

## 3. System Design Principles

1. **Modularity first**
   Every feature must live in an isolated boundary.

2. **Contract-driven development**
   UI, API, model services, and agent services must communicate through explicit schemas.

3. **Domain separation**
   Frontend, backend, ML, and agent orchestration must not depend on each other internally beyond published interfaces.

4. **Async-by-default**
   AI calls, inference jobs, report generation, and notifications should be treated as asynchronous workflows wherever possible.

5. **AI-agent friendly structure**
   The repository must be easy for coding agents to understand, search, modify, and test with low token overhead.

6. **Human override and auditability**
   Every advisory action should be traceable.

7. **Bangla-first user experience**
   The platform should be understandable to rural and mid-level farmers in Bangladesh.

---

## 4. Recommended Architecture Style

The overall system should be a **modular monorepo with service-oriented backend architecture**.

### Why this style fits the project

* Multiple teams can work without blocking each other.
* AI agents can operate on narrow scopes.
* Model services can scale independently.
* Frontend pages and admin modules remain isolated.
* Shared logic stays in versioned packages.

### High-level layers

* **Presentation layer**: web app, admin app, future mobile app.
* **API layer**: gateway and public APIs.
* **Business logic layer**: advisory services, workflow orchestration, user management, analytics.
* **AI layer**: crop classifier, disease classifiers, RAG assistant, agent graph.
* **Data layer**: relational DB, vector DB, object storage, cache, event queue.
* **Infrastructure layer**: containerization, CI/CD, observability, deployments.

---

## 5. Recommended Technology Stack

This stack is selected to support modern AI-native development, long-term maintainability, and independent service ownership.

### 5.1 Frontend

* **Next.js** for the web application and public portal.
* **TypeScript** for strong typing and safer AI-assisted refactoring.
* **Tailwind CSS** for rapid layout consistency.
* **shadcn/ui** for reusable UI primitives.
* **Framer Motion** for focused motion where it improves clarity.
* **TanStack Query** for client data caching and server synchronization.
* **Zod** for schema validation at the UI boundary.

### 5.2 Backend

* **FastAPI** as the main backend framework.
* **Python** for ML and AI ecosystem compatibility.
* **Pydantic** for request/response contracts.
* **SQLAlchemy or SQLModel** for database access.
* **Celery or Dramatiq** for background jobs.
* **Redis** for caching, queues, and session support.

### 5.3 AI / ML / Agent Layer

* **PyTorch** for model inference and future training workflows.
* **ONNX Runtime** for optimized inference where possible.
* **LangGraph** for structured agent workflows.
* **LangChain** for retrieval, tool usage, and chain composition.
* **Qdrant** for vector search and RAG memory.
* **LLM provider APIs** for hosted generation, summarization, and translation tasks.
* **Whisper-style or equivalent speech services** if voice features are added later.

### 5.4 Data and Storage

* **PostgreSQL** as the core relational database.
* **PostGIS** if geo-based agricultural analytics are required.
* **Qdrant** as vector database.
* **Redis** as cache and job broker.
* **S3-compatible object storage** for images, documents, model artifacts, and reports.

### 5.5 DevOps and Delivery

* **Docker** for local reproducibility.
* **Docker Compose** for developer environments.
* **Kubernetes** for scale-out deployments.
* **GitHub Actions** for CI/CD.
* **Prometheus + Grafana** for metrics and dashboards.
* **Centralized logs** through Loki or a similar stack.
* **LangSmith or equivalent** for agent tracing and debugging.

### 5.6 API and Integration

* REST for public and internal APIs.
* WebSockets or SSE for streaming AI responses.
* OpenAPI-first contracts for all services.
* Auth layer compatible with email, phone, and future government identity integration.

---

## 6. Monorepo Root Structure

The repository should start as a monorepo so that app, services, models, and shared packages remain organized.

```text
agri-ai-platform/
├── apps/
│   ├── web/
│   ├── admin/
│   ├── docs/
│   └── mobile-web/                # optional later
│
├── services/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── crop-routing-service/
│   ├── disease-brassica-service/
│   ├── disease-rice-service/
│   ├── disease-corn-service/
│   ├── disease-potato-service/
│   ├── disease-wheat-service/
│   ├── rag-service/
│   ├── agent-orchestrator/
│   ├── advisory-service/
│   ├── analytics-service/
│   ├── notification-service/
│   └── report-service/
│
├── models/
│   ├── crop-classifier/
│   ├── brassica-disease/
│   ├── rice-disease/
│   ├── corn-disease/
│   ├── potato-disease/
│   ├── wheat-disease/
│   └── shared-model-utils/
│
├── packages/
│   ├── ui/
│   ├── config/
│   ├── types/
│   ├── schemas/
│   ├── constants/
│   ├── prompts/
│   ├── ai-tools/
│   ├── auth/
│   └── utils/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   ├── monitoring/
│   └── ci-cd/
│
├── datasets/
├── notebooks/
├── experiments/
├── scripts/
├── docs/
└── README.md
```

---

## 7. Frontend Architecture Plan

### 7.1 Frontend goals

The frontend must remain fast, accessible, and easy to extend without interfering with business logic.

### 7.2 Frontend boundaries

* UI only renders data and sends actions.
* UI never contains model logic.
* UI never calls model files directly.
* All external communication must go through API clients or server actions.

### 7.3 Main frontend modules

#### Public web app

* Landing page
* About project
* Crop upload and diagnosis page
* AI chat and advisory page
* Knowledge articles
* FAQ and help center
* Contact support
* Language switcher

#### Farmer dashboard

* Diagnosis history
* Saved advisories
* Nearby alerts
* Recommended actions
* Voice guidance

#### Admin dashboard

* User activity overview
* Disease trend map
* Model performance metrics
* Manual moderation queue
* Knowledge base management

### 7.4 Frontend folder design

```text
apps/web/
├── app/
│   ├── (public)/
│   ├── (dashboard)/
│   ├── (auth)/
│   └── api/
├── components/
├── features/
│   ├── diagnosis/
│   ├── advisory/
│   ├── articles/
│   ├── alerts/
│   └── profile/
├── hooks/
├── lib/
├── styles/
├── i18n/
└── tests/
```

### 7.5 Frontend development rules

* Each feature should own its own UI, hooks, schemas, and API adapters.
* Reusable shared UI must go into `packages/ui`.
* Page-level logic should remain in the feature folder.
* Avoid global state unless it is truly cross-cutting.
* Prefer route-based modularity over large shared containers.

---

## 8. Backend Architecture Plan

### 8.1 Backend goals

The backend must provide stable contracts, isolate AI logic, and support long-running workflows.

### 8.2 Core backend services

#### API Gateway

Responsibilities:

* route requests,
* enforce auth,
* rate limit public endpoints,
* aggregate downstream service responses,
* centralize API versioning.

#### Auth Service

Responsibilities:

* user registration,
* login/logout,
* session handling,
* role-based access control,
* future government identity integration.

#### Crop Routing Service

Responsibilities:

* determine crop family from image or metadata,
* route to the correct disease model,
* return routing confidence,
* handle fallback logic.

#### Disease Model Services

Separate services for each crop family.
Responsibilities:

* infer disease class,
* estimate confidence,
* provide severity signals,
* return model metadata and version.

#### Advisory Service

Responsibilities:

* convert diagnosis results into practical advice,
* format treatment steps,
* localize recommendations into Bangla,
* adapt advice to region and crop stage.

#### RAG Service

Responsibilities:

* retrieve policy and agriculture knowledge,
* ground AI answers in trusted documents,
* provide citations or source references internally.

#### Agent Orchestrator

Responsibilities:

* coordinate multi-step workflows,
* call tools in sequence,
* manage branching and fallback,
* maintain state across agent steps.

#### Analytics Service

Responsibilities:

* store usage metrics,
* track region-level disease trends,
* support dashboards,
* generate reports for officers and administrators.

#### Notification Service

Responsibilities:

* SMS/email/push notifications,
* advisory reminders,
* outbreak alerts,
* scheduled weather warnings.

#### Report Service

Responsibilities:

* generate PDF reports,
* create downloadable advisory summaries,
* create government-ready exports.

### 8.3 Backend folder design pattern

Each service should follow a consistent shape.

```text
service-name/
├── app/
│   ├── api/
│   ├── core/
│   ├── domain/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── workers/
│   └── main.py
├── tests/
├── Dockerfile
└── README.md
```

### 8.4 Backend design rules

* Keep domain logic inside `domain` or `services`.
* Keep database access inside repositories.
* Keep request validation in schemas.
* Keep orchestration logic out of endpoint handlers.
* Keep each service deployable on its own.

---

## 9. Model Architecture Plan

### 9.1 Model system goals

The model layer should remain specialist-based rather than universal.

### 9.2 Existing model strategy

* First classify crop type.
* Route to the correct crop family service.
* Run the crop-specific disease model.
* Return diagnosis.
* Pass output to the advisory pipeline.

### 9.3 Model services

Each crop family should be treated as a separate model domain.

Suggested model packages:

* `crop-classifier`
* `brassica-disease`
* `rice-disease`
* `corn-disease`
* `potato-disease`
* `wheat-disease`

### 9.4 Model service contract

Each model service should expose the same interface:

* input image
* optional crop metadata
* output class label
* confidence
* severity estimate
* top-k probabilities
* model version
* inference duration

### 9.5 Model serving principles

* Standardize preprocessing.
* Keep versioned inference pipelines.
* Store model metadata with reproducibility details.
* Use ONNX or equivalent only when it improves speed or deployment reliability.
* Do not mix training code with production inference code.

### 9.6 Model lifecycle structure

```text
datasets/ -> notebooks/ -> experiments/ -> model registry -> service deployment -> monitoring -> retraining
```

---

## 10. Agentic Workflow Architecture

This is the core intelligence layer of the platform.

### 10.1 Why agent workflows are needed

A single LLM response is not enough for a government-grade advisory system. The system needs workflow control, tool usage, fallback policies, memory, and validation.

### 10.2 Recommended orchestration framework

* Use **LangGraph** as the primary workflow engine.
* Use **LangChain** for tools, retrievers, prompt composition, and integrations.
* Use a dedicated agent service rather than embedding orchestration inside the frontend or general API routes.

### 10.3 Main agent roles

#### 1. Crop Intake Agent

Purpose:

* accept image or text input,
* identify intent,
* detect whether the request is diagnosis, pricing, weather, or general advice.

#### 2. Crop Routing Agent

Purpose:

* determine crop family,
* choose the correct specialized model.

#### 3. Disease Diagnosis Agent

Purpose:

* interpret model output,
* convert class labels into human-readable diagnosis.

#### 4. Advisory Agent

Purpose:

* generate practical treatment or prevention guidance,
* provide steps in Bangla,
* respect locality and crop type.

#### 5. RAG Verification Agent

Purpose:

* check advice against curated agriculture documents,
* reduce hallucination risk,
* suggest grounded corrections.

#### 6. Weather Risk Agent

Purpose:

* combine weather data with disease likelihood,
* generate alerts and preventive suggestions.

#### 7. Escalation Agent

Purpose:

* decide when to ask the user for more images,
* decide when to suggest human expert review,
* decide when confidence is too low.

#### 8. Summarization Agent

Purpose:

* create short farmer-friendly summaries,
* create officer-friendly summaries,
* create report-ready outputs.

### 10.4 Core agent workflow chain

```text
User Input
→ Intent Agent
→ Crop Routing Agent
→ Specialized Model Service
→ Diagnosis Interpreter
→ Advisory Agent
→ RAG Verification Agent
→ Localization Agent
→ Response Formatter
→ User Output
```

### 10.5 Workflow branching rules

* If image confidence is low, request another image or human review.
* If the crop is unknown, route to fallback classifier.
* If the advice touches chemical usage, trigger safety validation.
* If weather conditions increase disease risk, add preventive warning.
* If the region is known for outbreaks, inject regional context.

---

## 11. Data Architecture Plan

### 11.1 Core database entities

The relational database should store:

* users,
* roles,
* diagnoses,
* advisories,
* crops,
* disease classes,
* model versions,
* agent runs,
* alert subscriptions,
* documents,
* feedback,
* audit logs.

### 11.2 Suggested database boundaries

#### PostgreSQL

Use for:

* user and session data,
* diagnosis records,
* advisory history,
* reports,
* analytics summaries,
* moderation records.

#### Qdrant

Use for:

* agriculture document embeddings,
* advisory memory,
* knowledge retrieval,
* semantic search over manuals and policy docs.

#### Redis

Use for:

* request cache,
* temporary workflow state,
* rate limiting,
* queue support,
* AI response caching.

#### Object storage

Use for:

* uploaded images,
* generated reports,
* dataset assets,
* model artifacts.

### 11.3 Suggested data flow

```text
Upload → Object Storage
       → Metadata in PostgreSQL
       → Embedding in Qdrant if needed
       → Workflow state in Redis
       → Final advisory saved back to PostgreSQL
```

---

## 12. API Design Plan

### 12.1 API design principles

* Every endpoint must have a single responsibility.
* Every response must be schema-validated.
* Version APIs from the beginning.
* Prefer predictable JSON structures.
* Separate public, private, and internal APIs.

### 12.2 Endpoint categories

#### Public API

* diagnosis submission
* advisory retrieval
* article browsing
* FAQ and help
* contact submission

#### Authenticated API

* history access
* saved reports
* alerts subscription
* personal profile
* user feedback

#### Admin API

* content moderation
* system analytics
* model monitoring
* regional outbreak management

#### Internal API

* model inference calls
* agent graph execution
* RAG retrieval calls
* report generation jobs

---

## 13. Security, Reliability, and Governance

### 13.1 Security

* Role-based access control.
* Secure file uploads.
* Input validation at every boundary.
* Rate limiting on public endpoints.
* Audit logging for AI advice and admin actions.

### 13.2 Reliability

* Retry failed model or LLM calls where safe.
* Add graceful fallbacks.
* Cache repeated advisory patterns.
* Keep a human review path for low-confidence cases.

### 13.3 Governance

* Store model version with every diagnosis.
* Store prompt/version metadata for agent outputs.
* Log source documents used for RAG.
* Keep an approval path for public-sector content.

---

## 14. Modularity Rules for AI-Assisted Development

These rules are important when using AI agents for incremental development.

### 14.1 One feature = one module

A feature must not be spread randomly across the repository.

### 14.2 One service = one responsibility

Avoid creating services that do too much.

### 14.3 Shared code must be intentional

Only truly reusable code goes to `packages/`.

### 14.4 Prompt logic stays centralized

All prompts, tool definitions, and AI templates must live in dedicated prompt files.

### 14.5 Schema-first development

Define schemas before implementation so AI agents can generate compatible code faster.

### 14.6 Test before expansion

Every new feature should ship with tests or at least structured validation rules.

---

## 15. File Ownership Rules for Future Work

### Where new ideas should go

#### New frontend page

* `apps/web/app/(...)`

#### New UI component

* `packages/ui` if reusable
* feature-local component folder if page-specific

#### New backend capability

* corresponding service folder inside `services/`

#### New AI agent step

* `services/agent-orchestrator/`
* or dedicated workflow module inside `packages/ai-tools/`

#### New prompt or LLM behavior

* `packages/prompts/`

#### New shared types or schemas

* `packages/types/` and `packages/schemas/`

#### New dataset or experiment

* `datasets/` or `experiments/`

#### New infrastructure change

* `infrastructure/`

---

## 16. Suggested Development Sequence

### Phase 1: Foundation

* repo setup
* monorepo tooling
* base auth
* base UI system
* API gateway
* logging and config

### Phase 2: Diagnosis MVP

* crop upload
* crop routing
* crop-specific disease inference
* result display
* saved history

### Phase 3: Advisory Layer

* Bangla advice generation
* RAG grounding
* severity-based treatment recommendations
* report export

### Phase 4: Agentic Intelligence

* LangGraph orchestration
* weather-aware warnings
* escalation and fallback workflows
* chat assistant

### Phase 5: Government Scale

* admin dashboard
* analytics
* outbreak monitoring
* role-based oversight

### Phase 6: Expansion

* voice input/output
* mobile-first optimization
* IoT integration
* geospatial and drone support

---

## 17. Definition of Done for Each Module

A module is considered done only when it has:

* a clear folder boundary,
* documented input/output contract,
* test coverage or validation,
* integration through the API layer,
* no hidden coupling with unrelated modules,
* readable docs for future AI agents.

---

## 18. Operational Context for AI Agents

When an AI coding agent works on this repository, it should:

* search only within the relevant service or feature folder,
* not modify unrelated modules,
* respect schema contracts,
* preserve naming conventions,
* update docs when behavior changes,
* prefer small, reviewable diffs,
* avoid generating duplicate logic.

Agents should always ask:

1. Which domain owns this logic?
2. Which schema defines the contract?
3. Which service should change?
4. Which tests must be updated?
5. Which docs must be synchronized?

---

## 19. Final Architecture Summary

The platform should be built as a **modular AI agriculture ecosystem** with:

* a Next.js public and admin frontend,
* FastAPI-based backend services,
* specialist crop disease model services,
* LangGraph-based agent orchestration,
* PostgreSQL, Redis, and Qdrant as core data systems,
* strong monorepo organization,
* clear contract-driven boundaries,
* AI-agent-friendly documentation and folder structure.

This structure will let the team build incrementally, allow AI agents to work efficiently, and keep the platform scalable for Bangladesh-wide deployment.
