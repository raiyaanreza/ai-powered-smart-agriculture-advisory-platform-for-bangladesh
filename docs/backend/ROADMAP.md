# Backend Roadmap & Database Architecture

# AI Agriculture Advisory Platform

## 1. Purpose of This Document

This document defines:

* backend implementation roadmap,
* infrastructure setup order,
* API integrations,
* Supabase architecture,
* PostGIS setup,
* AI service integration,
* database schema planning,
* role-based backend design,
* agentic workflow backend planning,
* deployment-ready backend foundations.

This is the MASTER backend implementation guide.

---

# 2. Core Backend Philosophy

The backend must be:

* modular,
* service-oriented,
* AI-native,
* scalable,
* async-first,
* observable,
* deployment-ready,
* government-grade.

The system should support:

* millions of diagnoses,
* map analytics,
* AI orchestration,
* future mobile apps,
* RAG systems,
* expert review pipelines,
* government analytics.

---

# 3. Recommended Final Backend Stack

# Core Backend

| Layer            | Technology                    |
| ---------------- | ----------------------------- |
| Main Backend     | FastAPI                       |
| API Validation   | Pydantic v2                   |
| ORM              | SQLAlchemy 2                  |
| Database         | Supabase PostgreSQL           |
| GIS Extension    | PostGIS                       |
| Authentication   | Supabase Auth                 |
| Object Storage   | Supabase Storage              |
| Realtime         | Supabase Realtime             |
| Queue System     | Redis + Celery                |
| AI Orchestration | LangGraph                     |
| LLM Framework    | LangChain                     |
| Vector Database  | Qdrant                        |
| AI Embeddings    | Gemini Embeddings             |
| Monitoring       | OpenTelemetry                 |
| Logging          | Loki + Grafana                |
| Containerization | Docker                        |
| Reverse Proxy    | Traefik                       |
| CI/CD            | GitHub Actions                |
| Infra Deployment | Railway / Hetzner / AWS later |

---

# 4. APIs & External Services You Should Use

---

# REQUIRED APIs

# A. Gemini API

## Use For

* conversational AI
* agriculture advisory
* RAG reasoning
* multilingual generation
* AI summarization
* expert explanation
* seasonal planning

## Setup Manually

DO THIS YOURSELF.

Do NOT let agents do this.

### Required:

* Google AI Studio account
* Gemini API key
* billing enabled

## Recommended Models

| Purpose        | Model              |
| -------------- | ------------------ |
| Fast inference | Gemini 2.5 Flash   |
| Reasoning      | Gemini 2.5 Pro     |
| Embeddings     | text-embedding-004 |

---

# B. Supabase

## Use For

* PostgreSQL
* Auth
* Storage
* Realtime
* Row-level security

## Setup Manually

Create:

* Supabase project
* storage buckets
* auth providers
* environment variables

---

# C. Qdrant

## Use For

* vector search
* RAG retrieval
* semantic article search
* AI memory retrieval

## Setup Options

Initially:

* local docker deployment

Later:

* managed cloud Qdrant

---

# D. Weather API

Recommended:

* OpenWeatherMap
* Tomorrow.io

## Use For

* rainfall prediction
* humidity alerts
* disease forecasting

---

# E. Map Tile Services

Recommended:

* Mapbox
* OpenStreetMap

## Use For

* outbreak visualization
* GIS overlays
* farm mapping

---

# 5. What You MUST Setup Manually

DO NOT waste agent tokens.

---

# Setup Yourself

---

## Infrastructure

* Supabase project
* Redis container
* Qdrant container
* Docker setup
* Traefik setup
* domain setup
* SSL setup
* GitHub secrets

---

## Package Installations

Do manually:

```bash
pnpm install
pip install
```

---

## Environment Variables

Create:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
REDIS_URL=
QDRANT_URL=
GEMINI_API_KEY=
OPENWEATHER_API_KEY=
MAPBOX_API_KEY=
```

---

## Docker Compose

Create manually.

Include:

* FastAPI
* Redis
* Qdrant
* Celery worker
* Celery beat
* Traefik

---

# 6. Backend Development Roadmap

This is the MOST IMPORTANT section.

DO NOT randomly build backend features.

Follow this order.

---

# PHASE 1 — Backend Foundations

Goal:
Core infrastructure.

---

# Step 1 — Setup Monorepo Backend Structure

Create:

```text
services/
├── api-gateway/
├── auth-service/
├── diagnosis-service/
├── advisory-service/
├── rag-service/
├── analytics-service/
├── notification-service/
├── map-service/
├── agent-orchestrator/
└── shared/
```

---

# Step 2 — Setup FastAPI Base

Implement:

* health routes
* middleware
* config loader
* logging
* exception handlers
* OpenAPI docs

---

# Step 3 — Setup Supabase Connection

Implement:

* SQLAlchemy
* Alembic migrations
* async sessions
* DB health checks

---

# Step 4 — Setup Auth

Use:

* Supabase Auth
* JWT validation middleware
* role-based access control

Roles:

* guest
* farmer
* expert
* admin
* super_admin

---

# Step 5 — Setup Shared Backend Libraries

Create:

```text
services/shared/
├── database/
├── auth/
├── logging/
├── config/
├── ai/
├── queue/
├── storage/
└── telemetry/
```

---

# PHASE 2 — Core Diagnosis Backend

Goal:
AI diagnosis pipeline.

---

# Step 6 — Image Upload Pipeline

Implement:

* upload validation
* image compression
* object storage upload
* metadata extraction

Use:

* Supabase Storage

---

# Step 7 — Crop Detection Service

Implement:

* crop classification
* crop group routing

Pipeline:

```text
Upload
→ crop classifier
→ model router
→ disease model
```

---

# Step 8 — Disease Inference Pipeline

Implement:

* async inference
* confidence scoring
* severity scoring
* explainability generation

---

# Step 9 — Diagnosis Persistence

Store:

* image metadata
* crop type
* prediction
* confidence
* AI advisory
* severity

---

# PHASE 3 — AI Advisory System

Goal:
Conversational agriculture intelligence.

---

# Step 10 — Setup Gemini Wrapper Layer

Create:

```text
services/shared/ai/
```

Implement:

* Gemini clients
* retry handling
* token tracking
* prompt registry
* response validation

---

# Step 11 — Setup RAG System

Implement:

* embeddings pipeline
* document chunking
* vector indexing
* retrieval pipeline

Sources:

* agriculture PDFs
* government documents
* expert articles
* FAO guidelines

Store embeddings in:

* Qdrant

---

# Step 12 — Advisory Generation Pipeline

Pipeline:

```text
Diagnosis
→ retrieve agriculture context
→ inject region/weather context
→ Gemini generation
→ safety validation
→ multilingual formatting
```

---

# Step 13 — LangGraph Agent Workflows

Implement:

* workflow orchestration
* tool execution
* retry flows
* escalation logic

Agents:

* diagnosis agent
* advisory agent
* weather agent
* regional intelligence agent
* expert escalation agent

---

# PHASE 4 — GIS & Analytics System

Goal:
Regional agriculture intelligence.

---

# Step 14 — Setup PostGIS

Enable extension:

```sql
CREATE EXTENSION postgis;
```

---

# Step 15 — Regional Geometry Tables

Store:

* districts
* divisions
* farms
* outbreak regions
* crop density regions

---

# Step 16 — GIS APIs

Implement:

* outbreak heatmaps
* regional filtering
* disease clustering
* temporal outbreak queries

---

# Step 17 — Weather Integration

Store:

* rainfall
* humidity
* temperature
* flood alerts

Use for:

* disease forecasting
* advisory intelligence

---

# PHASE 5 — Expert & Government Systems

Goal:
Moderation + analytics.

---

# Step 18 — Expert Review System

Implement:

* low-confidence queue
* escalation routing
* expert corrections

---

# Step 19 — Admin Analytics APIs

Implement:

* disease statistics
* user analytics
* AI metrics
* regional outbreaks

---

# Step 20 — Notification System

Implement:

* push notifications
* email alerts
* outbreak broadcasts
* advisory reminders

---

# PHASE 6 — Production Readiness

Goal:
Scalable deployment.

---

# Step 21 — Observability

Implement:

* tracing
* metrics
* centralized logging
* error tracking

---

# Step 22 — Security Hardening

Implement:

* rate limiting
* abuse protection
* signed uploads
* RBAC enforcement
* audit logs

---

# Step 23 — CI/CD

Implement:

* automated tests
* migrations
* docker builds
* deployment workflows

---

# 7. Recommended Backend Folder Structure

```text
services/
├── api-gateway/
├── auth-service/
├── diagnosis-service/
├── advisory-service/
├── rag-service/
├── analytics-service/
├── map-service/
├── notification-service/
├── expert-review-service/
├── agent-orchestrator/
└── shared/
```

---

# 8. Database Architecture Overview

Use:

* Supabase PostgreSQL
* PostGIS
* Row-Level Security

Architecture:

```text
Transactional Data → PostgreSQL
GIS Data → PostGIS
Vector Data → Qdrant
Images → Supabase Storage
Realtime Events → Supabase Realtime
```

---

# 9. Core Database Domains

```text
users
roles
farms
crops
diagnoses
diagnosis_images
diseases
advisories
alerts
weather_data
outbreaks
articles
expert_reviews
ai_logs
agent_runs
notifications
```

---

# 10. Authentication Schema

# users

| Field              | Type        |
| ------------------ | ----------- |
| id                 | uuid        |
| email              | text        |
| full_name          | text        |
| phone              | text        |
| role               | enum        |
| preferred_language | text        |
| district           | text        |
| created_at         | timestamptz |

---

# roles

| Field       | Type  |
| ----------- | ----- |
| id          | uuid  |
| role_name   | text  |
| permissions | jsonb |

---

# 11. Farmer Database Schemas

---

# farms

| Field      | Type                  |
| ---------- | --------------------- |
| id         | uuid                  |
| user_id    | uuid                  |
| farm_name  | text                  |
| district   | text                  |
| upazila    | text                  |
| location   | geography(Point,4326) |
| total_area | numeric               |
| created_at | timestamptz           |

---

# crops

| Field            | Type        |
| ---------------- | ----------- |
| id               | uuid        |
| farm_id          | uuid        |
| crop_name        | text        |
| crop_group       | text        |
| planting_date    | date        |
| growth_stage     | text        |
| expected_harvest | date        |
| created_at       | timestamptz |

---

# diagnoses

| Field            | Type        |
| ---------------- | ----------- |
| id               | uuid        |
| user_id          | uuid        |
| crop_id          | uuid        |
| disease_id       | uuid        |
| confidence_score | numeric     |
| severity_score   | numeric     |
| ai_summary       | text        |
| expert_verified  | boolean     |
| created_at       | timestamptz |

---

# diagnosis_images

| Field               | Type        |
| ------------------- | ----------- |
| id                  | uuid        |
| diagnosis_id        | uuid        |
| image_url           | text        |
| annotated_image_url | text        |
| image_metadata      | jsonb       |
| uploaded_at         | timestamptz |

---

# advisories

| Field                     | Type        |
| ------------------------- | ----------- |
| id                        | uuid        |
| diagnosis_id              | uuid        |
| generated_by              | text        |
| advisory_text             | text        |
| prevention_text           | text        |
| fertilizer_recommendation | text        |
| irrigation_recommendation | text        |
| created_at                | timestamptz |

---

# alerts

| Field       | Type        |
| ----------- | ----------- |
| id          | uuid        |
| user_id     | uuid        |
| alert_type  | text        |
| title       | text        |
| message     | text        |
| severity    | text        |
| read_status | boolean     |
| created_at  | timestamptz |

---

# 12. Expert Database Schemas

---

# expert_profiles

| Field               | Type        |
| ------------------- | ----------- |
| id                  | uuid        |
| user_id             | uuid        |
| institution         | text        |
| specialization      | text        |
| verification_status | text        |
| created_at          | timestamptz |

---

# expert_reviews

| Field             | Type        |
| ----------------- | ----------- |
| id                | uuid        |
| diagnosis_id      | uuid        |
| expert_id         | uuid        |
| corrected_disease | text        |
| expert_notes      | text        |
| approved          | boolean     |
| reviewed_at       | timestamptz |

---

# knowledge_articles

| Field      | Type        |
| ---------- | ----------- |
| id         | uuid        |
| author_id  | uuid        |
| title      | text        |
| slug       | text        |
| content    | text        |
| tags       | text[]      |
| published  | boolean     |
| created_at | timestamptz |

---

# 13. Admin & Government Database Schemas

---

# outbreaks

| Field          | Type                        |
| -------------- | --------------------------- |
| id             | uuid                        |
| disease_id     | uuid                        |
| district       | text                        |
| geometry       | geometry(MultiPolygon,4326) |
| severity_level | text                        |
| active_cases   | integer                     |
| created_at     | timestamptz                 |

---

# regional_analytics

| Field           | Type        |
| --------------- | ----------- |
| id              | uuid        |
| district        | text        |
| crop_name       | text        |
| diagnosis_count | integer     |
| outbreak_risk   | numeric     |
| generated_at    | timestamptz |

---

# ai_logs

| Field       | Type        |
| ----------- | ----------- |
| id          | uuid        |
| user_id     | uuid        |
| model_name  | text        |
| tokens_used | integer     |
| latency_ms  | integer     |
| prompt_hash | text        |
| created_at  | timestamptz |

---

# agent_runs

| Field           | Type        |
| --------------- | ----------- |
| id              | uuid        |
| workflow_name   | text        |
| status          | text        |
| execution_trace | jsonb       |
| started_at      | timestamptz |
| completed_at    | timestamptz |

---

# audit_logs

| Field         | Type        |
| ------------- | ----------- |
| id            | uuid        |
| actor_id      | uuid        |
| action        | text        |
| resource_type | text        |
| resource_id   | uuid        |
| metadata      | jsonb       |
| created_at    | timestamptz |

---

# 14. GIS Database Design

# Recommended GIS Tables

---

# districts

Store:

* district polygons
* division references
* crop density metadata

---

# farms

Use:

```sql
geography(Point,4326)
```

for accurate location queries.

---

# outbreaks

Use:

```sql
geometry(MultiPolygon,4326)
```

for outbreak visualization.

---

# GIS Features You Can Build

* outbreak heatmaps
* nearby outbreak detection
* farm clustering
* disease density analytics
* weather overlays
* flood overlays
* district risk prediction

---

# 15. Recommended Supabase Storage Buckets

# Buckets

| Bucket           | Purpose              |
| ---------------- | -------------------- |
| diagnosis-images | uploaded crop images |
| annotated-images | AI processed images  |
| article-assets   | educational media    |
| user-avatars     | profiles             |
| reports          | generated PDFs       |

---

# 16. Recommended Queue Architecture

Use:

* Redis
* Celery

---

# Async Jobs

---

## AI inference

---

## image preprocessing

---

## weather sync

---

## outbreak aggregation

---

## notification delivery

---

## scheduled summaries

---

# 17. Recommended Agentic Architecture

Use:

* LangGraph
* LangChain tools

---

# Main AI Agents

---

# Diagnosis Agent

Responsibilities:

* diagnosis orchestration
* severity analysis
* explainability

---

# Advisory Agent

Responsibilities:

* treatment generation
* fertilizer suggestions
* irrigation planning

---

# Weather Agent

Responsibilities:

* weather risk analysis
* rainfall prediction context

---

# Regional Intelligence Agent

Responsibilities:

* outbreak analysis
* district risk scoring

---

# Expert Escalation Agent

Responsibilities:

* detect uncertain outputs
* route to experts

---

# 18. Security Recommendations

---

# Use Row Level Security (RLS)

VERY IMPORTANT.

Implement:

* farmer-only access
* expert-only review access
* admin analytics access

---

# Store Minimal Sensitive Data

Avoid:

* unnecessary PII
* raw secrets

---

# Signed URLs

Use signed URLs for:

* diagnosis images
* reports

---

# Audit Everything

Track:

* expert overrides
* admin actions
* AI workflow executions

---

# 19. Recommended Initial MVP Scope

DO NOT build everything immediately.

---

# MVP Backend Features

Build first:

1. Auth
2. Image uploads
3. Crop classification
4. Disease diagnosis
5. AI advisory generation
6. Diagnosis history
7. Basic farmer dashboard
8. Simple GIS outbreak map
9. Basic admin analytics

ONLY after stable:

* expert workflows
* advanced RAG
* forecasting
* multi-agent orchestration

---

# 20. Final Backend Development Strategy

The correct backend strategy is:

```text
Infrastructure First
→ Authentication
→ Diagnosis Pipeline
→ AI Advisory
→ Persistence
→ GIS Analytics
→ Expert Systems
→ Government Systems
→ Production Hardening
```

NOT:

```text
Random feature implementation.
```

The backend should evolve as:

```text
AI Agriculture Intelligence Platform
```

with:

* modular services,
* scalable async pipelines,
* GIS intelligence,
* agentic orchestration,
* production-grade observability,
* and future-ready government infrastructure.
