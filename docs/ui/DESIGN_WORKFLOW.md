# UI/UX Design Planning Strategy Before Development

You are now at the MOST IMPORTANT phase before actual implementation.

Since:

* you already completed Phase 0,
* the architecture is modular,
* the project will be AI-agent implemented,
* and the system is government/business scale,

you should NOT directly start coding pages.

You now need:

```text
Design Context Engineering
```

This means:

* structured UI planning,
* design prompts,
* component breakdowns,
* page scopes,
* and design contracts

BEFORE implementation.

This is exactly what high-end AI-native engineering teams are doing in 2026.

---

# 1. Should You Use Google Stitch?

Yes.

For YOUR workflow:

```text
Google Stitch + Antigravity + Scoped AI Agents
```

is an excellent combination.

Because Stitch:

* generates modern UI fast,
* creates design consistency,
* reduces frontend design tokens,
* gives visual references,
* helps agents understand intended UX faster.

---

# 2. Recommended UI Workflow

You should NOT do:

```text
Generate all pages together.
```

Instead:

---

# Correct Workflow

```text
1. Create DESIGN_SYSTEM.md
        ↓
2. Create PAGE_SPEC.md for each page
        ↓
3. Generate designs in Stitch
        ↓
4. Export screenshots/components
        ↓
5. Save into docs/ui/
        ↓
6. Give scoped context to Antigravity agents
        ↓
7. Agents implement page/module
```

This massively reduces:

* token cost,
* hallucinations,
* inconsistent UI,
* frontend rewrites.

---

# 3. How Many Pages Should You Have?

DO NOT overbuild initially.

Your platform should have:

---

# PHASE 1 PAGES (MUST HAVE)

These are your MVP + scalable foundation pages.

---

# PUBLIC WEBSITE

| Page              | Purpose                      |
| ----------------- | ---------------------------- |
| Landing Page      | Platform introduction        |
| Diagnosis Page    | Upload crop image            |
| AI Assistant Page | Chat advisory                |
| Disease Library   | Browse diseases              |
| Knowledge Center  | Articles and guides          |
| Public Alerts     | Outbreak alerts              |
| About Platform    | Government/research overview |
| Contact           | Support                      |
| Login/Register    | Authentication               |

---

# FARMER DASHBOARD

| Page               | Purpose                  |
| ------------------ | ------------------------ |
| Dashboard Home     | Overview                 |
| Diagnosis History  | Previous scans           |
| Advisory Center    | Personalized suggestions |
| Alerts Center      | Notifications            |
| AI Chat Assistant  | Personalized AI          |
| Saved Crops/Farms  | User crop tracking       |
| Profile & Settings | Preferences              |

---

# ADMIN / GOVERNMENT

| Page                | Purpose          |
| ------------------- | ---------------- |
| National Dashboard  | Analytics        |
| Disease Monitoring  | Outbreak maps    |
| User Management     | Accounts         |
| Expert Verification | Moderation       |
| AI Governance       | Model monitoring |
| System Monitoring   | Infra metrics    |

---

# EXPERT DASHBOARD

| Page                 | Purpose              |
| -------------------- | -------------------- |
| Review Queue         | Low-confidence cases |
| Advisory Validation  | Human corrections    |
| Knowledge Publishing | Articles             |
| Regional Analytics   | Trend analysis       |

---

# TOTAL INITIAL PAGE COUNT

Recommended:

```text
18–22 pages
```

NOT:

```text
50+ pages initially
```

Because:

* modular scaling is easier later,
* agents perform better on smaller systems,
* faster MVP deployment,
* cleaner UX consistency.

---

# 4. Most Important UI Architecture Principle

Your UI should NOT feel:

```text
government software
```

It should feel:

```text
AI-native agriculture operating system
```

Meaning:

* clean,
* calm,
* modern,
* lightweight,
* smart,
* trustworthy.

---

# 5. Recommended Unique Dark Green Theme

You asked for:

> modern transparent gradient dark green theme

This is PERFECT for your project.

---

# Primary Theme Direction

Style:

```text
Modern AI Agriculture Glassmorphism
+
Soft Transparency
+
Deep Green Gradients
+
Minimal Neon Accents
```

---

# Recommended Color Palette

## Primary Background

```text
#07130F
```

---

## Secondary Background

```text
#0D1F18
```

---

## Card Background

```text
rgba(17, 38, 30, 0.72)
```

Glass effect:

```css
backdrop-filter: blur(18px);
```

---

## Primary Accent

```text
#38D27D
```

---

## Secondary Accent

```text
#7EF7B8
```

---

## Gradient

```css
linear-gradient(
135deg,
#07130F 0%,
#0F2D20 40%,
#174B33 100%
)
```

---

## Alert Colors

### Warning

```text
#FFC857
```

### Danger

```text
#FF6B6B
```

### Info

```text
#57C7FF
```

---

# Typography

Recommended:

```text
Inter
+
Geist
```

---

# Design Feel

Your UI should resemble:

* modern AI SaaS,
* premium climate-tech,
* futuristic agri-intelligence platform.

NOT:

* traditional agriculture websites,
* Bootstrap admin panels,
* overly colorful farming apps.

---

# 6. MASTER DESIGN SYSTEM FILES [DONE - Check docs/ui/DESIGN_SYSTEM.md]

Before page generation:
create these FIRST.

---

# REQUIRED FILES

```text
docs/ui/
├── DESIGN_SYSTEM.md [DONE]
├── UI_PRINCIPLES.md
├── COMPONENT_GUIDELINES.md
├── NAVIGATION_ARCHITECTURE.md
├── ACCESSIBILITY.md
└── page-specs/ [INITIALIZED]
```

---

# 7. What DESIGN_SYSTEM.md Should Contain [DONE]

Your agents MUST read this first.

---

# DESIGN_SYSTEM.md

Contains:

* color palette,
* spacing,
* typography,
* border radius,
* shadows,
* transparency rules,
* motion principles,
* layout philosophy,
* mobile-first rules,
* component consistency.

---

# CRITICAL

Without DESIGN_SYSTEM.md:

* AI agents will create inconsistent UIs,
* spacing mismatch happens,
* colors drift,
* layouts become fragmented.

---

# 8. PAGE-SPEC STRATEGY

DO NOT directly generate UI from random prompts.

For EACH PAGE create:

```text
docs/ui/page-specs/<page>.md
```

---

# Example

```text
docs/ui/page-specs/landing-page.md
docs/ui/page-specs/diagnosis-page.md
docs/ui/page-specs/admin-dashboard.md
```

---

# What Each Page Spec Contains

---

## 1. Purpose

What page does.

---

## 2. User Role

Who sees it.

---

## 3. Key Actions

Main CTA actions.

---

## 4. Required Sections

Hero, cards, analytics etc.

---

## 5. Required Components

Uploaders, charts, tables etc.

---

## 6. Mobile Behavior

Stacking/collapse rules.

---

## 7. API Dependencies

Which APIs feed this page.

---

## 8. State Rules

Loading, empty, error states.

---

# 9. Stitch Prompt Engineering Strategy

This is VERY important.

You should NOT:

* over-constrain layouts,
* define exact pixel positioning,
* force specific UI patterns.

Stitch is good at:

* layout generation,
* hierarchy,
* spacing,
* modern composition.

You should provide:

* functionality,
* mood,
* components,
* UX goals,
* style direction.

---

# 10. MASTER STITCH PROMPT TEMPLATE

Use this structure ALWAYS.

---

# TEMPLATE

```text
Design a modern AI-native agriculture platform page for [ROLE].

Style:
- dark green transparent gradient theme
- glassmorphism
- modern SaaS dashboard aesthetics
- clean spacing
- professional futuristic agriculture UI
- mobile-first responsive layout
- subtle gradients and soft shadows
- highly polished and minimal

The page should include:
[FUNCTIONALITIES]

The layout should feel:
- trustworthy
- intelligent
- lightweight
- government-grade but modern
- AI-first

Use:
- modern cards
- analytics widgets where appropriate
- modular section hierarchy
- clear CTA buttons
- smooth dashboard organization

Avoid:
- clutter
- traditional admin panel look
- excessive colors
- old agriculture website aesthetics
```

---

# 11. Specific Stitch Prompts For Important Pages

---

# A. Landing Page Prompt

```text
Design a modern AI-powered agriculture platform landing page for Bangladesh.

Style:
- futuristic dark green transparent gradient UI
- modern AI SaaS aesthetic
- glassmorphism
- clean typography
- premium modern feel
- mobile-first responsive layout

The page should include:
- hero section with AI crop diagnosis CTA
- upload crop image CTA
- supported crop showcase
- AI agriculture assistant showcase
- disease monitoring visualization
- government initiative section
- educational knowledge section
- outbreak alert preview
- testimonials
- FAQ
- footer

The design should feel:
- trustworthy
- intelligent
- innovative
- accessible for rural farmers
- suitable for government deployment

Avoid:
- overly corporate look
- traditional farming website design
- cluttered layouts
```

---

# B. Diagnosis Page Prompt

```text
Design a modern AI crop disease diagnosis page.

Style:
- dark green transparent gradient
- futuristic agriculture AI dashboard
- modern glassmorphism
- clean upload experience
- mobile-friendly

The page should include:
- image upload area
- drag and drop uploader
- mobile camera upload
- crop preview
- diagnosis result cards
- disease confidence indicators
- severity level visualization
- treatment recommendation section
- preventive guidance
- downloadable report button
- AI assistant quick actions

The page should feel:
- fast
- trustworthy
- scientific
- easy for farmers
- visually clean

Avoid:
- excessive technical complexity
- crowded UI
```

---

# C. Farmer Dashboard Prompt

```text
Design a farmer dashboard for an AI agriculture advisory platform.

Style:
- premium dark green glassmorphism dashboard
- transparent layered cards
- soft gradients
- minimal but informative
- mobile-first

The dashboard should include:
- quick diagnosis action
- recent diagnosis history
- AI assistant shortcut
- weather and outbreak alerts
- crop status widgets
- personalized recommendations
- farm overview cards
- recent advisory summaries
- notification center preview

The interface should feel:
- calm
- smart
- personalized
- easy to navigate
- AI-native

Avoid:
- enterprise admin dashboard complexity
```

---

# D. Admin Dashboard Prompt

```text
Design a government-level agriculture analytics dashboard.

Style:
- dark green futuristic analytics platform
- transparent modern dashboard
- premium monitoring interface
- advanced but clean

The dashboard should include:
- disease heatmaps
- regional outbreak analytics
- crop statistics
- AI inference metrics
- user activity charts
- moderation queue
- system health indicators
- model performance cards
- alerts monitoring
- geographic visualization

The interface should feel:
- authoritative
- modern
- highly analytical
- trustworthy
- national-scale

Avoid:
- outdated government dashboard styles
- cluttered enterprise UI
```

---

# 12. Recommended Design Generation Workflow

---

# Step 1

Generate:

```text
DESIGN_SYSTEM.md
```

---

# Step 2

Generate:

```text
page-specs/
```

---

# Step 3

Generate Stitch designs ONE PAGE AT A TIME.

NOT all together.

---

# Step 4

Save:

```text
docs/ui/generated/
```

---

# Step 5

Create:

```text
IMPLEMENTATION_NOTES.md
```

Summarize:

* sections,
* components,
* states,
* responsiveness,
* animations.

---

# Step 6

Feed ONLY relevant page context to Antigravity agents.

---

# 13. How Antigravity Agents Should Consume Design Context

DO NOT paste:

* huge architecture docs,
* all UI docs,
* all designs.

Instead provide:

```text
Page spec
+
Design screenshot
+
Design system
+
Allowed folders
+
Acceptance criteria
```

This dramatically improves:

* implementation quality,
* token efficiency,
* consistency.

---

# 14. Recommended UI Component Strategy

DO NOT let agents invent components repeatedly.

Create:

```text
packages/ui/
```

with reusable:

* buttons,
* cards,
* uploaders,
* charts,
* dialogs,
* layouts,
* sidebars,
* badges,
* tables,
* AI chat components.

Then agents compose from them.

This reduces:

* tokens,
* duplicate code,
* visual inconsistency.

---


