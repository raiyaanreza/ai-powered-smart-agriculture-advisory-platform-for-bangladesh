# AgriVision Design System — Earth & Harvest Light Theme

> **Version:** 2.1 · **Updated:** 2026-05-14
> **Theme Mode:** Professional Light (SaaS aesthetic, high-contrast, government-grade authority).

---

## 1. Color Palette

### Brand Colors (Earth & Harvest)
| Token | Value | Usage |
|---|---|---|
| `earth-700` | `#2D5A27` | Primary Brand Green, Headings, Icons |
| `earth-600` | `#3D9150` | Primary Actions, Hover Gradients |
| `earth-50`  | `#F1F8F2` | Subtle Backgrounds, Pill Badges |
| `gold-500`  | `#EAB308` | Harvest Gold, Accents, Highlights |
| `gold-50`   | `#FEFCE8` | Warning backgrounds, Accent surfaces |
| `slate-900` | `#0F172A` | Deep Text, Footer Background |
| `slate-500` | `#64748B` | Standard Body Text |
| `slate-50`  | `#F8FAFC` | Section Alternation, Layout Neutral |

### CSS Variables (`:root`)
```css
--background: #FAFAFA;      /* Page base */
--foreground: #1E293B;      /* Primary text */
--card: #FFFFFF;            /* Card base */
--primary: #2D5A27;         /* Earth Green */
--accent: #EAB308;          /* Harvest Gold */
--border: #E2E8F0;          /* Standard divider */
--muted: #F1F5F9;           /* Secondary surfaces */
```

---

## 2. Typography

### Font Stack
- **Primary font**: `Inter` (Body, descriptions, labels)
- **Heading font**: `Sora` or `Inter` (Black 900 weight for authority)
- **Monospace**: `JetBrains Mono` (UI metadata, URL bars)

### Type Scale
| Element | weight | Color |
|---|---|---|
| Hero H1 | `900` | `slate-900` |
| Section H2 | `900` | `slate-900` |
| Card Title | `700` | `slate-800` |
| Body Text | `500` | `slate-500` |
| Labels | `800` | `earth-700` |

---

## 3. Spacing & Layout

- **Container max-width**: `max-w-7xl` (1280px)
- **Section padding**: `py-24 sm:py-32`
- **Grid gap**: `gap-4 sm:gap-5`
- **Border radius**: `rounded-2xl` (16px) for cards, `rounded-xl` (12px) for buttons.

---

## 4. Components

### GlassCard (Light)
```
background: #FFFFFF
border: 1px solid #E2E8F0
border-radius: 16px (rounded-2xl)
box-shadow: 0 1px 3px rgba(0,0,0,0.04)
```
**Hover:** lifts `-translate-y-0.5`, shadow deepens to `0 4px 20px rgba(0,0,0,0.06)`, border brightens to `rgba(45,90,39,0.22)`.

### Button Variants
| Variant | Style |
|---|---|
| `default` | Earth Green gradient (`#2D5A27` → `#3D9150`), white text |
| `outline` | Slate border, white bg, slate text |
| `ghost` | No border/bg, slate text, hover bg-slate-100 |
| `gold` | Harvest Gold gradient, white text |

### Pill Badge / Label
```html
<div class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 
             bg-[rgba(45,90,39,0.07)] border border-[rgba(45,90,39,0.16)]">
  <span class="h-1.5 w-1.5 rounded-full bg-[#2D5A27] animate-pulse" />
  <span class="text-[10px] font-black uppercase tracking-[0.14em] text-[#2D5A27]">
    Label Text
  </span>
</div>
```

---

## 5. Motion & Animation (Framer Motion)

- **Standard Reveal**: `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}`
- **Viewport**: `viewport={{ once: true, amount: 0.05 }}`
- **Transition**: `type: "spring", stiffness: 100`

---

## 6. Backgrounds

### `hero-grid` (Light Base)
```css
background: linear-gradient(160deg, #F1F8F2 0%, #FAFAFA 50%, #FEFCE8 100%)
+ 40px grid pattern in rgba(45,90,39,0.04)
```

### `bg-section-alt` (Neutral)
```css
background: #F8FAFC
```

### `bg-dark-section` (Contrast)
```css
background: linear-gradient(135deg, #1A321A 0%, #2D5A27 60%, #214020 100%)
```

---

## 7. Sections Map (Landing Page)

| Section | Theme | Background |
|---|---|---|
| **Banner** | Brand Green | Earth Green Shimmer |
| **Navbar** | Light/Frosted | White/95% backdrop-blur |
| **Hero** | Light | `hero-grid` |
| **TrustedBy** | Neutral | White w/ Marquee |
| **Features** | Alt | `#F8FAFC` (Slate-50) |
| **HowItWorks** | Light | White |
| **Testimonials**| Alt | `#F8FAFC` |
| **Impact** | Contrast | `bg-dark-section` |
| **CTA** | Contrast | Earth Green Card on White |
| **Footer** | Dark | Slate-900 |
