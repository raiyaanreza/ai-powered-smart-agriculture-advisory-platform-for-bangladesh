# 🎨 AgriVision Stitch & UI Generation Guide

This guide defines the workflow for generating high-fidelity UI designs using Google Stitch and implementing them via Antigravity.

## 🔄 The Master Workflow

1.  **Review the Page Spec**: Read the file in `docs/ui/page-specs/` to understand what functionality is required.
2.  **Prepare the Prompt**: Use the **Stitch-Ready Prompt** provided in the spec file.
3.  **Generate in Stitch**:
    *   Open Stitch.
    *   Select the "Dark Green Glassmorphism" theme profile (configured from `DESIGN_SYSTEM.md`).
    *   Paste the prompt and generate.
4.  **Capture and Store**:
    *   Take a clean screenshot of the generated UI.
    *   Save it as `docs/ui/generated/<page-name>.png`.
5.  **Trigger Implementation**:
    *   Give the screenshot and the spec file to Antigravity.
    *   Command: "Implement the [Page Name] in `apps/web/features/[feature]` using this design."

## 🎨 Theme Consistency
Always ensure Stitch is aware of these core tokens:
- **Primary**: `#38D27D` (Emerald Green)
- **Background**: `#07130F` (Deep Forest)
- **Effect**: Glassmorphism (Blur: 18px, Opacity: 72%)

## 📏 Design-to-Code Handoff
When Antigravity implements a page, it must:
1.  Check `packages/ui` for existing components.
2.  Map Stitch's visual layout to Tailwind v4 classes.
3.  Ensure the "Mood" matches the **AI-Native Agri-OS** philosophy.
