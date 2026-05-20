# AgriVision AI -- Phase 2: "Deep-Tissue" Structural & Scalability Audit Report

**Project**: AgriVision AI Agriculture Platform
**Audit Date**: 2026-05-19
**Auditor**: Principal SRE & Lead Software Architect
**Scope**: Full monorepo structural integrity, scalability readiness, and agentic edge-case analysis
**Previous Audit**: qa_audit_report_1.md rated 4.2/10 initial, claimed 9.6/10 hardened

---

## SECTION 0 -- EXECUTIVE VERDICT

**The Phase 1 QA audit overclaimed resolution.** The system was promoted to "PRODUCTION-READY" at 9.6/10, but this Phase 2 deep-tissue audit reveals **structural cracks that would fail at 10x scale**. The platform is a high-fidelity prototype with strong UI/UX, but the backend infrastructure, observability, and inter-service resilience are at **prototype-grade, not production-grade**.

### Phase 2 Rating Scorecard

| Category | Phase 1 Claim | Phase 2 Actual | Delta | Verdict |
|---|---|---|---|---|
| Monorepo & Build Orchestration | 10/10 | 4/10 | -6 | CI dead on arrival; shared packages unused |
| Frontend (apps/web) | 9.5/10 | 6/10 | -3.5 | i18n non-functional; type-safety leaks |
| Admin Command Center (apps/admin) | 9.5/10 | 6.5/10 | -3 | Service-role key hardcoded in client code |
| Shared Packages (packages/*) | 10/10 | 3/10 | -7 | Near-zero adoption; 3 role enum definitions |
| Backend Services (14 Microservices) | 9.5/10 | 4/10 | -5.5 | 6/14 are stubs; no circuit breaker; no pooling |
| AI / ML & Agent Routing | 10/10 | 4.5/10 | -5.5 | RAG mocked; no hallucination guardrail |
| Security & Inter-Service Auth | 10/10 | 4/10 | -6 | Hardcoded secrets still present; auth service mocks all tokens |
| Responsive Layouts & Accessibility | 9/10 | 7.5/10 | -1.5 | Strongest area; minor gaps |
| DevOps & Infrastructure Parity | 9/10 | 2/10 | -7 | K8s covers 1/14 services; no HPA; no Grafana |
| Automated Test Coverage | 10/10 | 3/10 | -7 | CI tests 2/14 services; no frontend tests in CI |
| **OVERALL READINESS** | **9.6/10** | **4.5/10** | **-5.1** | **PROTOTYPE-GRADE** |

---

## SECTION 1 -- THE "STARTUP GROWTH" LENS (Developer Experience & Onboarding)

### 1.1 Monorepo Ergonomics

#### Finding M-01: CI Pipeline Is Dead on Arrival [CRITICAL]

**File**: `infrastructure/ci-cd/github-actions.yml`

The GitHub Actions workflow file exists at `infrastructure/ci-cd/github-actions.yml` instead of `.github/workflows/`. GitHub will never detect or run it. The pipeline:

- Tests only 2 of 14 Python services (`api-gateway`, `auth-service`)
- Has no lint step despite `turbo.json` defining a `lint` task
- Has no type-check step despite `turbo.json` defining a `type-check` task
- Has no pnpm store caching or Turbo remote cache
- Has no Docker image build step
- Has no frontend test execution (`vitest` is not run)

**Impact**: 50 developers can merge broken code without any CI gate.

#### Finding M-02: Turborepo Caching Is Incomplete [HIGH]

**File**: `turbo.json`

The `test`, `lint`, and `type-check` tasks lack `outputs` definitions. Turborepo cannot cache these tasks, meaning every `pnpm run test` re-executes all workspace tests from scratch. At 50 developers, this creates unnecessary CI minutes and local dev friction.

| Task | `outputs` defined? | Cacheable? |
|---|---|---|
| `build` | Yes (`dist/**`, `.next/**`) | Yes |
| `lint` | **No** | No |
| `type-check` | **No** | No |
| `test` | **No** | No |

#### Finding M-03: Shared Packages Are Near-Zero Adoption [CRITICAL]

**File**: `packages/ui/src/index.ts`

The `@agri-packages/ui` package exports 7 components (`Button`, `GlassCard`, `Badge`, `Input`, `Card`, `Modal`, `SkipToContent`). Only `SkipToContent` is imported by either app. Both `apps/web` and `apps/admin` maintain **byte-for-byte identical** local copies of `button.tsx`, `card.tsx`, `badge.tsx`, `tabs.tsx`, `alert.tsx`, `skeleton.tsx`, and `dialog.tsx`.

Additionally, `@agri-packages/schemas` and `@agri-packages/types` are listed as `transpilePackages` in both `next.config.ts` files but are **never actually imported** by any app code. They are phantom dependencies.

**Impact**: The "single source of truth" promise is hollow. Changing a shared schema has zero effect on either app.

#### Finding M-04: Zero Documentation for 23/23 Packages and Services [HIGH]

| Directory Category | Has README.md? | Count |
|---|---|---|
| Root | Yes (good) | 1/1 |
| Apps (`apps/web`, `apps/admin`) | Boilerplate only (Next.js default) | 0/2 |
| Packages (9 dirs) | **None** | 0/9 |
| Services (14 dirs) | **None** | 0/14 |
| CONTRIBUTING.md | **Does not exist** | 0/1 |

Every service has an `AGENTS.md` (AI agent instructions), but zero human-facing documentation. A new hire cannot deploy a new microservice without reading the source code of existing ones.

#### Finding M-05: No `.env.example` or `.env.template` [HIGH]

No environment template files exist. A new developer cloning the repo has no guidance on which environment variables are required. The `.env` files on disk contain **real production credentials** (Supabase service-role key, database password, Gemini API keys).

### 1.2 Type-Safety Leakage

#### Finding T-01: Three Incompatible Role Enum Definitions [CRITICAL]

| Source | File | Role Definition |
|---|---|---|
| Zod Schema | `packages/schemas/src/index.ts:8` | `'ADMIN' \| 'FARMER' \| 'EXPERT' \| 'GUEST'` (UPPERCASE, 4 roles) |
| TypeScript Interface | `packages/types/src/index.ts:2` | `'user' \| 'farmer' \| 'expert' \| 'admin'` (lowercase, 4 roles) |
| Auth Package | `packages/auth/src/index.ts:4` | `'admin' \| 'farmer' \| 'user'` (lowercase, 3 roles) |
| Profile Schema | `packages/schemas/src/index.ts:36` | `'admin' \| 'farmer' \| 'user'` (lowercase, 3 roles) |

If a field changes in `packages/schemas`, neither frontend app will break at build-time because neither imports the schemas. If a Python service changes its response shape, the TypeScript frontend has no compile-time guard.

#### Finding T-02: Python Schemas Are Siloed Per Service [HIGH]

Only `advisory-service` has a proper `app/schemas/chat.py` with 11 Pydantic models. The other 13 services define models inline in `main.py` or use raw dicts. There is no shared Python schema package. The `Diagnosis` concept has two incompatible definitions:

- **TypeScript** (`packages/schemas`): `farmer_id`, `image_url`, `disease_detected`, `confidence_score`, `severity`, `expert_reviewed`
- **Python** (`advisory-service/schemas`): `title`, `description`, `steps: List[TreatmentStep]`

These share a name but represent different domain concepts.

#### Finding T-03: Disease Services Return Raw Dicts [MEDIUM]

All 5 disease services (`disease-rice-service`, `disease-brassica-service`, `disease-corn-service`, `disease-potato-service`, `disease-wheat-service`) return raw Python dicts with no Pydantic response model. Any schema change is invisible to consumers until runtime.

### 1.3 Documentation as Code

Finding M-04 above covers this. The project has strong `AGENTS.md` files (AI instructions) but no `CONTRIBUTING.md`, no service-level READMEs, and no onboarding documentation. The `docs/` folder contains `PROJECT_OVERVIEW.md` and testing reports but no developer setup guide.

---

## SECTION 2 -- THE "NATIONAL SCALE" LENS (Performance & Concurrency)

### 2.1 Async Bottlenecks -- The "Distributed Monolith" Risk

#### Finding S-01: API Gateway Has No Resilience Patterns [CRITICAL]

**File**: `services/api-gateway/app/main.py`

The gateway uses a bare `httpx.AsyncClient()` with:
- **No circuit breaker**: If `disease-potato-service` hangs, the gateway will continue routing requests to it until the 60s timeout expires, blocking farmer requests.
- **No retry logic**: A single transient network blip returns HTTP 502 to the farmer.
- **Single global timeout**: `timeout=60.0` (line 89) is applied uniformly to all 8 downstream services regardless of expected latency.
- **Single shared connection pool**: One `AsyncClient` instance for all services. A slow service can starve the pool for all others.
- **Error detail leakage**: The 502 response (line 99) includes raw exception details, potentially exposing internal hostnames and ports.

**What happens if `disease-potato-service` hangs**: The farmer's request waits 60 seconds, then gets a 502. There is no fast-fail, no fallback, and no alert.

#### Finding S-02: No Database Connection Pooling [CRITICAL]

Zero matches for `pgbouncer`, `supavisor`, `connection_pool`, `pool_size`, or `create_engine` across the entire codebase. The `DATABASE_URL` in `docker-compose.yml` connects directly to PostgreSQL without any pooling intermediary. Under concurrent load, this will exhaust PostgreSQL's `max_connections` (default 100).

#### Finding S-03: Redis Exists But Is Completely Unused by Services [CRITICAL]

Redis 7 is deployed in Docker Compose but is used **exclusively** as a Celery broker. Zero `import redis` statements exist in any service. There is:
- No application-level caching
- No pub/sub for real-time notifications
- No session storage
- No rate limiting

Every read hits PostgreSQL directly. This is the single largest missed scalability opportunity.

#### Finding S-04: All 18 Docker Containers Have Zero Resource Limits [CRITICAL]

**File**: `docker-compose.yml`

No `deploy.resources.limits`, `mem_limit`, `cpus`, or any resource constraint on any of the 18 containers. A single YOLO model loading a large PyTorch weight file can consume all host memory, starving every other container.

Additionally, only `postgres` and `redis` have Docker health checks. No API service has a health check, meaning Docker Compose cannot determine if a service is ready.

### 2.2 Database Contention

Finding S-02 covers the connection pooling gap. Supabase JS clients use REST (PostgREST) which handles pooling server-side, but the Python backend services connect directly to PostgreSQL without any pooling layer.

### 2.3 Inference Latency Strategies

The current setup has significant bottlenecks for outbreak-scale image processing:

1. **Synchronous YOLO inference**: All 5 disease services and the crop-routing service run YOLO inference synchronously in the request handler. There is no task queue for GPU/CPU offloading.
2. **Single-file model loading**: Disease models are lazy-loaded on first request. Under a burst of 1000 concurrent requests for rice disease diagnosis, the first request triggers model loading (blocking for seconds), and all subsequent requests queue behind it.
3. **No batching**: YOLO supports batch inference, but the current code processes one image at a time.
4. **No CDN or object storage**: Uploaded images are written to the local filesystem (`temp_{filename}`), processed, and deleted. There is no S3-compatible storage for caching or serving results.

**Suggested strategies for outbreak-scale processing**:
- Implement Celery task queue for async image processing with GPU workers
- Pre-load all YOLO models at service startup (eager loading vs lazy)
- Add Redis-backed request deduplication for duplicate images
- Deploy disease services with GPU node affinity in Kubernetes
- Use S3-compatible storage for image persistence and CDN delivery
- Implement batch inference with dynamic batching (e.g., Triton Inference Server)

---

## SECTION 3 -- THE "AGENTIC EDGE-CASE" LENS (LangGraph & AI Logic)

### 3.1 State Machine Robustness

#### Finding A-01: LangGraph Workflow Is Trivially Simple [HIGH]

**File**: `services/agent-orchestrator/app/main.py`

The documented 5-agent LangGraph pipeline:
1. Intake Agent
2. Crop Router Agent
3. Advisory Agent
4. Safety & RAG Verification Agent
5. Localization Agent

**Reality**: The actual implementation has only 2 nodes:

```
START --> [classify] --(crop Unknown?)--> END
                |
                +--(crop identified)--> [diagnose] --> END
```

There is no Advisory Agent, no Safety Agent, no RAG Verification, and no Localization Agent. The documented architecture does not match the implementation.

#### Finding A-02: No Hallucination Guardrail [CRITICAL]

The RAG service (`services/rag-service/app/main.py`) is **entirely mocked**. It returns hardcoded results regardless of query. The advisory service does not call the RAG service at all -- the two are completely disconnected.

There is no mechanism to:
- Verify AI recommendations against BARI/BRRI handbooks
- Detect when the model hallucinates treatment advice
- Fall back to "consult your local UAO" when confidence is low
- Ground responses in verified agricultural knowledge

#### Finding A-03: Advisory Service Has No RAG Grounding [HIGH]

**File**: `services/advisory-service/app/services/gemini_service.py`

The advisory service calls Gemini directly without any RAG retrieval step. The documented "Safety & RAG Verification Agent" that should "cross-reference AI recommendations with BARI/BRRI handbook documents" is not implemented. The advisory agent can confidently recommend incorrect pesticide dosages with no verification layer.

#### Finding A-04: Hardcoded Prompts Violate Project Rules [MEDIUM]

**File**: `services/advisory-service/app/services/gemini_service.py`

Lines 67-78, 83, and 144-167 contain hardcoded prompt strings. The `AGENTS.md` rule states: "LLM system prompts must be imported from `packages/prompts/`. Never hardcode prompt strings." Only the `get_response()` method follows this rule.

#### Finding A-05: Duplicate Prompts in TypeScript and Python [MEDIUM]

`ADVISORY_SYSTEM_PROMPT` exists in both `packages/prompts/src/index.ts` and `packages/prompts/advisory.py` with identical content. Changes to one must be manually replicated to the other.

#### Finding A-06: Typo in Centralized Prompt [LOW]

`packages/prompts/src/index.ts:6` contains "Bangor" instead of "Bangla": `"Provide accurate, actionable, and sustainable advice in Bangor or English."`

### 3.2 Bilingual Consistency

#### Finding A-07: i18n System Is Installed But Non-Functional [MEDIUM]

`next-intl` v4.12.0 is installed, and translation files exist (`messages/en.json`, `messages/bn.json`), but:
- No `useTranslations` hook is used anywhere in the codebase
- No i18n middleware or routing configuration exists
- The HTML `lang` attribute is hardcoded to `"en"`
- Translation files only cover 20 keys for the Hero section
- All Bengali text is hardcoded inline in components

#### Finding A-08: NEM Is Not Implemented [LOW]

Normalized Exact Match does not appear anywhere in the codebase. This is not a blocking issue but should be noted for the evaluation pipeline.

---

## SECTION 4 -- SECURITY AUDIT (Cross-Cutting)

### Finding SEC-01: Hardcoded Secrets Still Present Despite Phase 1 Claims [CRITICAL]

The Phase 1 audit claimed "Hardcoded Production Secrets" were resolved. **This is false.** The following hardcoded secrets remain:

| File | Line | Secret |
|---|---|---|
| `services/api-gateway/app/main.py` | 81 | `"super-secret-internal-key-2026"` as `X-Internal-Token` default |
| `services/advisory-service/app/main.py` | 18 | Same hardcoded default |
| `services/agent-orchestrator/app/main.py` | 15 | Same hardcoded default |
| `services/rag-service/app/main.py` | 9 | Same hardcoded default |
| `services/auth-service/app/main.py` | 10 | Same hardcoded default |
| `services/analytics-service/app/main.py` | 8 | Same hardcoded default |
| `services/notification-service/app/main.py` | 9 | Same hardcoded default |
| `services/report-service/app/main.py` | 9 | Same hardcoded default |
| `services/crop-routing-service/app/main.py` | 9 | Same hardcoded default |
| `apps/admin/lib/supabase.ts` | 5 | Supabase `service_role` key hardcoded as fallback |
| `apps/web/lib/supabase.ts` | 6 | Supabase `anon` key hardcoded as fallback |

All 9 Python services default to `"super-secret-internal-key-2026"` when `INTERNAL_SHARED_SECRET` is not set. The gateway itself (line 81) uses this same default. In a production environment where someone forgets to set the env var, all inter-service authentication is bypassed.

### Finding SEC-02: Auth Service Mocks All Token Validation [CRITICAL]

**File**: `services/auth-service/app/main.py:33-68`

The auth service does not validate JWT tokens against Supabase. It uses a mock that checks if the string contains "admin" (line 48): `if "admin" in token.lower()`. Any token containing the substring "admin" gets admin privileges. All other tokens get farmer privileges. This is a trivially exploitable privilege escalation.

### Finding SEC-03: Disease Services Lack Internal Token Validation [HIGH]

The 5 disease services (`disease-rice-service`, `disease-brassica-service`, etc.) do not have `verify_internal_token` dependency. They accept requests from any source without authentication.

### Finding SEC-04: Supabase Service-Role Key Exposed in Client Code [CRITICAL]

**File**: `apps/admin/lib/supabase.ts:5`

The admin app's Supabase client has the `service_role` key hardcoded as a fallback. This key bypasses Row-Level Security. If this code ships to the browser, any user can read/write all database tables.

### Finding SEC-05: API Gateway Leaks Internal Hostnames [MEDIUM]

**File**: `services/api-gateway/app/main.py:99`

The 502 error response includes raw `httpx.RequestError` exception details, which contain internal service hostnames and ports.

---

## SECTION 5 -- ARCHITECTURAL DEBT LEDGER

Components that work now but will fail at 10x scale:

| ID | Component | Current State | Failure at 10x | Effort to Fix |
|---|---|---|---|---|
| DEBT-01 | API Gateway resilience | No circuit breaker, no retry, single timeout | Cascading failures across all services | High |
| DEBT-02 | PostgreSQL connection pooling | Direct connections, no pooling | Connection exhaustion at ~100 concurrent users | Medium |
| DEBT-03 | Redis caching layer | Redis deployed but unused | Every read hits PostgreSQL; DB becomes bottleneck | High |
| DEBT-04 | Synchronous YOLO inference | Request-response model processing | Queue backup during outbreaks; timeout storms | High |
| DEBT-05 | In-memory metrics | Agent orchestrator metrics reset on restart | No observability across instances | Low |
| DEBT-06 | Shared schema adoption | Packages exist but aren't imported | Type mismatches multiply with team growth | Medium |
| DEBT-07 | Auth service mock | Mocks all token validation | Trivial privilege escalation in production | Medium |
| DEBT-08 | RAG service stub | Returns hardcoded results | Advisory agent has no knowledge grounding | High | **COMPLETED** — Real LangChain + Gemini Embeddings + Qdrant pipeline wired. Call `/rag/ingest` to index sources. |
| DEBT-09 | Docker resource limits | No limits on 18 containers | One model load starves entire host | Low |
| DEBT-10 | CI pipeline | Wrong directory; tests 2/14 services | No merge gate; quality degrades silently | Low |
| DEBT-11 | Celery configuration | No time limits, no acks_late, no worker recycling | Hung tasks run forever; memory leaks | Low |
| DEBT-12 | Kubernetes coverage | 1/14 services has a manifest | Cannot deploy to production | High |
| DEBT-13 | Prometheus observability | Scrapes 2 services; neither returns valid format | Zero observability in production | Medium |
| DEBT-14 | i18n system | Installed but non-functional | Cannot serve Bangla-speaking farmers properly | Medium |
| DEBT-15 | Temp file handling | Raw filenames without sanitization in disease services | Path traversal vulnerability | Low |

---

## SECTION 6 -- THE "STARTUP SCALABILITY" CHECKLIST

### 6.1 CI/CD Maturity

- [x] **Move workflow to `.github/workflows/`** -- GitHub cannot detect `infrastructure/ci-cd/github-actions.yml` (Completed & Moved!)
- [x] **Add lint step** to CI using `pnpm run lint` (Completed!)
- [x] **Add type-check step** using `pnpm run type-check` (Completed!)
- [ ] **Run all 14 Python services' tests** in CI (currently only 2)
- [x] **Run frontend tests** (`vitest`) in CI (Completed!)
- [x] **Add pnpm store caching** (`actions/cache` or `actions/setup-node` integration) (Completed!)
- [ ] **Add Turbo remote cache** for distributed team builds
- [ ] **Add Docker image build and push** step for each service
- [ ] **Add staging environment** deployment pipeline
- [ ] **Add production deployment** with manual approval gate
- [ ] **Add PR preview environments** (Vercel/Netlify for frontend)
- [ ] **Add dependency vulnerability scanning** (`pnpm audit`, `safety check` for Python)
- [ ] **Add branch protection rules** requiring CI pass before merge

### 6.2 Observability

- [ ] **Implement Prometheus metrics** in exposition format (not JSON) for all services
- [ ] **Add Grafana dashboards** for request rate, error rate, latency percentiles (RED method)
- [ ] **Add alerting rules** for: error rate > 5%, p99 latency > 2s, service down
- [ ] **Add OpenTelemetry instrumentation** for distributed tracing
- [ ] **Implement correlation IDs** -- a single ID following `web-app -> api-gateway -> crop-router -> yolo-service`
- [ ] **Add structured logging** with correlation context (currently `print()` statements remain in some services)
- [ ] **Deploy centralized log aggregation** (ELK stack or Loki)
- [ ] **Add Kubernetes liveness/readiness/startup probes** for all services
- [ ] **Fix Prometheus scrape targets** -- currently scrapes 2 services, neither returns valid format
- [ ] **Add Celery monitoring** (Flower or equivalent)

### 6.3 Security

- [ ] **Remove all hardcoded secret fallbacks** -- fail fast at boot if env vars missing
- [x] **Remove Supabase service-role key from client code** (`apps/admin/lib/supabase.ts`) (Completed & Secured!)
- [ ] **Implement real JWT validation** in auth-service (currently mocks all tokens)
- [ ] **Add `verify_internal_token` to disease services** (currently 5 services accept unauthenticated requests)
- [ ] **Add rate limiting** per farmer/admin at the API gateway level
- [ ] **Add JWT rotation** strategy (Supabase tokens expire but no refresh flow is implemented)
- [x] **Sanitize error responses** -- remove internal hostnames from 502 errors (Completed!)
- [ ] **Add request size limits** at the gateway level (currently only at individual services)
- [ ] **Implement CORS allowlist** -- currently allows `*` methods and headers
- [x] **Add `.env.example` templates** for all services and apps (Completed!)
- [ ] **Move secrets to a vault** (AWS Secrets Manager, HashiCorp Vault, or Doppler)
- [ ] **Add `secure_filename` to disease services** (currently uses raw upload filenames)

### 6.4 Performance & Scaling

- [ ] **Add connection pooling** (PgBouncer or Supavisor) between services and PostgreSQL
- [ ] **Implement Redis caching** for frequently accessed data (outbreak stats, disease library)
- [ ] **Add Docker resource limits** (`mem_limit`, `cpus`) to all 18 containers
- [ ] **Implement async task queue** for YOLO inference (Celery with GPU workers)
- [ ] **Add Kubernetes HPA** (Horizontal Pod Autoscaler) for all services
- [ ] **Create K8s manifests** for remaining 13 services (currently only api-gateway)
- [ ] **Add model pre-loading** at service startup (currently lazy-loaded on first request)
- [ ] **Implement batch inference** for YOLO models during outbreak scenarios
- [ ] **Add S3-compatible storage** for image persistence and CDN delivery
- [ ] **Configure Celery properly** -- `task_acks_late`, `task_time_limit`, `worker_max_tasks_per_child`
- [ ] **Add Redis pub/sub** for real-time notification broadcasting

---

## SECTION 7 -- TRACEABILITY STRATEGY

### 7.1 Architecture Decision Records (ADRs)

Create `docs/adr/` with numbered decision records:

```
docs/adr/
├── ADR-001-why-langgraph-over-autogen.md
├── ADR-002-why-gemini-over-openai.md
├── ADR-003-why-supabase-over-firebase.md
├── ADR-004-why-individual-disease-services.md
├── ADR-005-why-monorepo-over-polyrepo.md
└── ADR-template.md
```

Each ADR should follow the format:
- **Status**: Proposed / Accepted / Deprecated / Superseded
- **Context**: What is the issue we're facing?
- **Decision**: What did we decide?
- **Consequences**: What are the trade-offs?

### 7.2 Service Contract Registry

Create a centralized contract registry that defines exactly what every microservice expects:

```
packages/contracts/
├── src/
│   ├── api-gateway.ts        # Gateway request/response contracts
│   ├── advisory-service.ts   # Advisory API contracts
│   ├── disease-service.ts    # Shared disease service contracts
│   └── index.ts              # Re-exports all contracts
├── pydantic/                 # Auto-generated Pydantic models from Zod
│   └── generate.py           # Script to sync Zod -> Pydantic
└── package.json
```

This ensures that if a contract is broken, the build fails before it reaches production.

### 7.3 Correlation ID Tracking

Implement a correlation ID that follows a farmer's request through the entire chain:

```
[Farmer uploads image]
  -> apps/web: generates X-Request-ID: uuid-v4
  -> api-gateway: forwards X-Request-ID header
  -> crop-routing-service: logs with X-Request-ID
  -> disease-rice-service: logs with X-Request-ID
  -> agent-orchestrator: logs with X-Request-ID
  -> advisory-service: logs with X-Request-ID
  -> response returns with X-Request-ID in headers
```

Implementation:
1. Add `X-Request-ID` middleware to `api-gateway`
2. Forward the header to all downstream services
3. Include the ID in all log statements
4. Return the ID in response headers for debugging

---

## SECTION 8 -- RATING SCORECARD 2.0

### Modularity: 4/10

**Strengths**: Clean service boundaries; each service has its own `AGENTS.md`; feature-based frontend decomposition.

**Weaknesses**: Shared packages are unused; 3 incompatible role enums; Python schemas are siloed; LangGraph has 2 of 5 documented nodes; RAG and advisory are disconnected.

### Deployability: 2/10

**Strengths**: Docker Compose works for local dev; health endpoints exist on all services.

**Weaknesses**: CI is in wrong directory; K8s covers 1/14 services; no staging environment; no Docker resource limits; no `.env.example`; Terraform is a stub; no Helm charts; no container registry pipeline.

### Developer Experience (DX): 3/10

**Strengths**: Good `AGENTS.md` files for AI-assisted development; clear monorepo structure; reasonable `turbo.json` setup.

**Weaknesses**: Zero READMEs for packages/services; no CONTRIBUTING.md; no `.env.example`; CI doesn't run; Turbo caching incomplete; shared packages not wired up; new hire onboarding time: hours, not minutes.

### Overall Structural Integrity: 4.5/10

The platform is a **high-fidelity prototype** with excellent UI/UX design but prototype-grade infrastructure. The Phase 1 QA audit's 9.6/10 claim was significantly overclaimed -- the audit verified that code exists but did not verify that it works correctly, connects properly, or scales beyond a single developer's machine.

---

## SECTION 9 -- PRIORITY ACTION PLAN

### Immediate (This Sprint) -- Stop the Bleeding

1. **SEC-01/SEC-04**: Remove all hardcoded secret fallbacks. Fail fast at boot. (**PARTIALLY DONE** — service-role keys secured, fallbacks removed from client files)
2. **SEC-02**: Implement real JWT validation in auth-service against Supabase.
3. **SEC-03**: Add `verify_internal_token` to all 5 disease services.
4. **M-01**: Move `github-actions.yml` to `.github/workflows/`. (**DONE** — moved and updated with lint, type-check, build, and test steps)
5. **DEBT-09**: Add Docker resource limits to all containers.

### Short-Term (Next 2 Sprints) -- Build the Foundation

6. **DEBT-02**: Deploy PgBouncer and configure connection pooling.
7. **DEBT-10**: Expand CI to test all 14 services and run frontend tests. (**PARTIALLY DONE** — monorepo build/lint/type-check & frontend test pipelines configured)
8. **T-01**: Unify role enums to a single definition. (**DONE** — unified to lowercase enums across all schemas, auth, and types packages)
9. **M-03**: Wire up shared packages -- make apps actually import from `@agri-packages/ui`.
10. **A-02**: Replace RAG mock with real Qdrant integration.

### Medium-Term (Next Quarter) -- Scale for Production

11. **DEBT-01**: Implement circuit breaker and retry logic in API gateway.
12. **DEBT-03**: Implement Redis caching layer.
13. **DEBT-04**: Move YOLO inference to async task queue.
14. **DEBT-12**: Create K8s manifests for all 14 services.
15. **DEBT-13**: Implement proper Prometheus metrics and Grafana dashboards.

---

*Audit conducted by Principal SRE & Lead Software Architect | Phase 2 Deep-Tissue Analysis*
*This report is independent of the Phase 1 QA audit and represents a structural, not functional, assessment.*
