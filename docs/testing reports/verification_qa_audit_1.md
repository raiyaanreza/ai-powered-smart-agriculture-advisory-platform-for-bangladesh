# 🔍 AgriVision AI — Master QA Verification & Testing Protocol (Audit-1)
**Auditor/Senior Developer**: Senior QA Architect & Lead Full Stack Developer  
**Target Audience**: Professional QA Engineering Team & Software Testers  
**Status**: Ready for Execution  

---

## 📋 Executive Overview

This master verification plan outlines the step-by-step testing workflows required to guarantee that the **AgriVision AI Platform** (a government-scale agricultural operating system for Bangladesh) is 100% production-ready. 

The junior development team has executed a series of bug fixes and architectural enhancements spanning the React frontends, FastAPI microservices, shared packages, and build pipelines. The purpose of this audit is to provide professional QA testers with a **flawless, highly granular checklist** to verify every page, route, API contract, security control, and database relationship.

### System Topology & Ports Reference
Before running tests, ensure all local infrastructure and microservices are mapped according to the [system ports schema](file:///e:/agri-ai-platform/DECISIONS.md):

| Service / App | Port | Context / Base URL | Purpose |
|---|---|---|---|
| **api-gateway** | `8000` | `http://localhost:8000` | Asynchronous reverse-proxy gateway |
| **advisory-service** | `8001` | `http://localhost:8001` | Gemini LLM expert advisory chat & OCR analysis |
| **crop-routing-service** | `8002` | `http://localhost:8002` | Primary YOLO-based crop classifier |
| **agent-orchestrator** | `8003` | `http://localhost:8003` | LangGraph workflow controller & telemetry aggregator |
| **auth-service** | `8004` | `http://localhost:8004` | JWT processing & RBAC rule validator |
| **notification-service** | `8005` | `http://localhost:8005` | Warning bulletin & SMS alert gateway interface |
| **analytics-service** | `8006` | `http://localhost:8006` | Regional diagnostic & crop outbreak database |
| **report-service** | `8007` | `http://localhost:8007` | Celery-based async PDF document exporter |
| **rag-service** | `8008` | `http://localhost:8008` | Qdrant vector-search handbook indexing |
| **disease-rice-service** | `8010` | `http://localhost:8010` | Rice-specific disease YOLO classifier |
| **disease-brassica-service** | `8011` | `http://localhost:8011` | Brassica/Mustard-specific YOLO classifier |
| **disease-corn-service** | `8012` | `http://localhost:8012` | Corn/Maize-specific YOLO classifier |
| **disease-potato-service** | `8013` | `http://localhost:8013` | Potato-specific YOLO classifier |
| **disease-wheat-service** | `8014` | `http://localhost:8014` | Wheat-specific YOLO classifier |
| **apps/web** | `3000` | `http://localhost:3000` | Public / Farmer Portal (Next.js 16) |
| **apps/admin** | `3001` | `http://localhost:3001` | Government Command Center (Next.js 16) |

---

## 🛠️ PHASE 1: Build Pipeline & Environment Readiness
Verify the fundamental workspace settings and monorepo configurations to prevent compilation drift.

- [ ] **1.1 Workspace Dependency Constraints Check**
  - Verify that Node.js version is `&ge;22.0.0` and pnpm version is `&ge;10.0.0` by running:
    ```bash
    node --version
    pnpm --version
    ```
  - Open [pnpm-workspace.yaml](file:///e:/agri-ai-platform/pnpm-workspace.yaml) and ensure the workspaces configuration contains:
    ```yaml
    packages:
      - "apps/*"
      - "services/*"
      - "packages/*"
    ```
- [x] **1.2 Clean Monorepo Compilation** (Verified clean compile on 2026-05-19)
  - Execute a clean build across all shared packages and apps:
    ```bash
    pnpm run build
    ```
  - Ensure that the console logs zero errors and finishes with `Exit code 0`.
- [ ] **1.3 Turborepo Pipeline Orchestration**
  - Open [turbo.json](file:///e:/agri-ai-platform/turbo.json) and confirm that the global `test` task is mapped:
    ```json
    "tasks": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": [".next/**", "dist/**"]
      },
      "test": {
        "dependsOn": ["^build"]
      }
    }
    ```
- [ ] **1.4 Environment Configuration Security Audit**
  - Confirm that `.env` templates exist inside the root directory, `apps/web/`, `apps/admin/`, and each directory in `services/`.
  - Validate that `.gitignore` successfully excludes local `.env` and `.env.local` files to avoid tracking active development secrets.

---

## 🌾 PHASE 2: Farmer Portal (`apps/web`) Page-by-Page E2E Checks
Ensure the farmer-facing web application compiles cleanly and executes all interactive flows.

### 2.1 Landing Page (`/`) — Visual & Performance Elements
- [x] **2.1.1 Responsive Navigation Bar** (Verified functional on 2026-05-19)
  - Verify the sticky header behaves correctly on scroll (adds background blur and shadow).
  - Verify navigation links redirect smoothly to `/diagnose`, `/advisory`, `/library`, and `/farmer`.
- [x] **2.1.2 Hero Section & Static Analytics** (Verified functional on 2026-05-19)
  - Verify that the animated numbers (e.g. "98.2% Accuracy", "120K+ Farmers Served") execute spring-physics entry effects.
- [x] **2.1.3 "Trusted By" Brand Marquee** (Verified functional on 2026-05-19)
  - Check that the logotype carousel flows smoothly, without stuttering or breaking layout on screen widths from `320px` to `1920px`.
- [ ] **2.1.4 Pipeline Animation Sequence**
  - Perform slow scroll through the "How It Works" pipeline section.
  - Verify the visual SVG paths draw and animate dynamically based on scroll offsets (`useScroll` hooks).
- [ ] **2.1.5 CTA Banners & Dynamic Binders**
  - Click "Start Diagnosis" and confirm correct routing to `/diagnose`.
  - Click "Consult AgriBot" and confirm correct routing to `/advisory`.

### 2.2 Crop Diagnosis Portal (`/diagnose`) — Interactive Flow
- [ ] **2.2.1 Drag-and-Drop Image Uploader**
  - Attempt to drag a non-image file (e.g. `report.pdf`) into the dropzone. Ensure the UI throws a validation error and blocks the upload.
  - Attempt to drop an image larger than `10MB`. Ensure size limits are enforced.
  - Drag and drop a compliant `.jpg` or `.png` leaf image. Verify the file preview displays immediately.
- [ ] **2.2.2 Processing Telemetry Timeline**
  - Click "Analyze Crop".
  - Verify that the loading UI presents a multi-stage execution tracker:
    1. *Uploading image...*
    2. *Detecting crop type...*
    3. *Identifying pathology symptoms...*
    4. *Formulating expert recommendations...*
- [ ] **2.2.3 Diagnosis Result Card (`ResultDisplay`)**
  - Once the diagnosis completes, inspect the result card:
    - **Bilingual Display**: Check that the common name, scientific name, severity grade, and treatment protocols have both English and Bengali descriptions.
    - **Confidence Score Indicator**: Verify that the confidence rating shows a dynamic color-gradient badge (Green for High confidence, Amber for Medium, Red for Low).
- [ ] **2.2.4 Outbreak Geographic Map Widget**
  - Zoom in and pan the embedded Map component.
  - Verify that regional threat clusters render as pulsing indicators based on warning severity grades.

### 2.3 Advisory Chat Room (`/advisory`) — Multi-turn AI Conversations
- [x] **2.3.1 Advisory Sidebar Registry** (Verified functional on 2026-05-19)
  - Ensure that previous conversation history sessions display under a scrollable column.
  - Verify the "New Session" button spawns a clean conversation instance.
- [x] **2.3.2 Streamed Chat Dialog Interface** (Verified RAG streaming responses on 2026-05-19)
  - Enter a query: *"আমার ধান গাছের পাতা হলুদ হয়ে যাচ্ছে, কি করবো?"*
  - Verify the message is added instantly to the dialog with correct alignment (right for user, left for AI).
  - Verify that the advisory response streams dynamically with typing animations.
- [ ] **2.3.3 Crop Diagnostic Wizard Overlay**
  - Trigger the 3-step crop analysis questionnaire.
  - Complete the steps (Select Crop &rarr; Select Symptoms &rarr; Select Timeline).
  - Verify the response is injected directly into the chat and mapped to the AI pipeline.

### 2.4 Disease Encyclopedia (`/library`) — Search & Drill-Down
- [ ] **2.4.1 Categorized Grid Filters**
  - Toggle between crop selectors (Rice, Potato, Wheat, Corn, Brassica). Ensure the grid updates instantly.
  - Enter a query in the search bar (e.g., *"Blast"* or *"পচন"*). Verify matching cards are isolated.
- [ ] **2.4.2 Disease Detailed View Page**
  - Click a disease card (e.g., *Rice Blast*).
  - Inspect the detail structure: check if symptoms, causes, biological control, and chemical treatment tabs render correctly.

### 2.5 Farmer Personal Dashboard (`/farmer`) — Operational Ledger
- [x] **2.5.1 Diagnostic Stats & Weather Card** (Verified NDVI, water stress and weather stats on 2026-05-19)
  - Verify that the local weather widget pulls live weather indicators using the standard geolocation fallback.
- [x] **2.5.2 Diagnostics Ledger Table** (Verified history ledger lists on 2026-05-19)
  - Verify the diagnostic ledger loads past submissions chronologically.
  - Click a row in the ledger; check if the historical diagnostic report displays as a modal preview overlay.

---

## 🏛️ PHASE 3: Government Command Center (`apps/admin`) Functional Checks
Ensure the administrative portal secures critical paths and executes oversight tools correctly.

- [x] **3.1 Administrative Role-Gating & Access Control** (Verified admin credentials and role-gating checks on 2026-05-19)
  - Access `/admin` with a standard User session token (role: `farmer`).
  - Verify that the router intercepts the request, blocks rendering, and redirects to `/login` or throws an Unauthorized page.
  - Authenticate using an Administrator profile. Confirm successful entry to the Control Center dashboard.
- [x] **3.2 Telemetry & National Outbreak Map** (Verified live command center telemetry and GIS maps on 2026-05-19)
  - Verify the map loading status. Inspect console to confirm that Leaflet packages do not throw runtime bundle issues.
  - Verify that district outbreak metrics update based on high-severity warnings.
- [ ] **3.3 Farmer Verification Queue**
  - Navigate to the "Farmer Verification Queue" tab.
  - Click "Approve" on a pending farmer profile. Confirm that the card transitions out of the queue and triggers a Supabase DB profile status update.
  - Click "Reject". Verify the profile is removed from the active queue.
- [ ] **3.4 Warning Bulletin & SMS Broadcast Panel**
  - Navigate to the "National Bulletins" form.
  - Input details (Title: *"Wheat Rust Outbreak Alert"*, Region: *"Rajshahi"*, Severity: *"Critical"*).
  - Click "Broadcast Warning".
  - Verify the operation: check that the gateway forwards the payload to `notification-service` and returns a success notification.
- [ ] **3.5 System SQL Terminal & Telemetry Logs**
  - Access the SQL provisioning logs monitor view.
  - Ensure system stats (API latency, active DB pools) are populated from `/metrics` streams.

---

## 📦 PHASE 4: Shared Packages Integration Checklist
Verify that shared modules in [packages/](file:///e:/agri-ai-platform/packages) behave as structural sources of truth.

- [ ] **4.1 `@agri-packages/ui` — Shared Design System Components**
  - Verify that shared elements: `Card` ([Card.tsx](file:///e:/agri-ai-platform/packages/ui/src/components/Card.tsx)), `Input` ([Input.tsx](file:///e:/agri-ai-platform/packages/ui/src/components/Input.tsx)), `Modal` ([Modal.tsx](file:///e:/agri-ai-platform/packages/ui/src/components/Modal.tsx)), and `Badge` ([Badge.tsx](file:///e:/agri-ai-platform/packages/ui/src/components/Badge.tsx)) are strictly used in frontends.
  - Verify that font-family classes resolve correctly under standard layouts without compiling errors.
- [ ] **4.2 `@agri-packages/schemas` — Centralized Zod Validation**
  - Open [schemas/index.ts](file:///e:/agri-ai-platform/packages/schemas/src/index.ts) and verify Zod constraints exist for:
    - `DiagnosisSchema` (validation bounds for crop, severity, confidence, image url).
    - `NotificationSchema` (validation parameters for bulletins and SMS details).
    - `ProfileSchema` (validation layout for role structures).
- [x] **4.3 `@agri-packages/types` — TypeScript Types Parity** (Unified UserRole lowercase type system on 2026-05-19)
  - Verify interfaces defined in [types/index.ts](file:///e:/agri-ai-platform/packages/types/src/index.ts):
    ```typescript
    export interface Disease { ... }
    export interface Notification { ... }
    export interface FarmerProfile { ... }
    ```
  - Double check that there are no TS compiler mismatches between backend schema shapes and these types.
- [ ] **4.4 `@agri-packages/prompts` — Centralized AI Prompts**
  - Open [prompts/advisory.py](file:///e:/agri-ai-platform/packages/prompts/advisory.py) and confirm model naming uses:
    ```python
    GEMINI_31_FLASH_LITE_MODEL = "gemini-3.1-flash-lite"
    ```
  - Ensure the `ADVISORY_SYSTEM_PROMPT` is cleanly exposed and does not contain hardcoded frontend code.

---

## ⚡ PHASE 5: Backend Microservices API Validation
Ensure all 14 FastAPI backend microservices comply with the routing specs and return valid payloads.

### 5.1 API Gateway Reverse Proxy (`api-gateway`) — Port 8000
- [ ] **5.1.1 Gateway Routing Handshake**
  - Send an HTTP request: `GET http://localhost:8000/` and `GET http://localhost:8000/health`.
  - Confirm the response body: `{"status": "healthy", "service": "api-gateway"}`.
- [ ] **5.1.2 Reverse Proxy Sub-route Forwarding**
  - Trigger routes through the gateway and trace proxy headers:
    - `GET http://localhost:8000/api/v1/advisory/health` &rarr; proxies to port `8001`
    - `GET http://localhost:8000/api/v1/agent/health` &rarr; proxies to port `8003`
    - `GET http://localhost:8000/api/v1/crop-router/health` &rarr; proxies to port `8002`

### 5.2 Crop-Specific & Routing Classifier YOLO Services — Ports 8002 & 8010–8014
- [ ] **5.2.1 Primary Crop Router classifier (`crop-routing-service`)**
  - Upload a wheat leaf image to `POST http://localhost:8002/classify`.
  - Confirm output JSON format:
    ```json
    {
      "crop": "wheat",
      "confidence": 0.94,
      "bounding_boxes": [...]
    }
    ```
- [ ] **5.2.2 Rice Disease Classifier (`disease-rice-service`)**
  - Call `POST http://localhost:8010/predict` with a rice leaf image.
  - Confirm JSON output details specific rice diseases (e.g. *Rice Blast*, *Brown Spot*, *Healthy*).
- [ ] **5.2.3 Brassica Disease Classifier (`disease-brassica-service`)**
  - Call `POST http://localhost:8011/predict`. Confirm prediction payload structure.
- [ ] **5.2.4 Corn Disease Classifier (`disease-corn-service`)**
  - Call `POST http://localhost:8012/predict`. Verify output coordinates.
- [ ] **5.2.5 Potato Disease Classifier (`disease-potato-service`)**
  - Call `POST http://localhost:8013/predict`. Ensure classes map to Early/Late Blight.
- [ ] **5.2.6 Wheat Disease Classifier (`disease-wheat-service`)**
  - Call `POST http://localhost:8014/predict`. Ensure classes map to Leaf Rust.

### 5.3 LangGraph State Machine Orchestrator (`agent-orchestrator`) — Port 8003
- [ ] **5.3.1 Diagnostic State Flow Execution**
  - Call the main diagnostic pipeline: `POST http://localhost:8003/agent/diagnose` with a multipart leaf image upload.
  - Trace node traversal logs in terminal output:
    1. `crop_classification_node` &rarr; invokes `crop-routing-service` (Port 8002).
    2. `disease_detection_node` &rarr; invokes specific crop service (e.g. Port 8010).
    3. `advisory_generation_node` &rarr; invokes `advisory-service` (Port 8001).
  - Verify returned response maps to the centralized Pydantic output.
- [ ] **5.3.2 Dynamic Telemetry metrics store**
  - Call `GET http://localhost:8003/metrics`.
  - Ensure that the JSON output compiles performance latency stats and active error flags.

### 5.4 Auxiliary Microservices — Ports 8004–8008
- [ ] **5.4.1 Authentication Service (`auth-service`) — Port 8004**
  - Call `POST http://localhost:8004/auth/validate` with valid token headers.
  - Confirm correct RBAC role profile parameters are decoded and returned.
- [ ] **5.4.2 Notification Service (`notification-service`) — Port 8005**
  - Call `POST http://localhost:8005/notifications/broadcast` with a alert bulletin schema.
  - Confirm the mock SMS interface prints triggers to system output correctly.
- [ ] **5.4.3 Regional Analytics Service (`analytics-service`) — Port 8006**
  - Call `GET http://localhost:8006/analytics/outbreaks`. Confirm JSON schema matches.
- [ ] **5.4.4 PDF Report Service (`report-service`) — Port 8007**
  - Call `POST http://localhost:8007/reports/generate` with sample report details.
  - Check that a background Celery task UUID is generated and returned immediately.
- [ ] **5.4.5 RAG Search Service (`rag-service`) — Port 8008**
  - Call `POST http://localhost:8008/rag/query` with text *"ধানের ব্লাস্ট রোগ প্রতিরোধের উপায় কি?"*.
  - Confirm the vector-embedding fallback returns context handbook matching blocks.

---

## 🔒 PHASE 6: Security, Vulnerability & Hardening Checks
Conduct target checks to guarantee zero compliance or security leaks.

- [x] **6.1 Zero Hardcoded Secrets Isolation Check** (Hardened Supabase clients and removed auth backdoor on 2026-05-19)
  - Search all backend files and verify that no fallback strings exist for token secrets:
    - Search for: `"super-secret-internal-key-2026"` &rarr; Must return **0 active code matches** (should use `os.environ["INTERNAL_SHARED_SECRET"]` instead).
    - Search for: `"AgriVision@2026!"` &rarr; Must return **0 active code matches** (should verify token credentials against dynamic hashing parameters instead).
- [x] **6.2 Gatekeeper Authorization Header Checks** (Secured auth-service tests and apps/admin API routes on 2026-05-19)
  - Try to send an HTTP request directly to a downstream service: `GET http://localhost:8001/advisory/health` or `GET http://localhost:8003/agent/health` **without** including the `X-Internal-Token` header.
  - Verify that the FastAPI router intercepts the request and throws a `401 Unauthorized` or `403 Forbidden` response.
- [ ] **6.3 Path Traversal File Security Tests**
  - Call the image upload endpoint `POST http://localhost:8003/agent/diagnose` with a filename set to `../../../../etc/passwd`.
  - Confirm the backend sanitizes the filename using safe filename wrappers (e.g. `secure_filename`) and does not write files outside of the temporary cache directory.
- [ ] **6.4 CORS Policy Domain Audits**
  - Trigger requests from an unauthorized origin (e.g. `http://malicious-domain.com`).
  - Verify that CORS origins are restricted to `ALLOWED_ORIGINS` and block cross-domain requests.

---

## 🗄️ PHASE 7: Infrastructure, Databases & Weights Verification
Validate connection scopes and data bindings.

- [ ] **7.1 PostgreSQL Database Parity**
  - Run the schema initialization script:
    ```bash
    psql -U agri_user -d agridb -f scripts/schema.sql
    ```
  - Confirm that the tables: `profiles`, `diagnoses`, `advisory_sessions`, `messages`, `notifications`, and `outbreaks` are successfully provisioned with correct keys and index scopes.
- [ ] **7.2 Redis & Background Celery Worker Telemetry**
  - Verify that the Redis instance is running by sending a ping check.
  - Run a mock PDF task through [celery_app.py](file:///e:/agri-ai-platform/packages/utils/celery_app.py). Ensure the worker retrieves the request, processes the background task, and flags status updates inside the task cache.
- [ ] **7.3 Qdrant Vector Collection Integrity**
  - Query Qdrant instance health check endpoints. Confirm collection status for the primary crop handbook embeddings collection is active.
- [ ] **7.4 AI Model Weights Verification (DVC Maps)**
  - Confirm that the active weights (`best.pt`) are correctly registered and present in:
    - [models/crop-classifier/best.pt](file:///e:/agri-ai-platform/models/crop-classifier/best.pt)
    - [models/rice-disease/best.pt](file:///e:/agri-ai-platform/models/rice-disease/best.pt)
    - [models/brassica-disease/best.pt](file:///e:/agri-ai-platform/models/brassica-disease/best.pt)
    - [models/corn-disease/best.pt](file:///e:/agri-ai-platform/models/corn-disease/best.pt)
    - [models/potato-disease/best.pt](file:///e:/agri-ai-platform/models/potato-disease/best.pt)
    - [models/wheat-disease/best.pt](file:///e:/agri-ai-platform/models/wheat-disease/best.pt)
  - Verify model weight tracking pipelines by executing:
    ```bash
    dvc status
    ```

---

## 🧪 PHASE 8: Automated Test Suites Execution
Run automated check scripts across the entire platform.

- [x] **8.1 Frontend Vitest Suite Run** (Verified all 3 tests passing on 2026-05-19)
  - Run tests for `apps/web`:
    ```bash
    pnpm --filter apps/web test
    ```
  - Run tests for `apps/admin`:
    ```bash
    pnpm --filter apps/admin test
    ```
  - Confirm that unit tests for Auth components, layout bindings, and helper utility libraries pass cleanly.
- [x] **8.2 Backend Pytest Suite Run** (Verified all mock service tests passing on 2026-05-19)
  - Navigate to each active backend directory and run:
    ```bash
    pytest
    ```
  - Verify that mock suites for the `advisory-service`, `api-gateway`, and internal YOLO classifier helpers report 100% success scores.

---

### 📝 Tester Handoff Notes & Execution Feedback
*Testers should use the section below to log any errors, tracebacks, or design discrepancies observed during the execution of this protocol.*

```text
--------------------------------------------------------------------------------
QA Tester Name: _______________________    Execution Date: _____________________
Overall Build Status: [  ] PASS  [  ] FAIL
Overall Security Rating: [  ] SECURE  [  ] VULNERABILITIES DETECTED

Observed Issues & Logs:
1. 
2. 
3. 
--------------------------------------------------------------------------------
```
