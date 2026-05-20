# agents_manual.md

# AI Agriculture Advisory Platform — AI Agents Development Manual

## 1. Purpose of This Document

This document defines the operational workflow for using AI coding agents, human developers, and web LLMs efficiently while developing the AI Agriculture Advisory Platform.

This manual exists to:

* reduce token costs,
* improve development speed,
* maintain architecture integrity,
* avoid agent conflicts,
* preserve modularity,
* support parallel development,
* optimize vibe coding workflows,
* standardize engineering operations.

This document must be followed by:

* all AI coding agents,
* all engineers,
* all contributors,
* all future maintainers.

---

# 2. Core Philosophy of AI-Assisted Development

The repository is being built with:

* AI agents,
* multiple contributors,
* modular service architecture,
* incremental development.

Therefore:

> The repository must be optimized not only for humans, but also for AI agents.

Modern industry workflows increasingly use:

* AGENTS.md,
* scoped context files,
* monorepo modularity,
* narrow feature boundaries,
* worktree isolation,
* context engineering,
* execution contracts,
* agent-specific instructions. ([agents.md][1])

---

# 3. Golden Rules

---

# Rule 1 — Never Let Agents Work on Undefined Features

Before asking an agent to build something:

ALWAYS prepare:

* feature scope,
* workflows,
* UI references,
* expected APIs,
* folder ownership.

Bad:

```text
Build the dashboard.
```

Good:

```text
Build the Farmer Dashboard Recent Diagnosis widget.

Files allowed:
- apps/web/features/dashboard/
- packages/ui/

Do not modify:
- auth
- backend
- shared APIs
```

---

# Rule 2 — One Agent = One Scoped Task

Never allow:

* multiple agents touching same feature,
* multiple agents editing same files,
* broad repo-wide tasks.

Good:

```text
Agent A → diagnosis upload UI
Agent B → advisory result card
Agent C → admin analytics API
```

Bad:

```text
2 agents building dashboard together.
```

Industry multi-agent workflows strongly recommend isolated workspaces and scoped ownership to reduce context drift and merge conflicts. ([Reddit][2])

---

# Rule 3 — Humans Should Do Cheap Repetitive Setup

DO MANUALLY:

* package installations,
* environment setup,
* Docker installation,
* Node/Python version setup,
* Tailwind init,
* pnpm install,
* repo initialization,
* git branch setup,
* worktree creation.

Why:
Agents waste tokens on:

* reading docs,
* retrying installations,
* debugging environment mismatches.

Humans can do these faster and cheaper.

---

# Rule 4 — Use Web LLMs Before Coding Agents

Before implementation:

ALWAYS generate:

* UI planning,
* workflow planning,
* API contracts,
* feature PRDs,
* acceptance criteria,
* state management plans,
* component hierarchy.

using:

* ChatGPT,
* DeepSeek,
* Gemini,
* Claude web,
* Grok,
* or other free web LLMs.

Then feed the generated focused context to coding agents.

This massively reduces:

* token usage,
* exploration,
* wrong assumptions,
* architecture drift.

---

# Rule 5 — AI Agents Must NOT Explore Whole Repository

Never allow agents to:

* search entire monorepo unnecessarily,
* scan unrelated services,
* rewrite unrelated files.

Large-context exploration dramatically increases token cost and instability. ([arXiv][3])

Instead:

* provide exact folders,
* provide exact APIs,
* provide exact schemas,
* provide exact constraints.

---

# 4. Recommended AI Workflow Strategy

---

# Stage 1 — Human Planning

Human responsibilities:

* architecture decisions,
* feature planning,
* API planning,
* UX planning,
* modular boundaries,
* naming conventions.

Never outsource architecture thinking fully to coding agents.

---

# Stage 2 — Web LLM Planning

Use web LLMs for:

* feature specifications,
* page flow generation,
* UI section hierarchy,
* component decomposition,
* API contracts,
* prompt drafting,
* database planning,
* validation logic planning.

Example:

```text
Generate the exact feature specification for Farmer Diagnosis History page.
```

Output:

* save into docs/features/

Then coding agents implement from that spec.

---

# Stage 3 — Coding Agent Implementation

Only after:

* scope exists,
* docs exist,
* folder ownership exists.

Then:

* assign isolated implementation tasks.

---

# Stage 4 — Human Review

Human must verify:

* architecture consistency,
* naming,
* modularity,
* security,
* API integrity,
* UI consistency.

---

# 5. Recommended Repository Meta Files

These files are CRITICAL.

---

# Root-Level Files

```text
README.md
AGENTS.md
ARCHITECTURE.md
DESIGN_ARCHITECTURE.md
CURRENT_STATE.md
PROGRESS.md
DECISIONS.md
ROADMAP.md
```

---

# Why These Matter

Modern AI coding ecosystems increasingly use repository-level context files to guide agents. AGENTS.md is becoming the industry standard across AI coding tools. ([agents.md][1])

---

# 6. AGENTS.md Strategy

---

# 6.1 Root AGENTS.md

Purpose:

* global rules,
* stack conventions,
* forbidden patterns,
* build commands,
* repo-wide policies.

Keep it:

* short,
* high-signal,
* actionable.

Research shows bloated context files increase token usage and reduce success rates. ([arXiv][3])

---

# 6.2 Nested AGENTS.md

This is VERY IMPORTANT.

Modern monorepo agent workflows use hierarchical AGENTS.md files. ([agentmarketcap.ai][4])

Example:

```text
apps/web/AGENTS.md
services/agent-orchestrator/AGENTS.md
packages/ui/AGENTS.md
services/rag-service/AGENTS.md
```

Nearest AGENTS.md takes precedence.

This dramatically reduces:

* unnecessary repo traversal,
* context overload,
* token waste.

---

# 6.3 What Each AGENTS.md Should Contain

ONLY:

* local conventions,
* folder ownership,
* coding patterns,
* commands,
* forbidden modifications,
* naming rules,
* test commands.

NOT:

* business explanations,
* long tutorials,
* repeated documentation.

---

# 7. Recommended Additional AI Context Files

---

# CURRENT_STATE.md

Tracks:

* current work,
* unfinished tasks,
* blockers,
* active branches.

Critical for:

* session continuity,
* agent recovery,
* resume workflows.

---

# PROGRESS.md

Tracks:

* completed features,
* implementation status,
* pending integrations.

---

# DECISIONS.md

Stores:

* architecture decisions,
* library choices,
* rejected approaches,
* migration history.

Prevents agents from:

* reintroducing rejected patterns.

---

# ROADMAP.md

Contains:

* implementation phases,
* milestone sequencing,
* future modules.

---

# FEATURE_SPEC.md

Every major feature should have:

```text
docs/features/<feature-name>/FEATURE_SPEC.md
```

Contains:

* scope,
* workflows,
* APIs,
* UI sections,
* edge cases,
* validation rules.

Agents should implement ONLY from specs.

---

# 8. Recommended Folder for AI Agent Operations

---

# Recommended Structure

```text
.ai/
├── contexts/
├── handoffs/
├── prompts/
├── contracts/
├── tasks/
├── reviews/
└── temp/
```

---

# Purpose

---

## contexts/

Stores:

* scoped feature context,
* generated summaries,
* repo maps.

---

## handoffs/

Used when:

* one agent stops,
* another resumes.

---

## prompts/

Reusable prompt templates.

---

## contracts/

Execution boundaries.

Example:

```text
Allowed folders
Forbidden files
Expected outputs
Required tests
```

---

## tasks/

Task-by-task implementation specs.

---

## reviews/

Human review summaries.

---

# 9. Recommended Multi-Agent Workflow

---

# Use Git Worktrees

DO NOT use same branch for multiple agents.

Use:

```bash
git worktree add ../feature-diagnosis-upload feature/diagnosis-upload
```

One worktree per agent.

This isolates:

* file changes,
* context,
* dependencies.

---

# Parallel Development Strategy

---

## SAFE Parallel Work

Good:

```text
Agent A → packages/ui
Agent B → services/rag-service
Agent C → apps/web/features/diagnosis
```

---

## UNSAFE Parallel Work

Bad:

```text
2 agents editing auth flows simultaneously.
```

---

# 10. What Humans Should Always Do Manually

These are LOW-INTELLIGENCE, HIGH-TOKEN-COST tasks.

Humans should handle them.

---

# Manual Setup Tasks

---

## Environment Setup

Do manually:

```bash
pnpm install
pip install
docker compose up
```

---

## Package Installations

DO NOT ask agents:

```text
install tailwind
install shadcn
install redis
```

Instead:

* ask web LLM for exact commands,
* run yourself.

---

## Initial Framework Bootstrap

Do manually:

* Next.js init,
* FastAPI init,
* Turborepo init,
* Docker setup.

---

## Infrastructure Setup

Do manually:

* cloud accounts,
* Kubernetes clusters,
* Redis setup,
* PostgreSQL provisioning.

---

# 11. What Web LLMs Should Generate

Web LLMs are CHEAP planning tools.

Use them before implementation.

---

# Generate Before Coding

---

## UI Planning

Generate:

* page hierarchy,
* section layout,
* component decomposition,
* UX workflows.

Save:

```text
docs/ui/
```

---

## Backend Planning

Generate:

* endpoint contracts,
* validation rules,
* service responsibilities.

Save:

```text
docs/backend/
```

---

## Database Planning

Generate:

* schema drafts,
* entity relationships,
* indexing strategies.

Save:

```text
docs/database/
```

---

## AI Workflow Planning

Generate:

* agent chains,
* prompt templates,
* RAG flows,
* fallback logic.

Save:

```text
docs/ai/
```

---

## API Contracts

Generate:

* request schemas,
* response schemas,
* error structures.

Save:

```text
docs/contracts/
```

---

# 12. What Coding Agents Should Handle

Coding agents are best for:

* implementation,
* repetitive engineering,
* scoped feature construction,
* refactors,
* test generation,
* type-safe integrations.

---

# Good Agent Tasks

---

## Frontend

* UI component implementation
* forms
* dashboards
* table systems
* charts
* route layouts

---

## Backend

* API endpoints
* service layers
* validation
* repositories
* background workers

---

## AI Systems

* LangGraph chains
* RAG integration
* prompt pipelines
* inference routing

---

## DevOps

* Dockerfiles
* CI/CD configs
* monitoring configs

ONLY with scoped contexts.

---

# 13. Token Optimization Strategies

---

# Strategy 1 — Scoped Context Only

Never paste:

```text
whole architecture
whole repo tree
```

Instead:

* provide exact feature docs,
* exact folder,
* exact API.

---

# Strategy 2 — Generate Specs First

Specs reduce retries dramatically.

---

# Strategy 3 — Use Existing Patterns

Tell agents:

```text
Copy the pattern from:
apps/web/features/advisory/
```

Pattern reuse is cheaper than invention.

---

# Strategy 4 — Avoid Broad Refactors

Broad refactors:

* consume huge tokens,
* create instability,
* break integrations.

---

# Strategy 5 — Keep Features Small

Smaller features:

* reduce hallucination,
* improve mergeability,
* improve reviewability.

---

# 14. Graphiti / Graphify / Context Compression Tools

Tools like Graphiti-style context systems are useful because they:

* compress repo understanding,
* provide scoped context retrieval,
* reduce repeated repo scanning,
* maintain continuity between sessions.

Use them for:

* repo summaries,
* dependency maps,
* feature ownership graphs,
* API relationships.

NOT:

* full raw code dumps.

---

# Recommended Usage Pattern

---

## Before Agent Starts

Generate:

```text
Feature Summary
Relevant APIs
Relevant Files
Constraints
Patterns to Follow
```

Then provide ONLY that compressed context.

---

## Good Context Package

```text
Task
Allowed folders
Reference implementation
Required API
Expected tests
Forbidden changes
```

This is MUCH cheaper than:

```text
Understand the repo and build feature.
```

---

# 15. Recommended AI Prompting Structure

Every implementation prompt should contain:

---

# A. Goal

What exactly to build.

---

# B. Scope

Allowed folders.

---

# C. Forbidden Areas

Files/services not allowed.

---

# D. Existing Patterns

Reference files.

---

# E. Acceptance Criteria

Expected behavior.

---

# F. Output Rules

Required tests/docs/types.

---

# Example

```text
Build the Diagnosis History page.

Allowed:
- apps/web/features/history
- packages/ui

Forbidden:
- auth
- backend
- agent services

Use patterns from:
- apps/web/features/dashboard

Requirements:
- pagination
- responsive
- empty states
- loading skeleton

Return:
- implementation
- tests
- updated docs
```

---

# 16. Recommended Development Order

---

# Phase 1 — Foundations

Humans mostly.

* monorepo
* tooling
* docker
* auth skeleton
* CI/CD
* shared UI system

---

# Phase 2 — Public Website

AI-heavy.

* landing page
* upload UI
* diagnosis flow
* articles

---

# Phase 3 — Farmer Dashboard

AI-heavy.

* history
* alerts
* AI assistant
* profiles

---

# Phase 4 — AI Layer

Careful hybrid work.

* LangGraph
* RAG
* prompt systems
* orchestration

---

# Phase 5 — Government/Admin

AI + human review.

* analytics
* moderation
* governance

---

# 17. Critical Anti-Patterns

---

# NEVER

---

## Never let agents freely redesign architecture

---

## Never let agents scan whole monorepo unnecessarily

---

## Never allow parallel edits on same module

---

## Never let prompts become vague

---

## Never keep stale AGENTS.md files

---

## Never duplicate business logic

---

## Never mix AI prompts inside frontend components

---

# 18. Final Operational Strategy

The optimal workflow is:

```text
Human Architecture Thinking
    ↓
Web LLM Planning
    ↓
Structured Specs
    ↓
Scoped AI Agent Implementation
    ↓
Human Review
    ↓
Merge
```

NOT:

```text
Ask giant prompt to agent and hope it builds everything.
```

---

# 19. Final Team Workflow Summary

The repository should operate like:

```text
Human Architects
+
AI Planning Assistants
+
Scoped Coding Agents
+
Strict Context Engineering
+
Modular Monorepo
```

This approach:

* minimizes token cost,
* maximizes implementation quality,
* supports parallel engineering,
* reduces merge conflicts,
* improves maintainability,
* keeps AI agents stable,
* and enables scalable long-term development.

Modern AI engineering trends strongly support scoped context engineering, layered AGENTS.md files, modular repositories, and isolated agent ownership boundaries for effective multi-agent software development. ([agents.md][1])

