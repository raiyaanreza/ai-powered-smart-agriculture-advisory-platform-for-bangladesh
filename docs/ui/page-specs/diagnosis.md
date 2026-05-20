# 📄 Page Spec: AI Crop Diagnosis

**File Location**: `apps/web/app/diagnosis/page.tsx`  
**User Role**: Farmer / Researcher

---

## 🎯 1. Purpose
Provide a clean, focused interface for uploading crop images and receiving AI-powered disease reports.

## 🧱 2. Required Sections
1.  **Header**: Simplified navigation (Home, History, Help).
2.  **Upload Workspace**:
    *   Large Glassmorphism drop-zone.
    *   Camera capture button (Mobile-optimized).
    *   Upload progress bar with "Scanning..." animation.
3.  **Result Display (Conditional)**:
    *   Crop Preview (the uploaded image).
    *   Severity Meter (Circular gauge or progress bar).
    *   Disease Identification Card: Name, Confidence (%), and Scientific name.
    *   Recommendation List: Treatment steps and preventive advice.
4.  **Expert Connect CTA**: "Unsure? Send to an expert for verification."

## 💠 3. Key Components
- `UploaderBox`: Custom glass component.
- `SeverityIndicator`: Color-coded (Green/Yellow/Red).
- `ActionPill`: For quick report download or sharing.

---

## 🤖 4. Stitch-Ready Prompt
Copy-paste this into Stitch:

> **Prompt**: Design an AI Crop Diagnosis interface for a futuristic agriculture platform.
>
> **Style**: 
> - Theme: Deep forest dark green gradient.
> - Layout: Centered workspace for focus.
> - Visuals: Glassmorphism uploader with a dashed emerald border.
>
> **Components**:
> 1. A central "Drop Zone" card that looks like a high-tech scanner. 
> 2. Once uploaded, show a results panel with a "Severity Meter" gauge in emerald and yellow.
> 3. Use beautiful cards for "AI Recommendations" with clear icons (Watering, Sunlight, Pesticide).
> 4. A prominent button to "Download PDF Report" with a subtle glass effect.
>
> **Feel**: Fast, scientific, helpful, and very easy to use on a smartphone under direct sunlight.
