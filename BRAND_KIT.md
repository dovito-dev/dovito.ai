# Dovito.ai Brand Kit

---

## 1. Brand Overview

- **Brand Name:** Dovito.ai
- **Tagline:** "Automation That Delivers Results"
- **One-sentence Summary:** Dovito.ai is a modern business process automation platform that combines cutting-edge AI with intuitive design to help companies automate workflows, reduce manual tasks, and achieve measurable ROI.
- **Tone & Personality:** Confident yet friendly, professional with approachable expertise, results-driven but empowering.

### Mission Statement
To democratize business process automation, making powerful AI-driven solutions accessible to organizations of all sizes.

### Vision Statement
A world where every business operates at peak efficiency, with intelligent automation handling repetitive tasks while humans focus on creativity, strategy, and meaningful work.

### Core Values
- **Innovation** — Pushing boundaries with cutting-edge AI solutions
- **Reliability** — Dependable automation that works when you need it
- **Transparency** — Clear communication and measurable outcomes
- **Empowerment** — Enabling teams to do more with less

---

## 2. Logo & Marks

### Primary Logo
- **Path:** `attached_assets/white_1749151126542.png`
- **Type:** Wordmark/Logotype (white text on transparent)
- **Preferred Usage:** Dark backgrounds

### Color Variant
- **Path:** `attached_assets/dovito logo_color-pos_1749151126542.png`
- **Type:** Color positive version
- **Preferred Usage:** Light backgrounds, print materials

### App Icon
- **Path:** `attached_assets/1024-app-icon_1749575157884.png`
- **Size:** 1024×1024px
- **Usage:** App stores, favicons, mobile icons

---

## 3. Color System

### 3.1 Primary Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Primary Deep Blue** | `210 55% 23%` | `#1a365d` | `26, 54, 93` | Primary actions, links, text on light backgrounds |
| **Primary Steel Blue** | `207 44% 49%` | `#4682b4` | `70, 130, 180` | Beams effect, accents, focus rings |
| **Secondary Cyan** | `199 100% 62%` | `#3fb9ff` | `63, 185, 255` | **Primary CTAs**, buttons, highlights |

### 3.2 Background Colors

#### Light Mode (Default - Middle Sections)

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Background White** | `0 0% 100%` | `#ffffff` | `255, 255, 255` | Products, Value, Features sections |
| **Card White** | `0 0% 100%` | `#ffffff` | `255, 255, 255` | Cards on light backgrounds |
| **Muted Light** | `210 10% 96%` | `#f5f7fa` | `245, 247, 250` | Subtle background variations |

#### Dark Mode (Hero, Contact, Footer Sections)

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Background Navy** | `210 100% 12%` | `#001f3f` | `0, 31, 63` | Dark section backgrounds |
| **Card Charcoal** | `210 16% 18%` | `#2a3a4a` | `42, 58, 74` | Cards on dark backgrounds |
| **Muted Dark** | `210 16% 22%` | `#2d3a45` | `45, 58, 69` | Secondary dark backgrounds |

### 3.3 Secondary Colors (Cyan)

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Secondary Cyan** | `199 100% 62%` | `#3fb9ff` | `63, 185, 255` | Secondary actions, highlights |
| **Secondary Dark Cyan** | `195 100% 40%` | `#0099cc` | `0, 153, 204` | Accent elements |

### 3.4 Tertiary Color (Gold)

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Tertiary Gold** | `38 73% 42%` | `#b7791f` | `183, 121, 31` | Emphasis, special highlights (use sparingly) |

### 3.5 Text Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Foreground** | `0 0% 98%` | `#FAFAFA` | `250, 250, 250` | Primary text, headings |
| **Muted Foreground** | `210 10% 65%` | `#94a3b8` | `148, 163, 184` | Secondary text, descriptions |

### 3.6 Border Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Border** | `210 16% 35%` | `#4a5c6a` | `74, 92, 106` | Dividers, card outlines |
| **Border Light** | `0 0% 100% / 10%` | `#FFFFFF1A` | `255, 255, 255, 0.1` | Subtle borders, glass effects |

### 3.7 Semantic Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Destructive** | `0 84% 60%` | `#EF4444` | `239, 68, 68` | Error states, warnings, delete actions |
| **Success** | `142 76% 46%` | `#22C55E` | `34, 197, 94` | Success states, confirmations |

### 3.8 Gradients

| Name | CSS Value | Usage |
|------|-----------|-------|
| **Hero Gradient** | `linear-gradient(180deg, #0f2744 0%, #1a3a5c 30%, #2a5070 60%, #3d6585 100%)` | Hero section background |
| **Primary Gradient** | `linear-gradient(135deg, #1a365d 0%, #4682b4 100%)` | CTA highlights, accents |
| **Background Gradient** | `linear-gradient(180deg, #001f3f 0%, #3d4a55 100%)` | Dark section depth |

### 3.9 Page Section Layout

The website uses a **hybrid light/dark design pattern**:

| Section | Background | Text Color | Notes |
|---------|------------|------------|-------|
| **Hero** | Dark gradient (inline styles) | White | Uses hero-gradient with direct style prop |
| **Products** | White | Dark blue (#1a365d) | Light section |
| **Value** | White | Dark blue (#1a365d) | Light section |
| **Features** | White | Dark blue (#1a365d) | Light section |
| **Contact** | Dark navy (#001f3f) | White | section-dark class |
| **Footer** | Dark navy (#001f3f) | White | section-dark class |

### Color Mapping Reference

| Old Role | Old Color | New Color | New HEX |
|----------|-----------|-----------|---------|
| Primary | #3366FF | Deep Blue | #1a365d |
| Primary Light | #94A6FF | Steel Blue | #4682b4 |
| Background | #000000 | Navy | #001f3f |
| Card/Muted | #080808 | Charcoal | #3d4a55 |
| — | — | Secondary Cyan | #3fb9ff / #0099cc |
| — | — | Tertiary Gold | #b7791f |

---

## 4. Typography

### Font Families

| Role | Family | Fallbacks |
|------|--------|-----------|
| **Primary** | Inter | system-ui, -apple-system, sans-serif |

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

### Font Weights

| Name | Value | Usage |
|------|-------|-------|
| Light | 300 | Subtle text, captions |
| Regular | 400 | Body text, paragraphs |
| Medium | 500 | Labels, navigation |
| Semibold | 600 | Subheadings, emphasis |
| Bold | 700 | Headings, titles |

### Type Scale

| Level | Size | Classes | Usage |
|-------|------|---------|-------|
| **Display** | 4.5rem / 72px | `text-7xl` | Hero headlines |
| **H1** | 3rem / 48px | `text-5xl` | Page titles |
| **H2** | 2.25rem / 36px | `text-4xl md:text-6xl` | Section headings |
| **H3** | 1.5rem / 24px | `text-2xl` | Subsections |
| **Body** | 1rem / 16px | `text-base` | Paragraph text |
| **Small** | 0.875rem / 14px | `text-sm` | Captions, labels |

---

## 5. Spacing, Radius & Elevation

### Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| **--radius** | 0.75rem (12px) | Base radius variable |
| `rounded-lg` | var(--radius) | Default radius |
| `rounded-2xl` | 1rem | Cards, product tiles |
| `rounded-3xl` | 1.5rem | Section cards |
| `rounded-full` | 9999px | Buttons, pills |

### Shadow/Elevation Tokens

| Token | CSS Value | Usage |
|-------|-----------|-------|
| **Primary Glow** | `0 20px 40px rgba(70, 130, 180, 0.3)` | Live product hover |
| **Subtle Glow** | `0 20px 40px rgba(255, 255, 255, 0.1)` | Coming Soon hover |
| **Navbar Shadow** | `shadow-lg shadow-black/20` | Fixed navbar |

---

## 6. CSS Custom Properties

### Light Mode (Default `:root`)

```css
:root {
  --background: 0 0% 100%;           /* White */
  --foreground: 210 55% 23%;         /* Deep Blue */
  --muted: 210 10% 96%;              /* Light gray */
  --muted-foreground: 210 16% 45%;   /* Medium gray */
  --popover: 0 0% 100%;
  --popover-foreground: 210 55% 23%;
  --card: 0 0% 100%;
  --card-foreground: 210 55% 23%;
  --border: 210 16% 85%;             /* Light border */
  --input: 210 16% 90%;
  --primary: 210 55% 23%;
  --primary-foreground: 0 0% 100%;
  --primary-light: 207 44% 49%;
  --secondary: 199 100% 62%;         /* Cyan - CTAs */
  --secondary-foreground: 210 100% 12%;
  --accent: 195 100% 40%;
  --accent-foreground: 0 0% 100%;
  --tertiary: 38 73% 42%;
  --tertiary-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --ring: 207 44% 49%;
  --radius: 0.75rem;
}
```

### Dark Mode (`.dark` class)

```css
.dark {
  --background: 210 100% 12%;        /* Navy */
  --foreground: 0 0% 98%;            /* White */
  --muted: 210 16% 22%;
  --muted-foreground: 210 10% 65%;
  --card: 210 16% 18%;
  --card-foreground: 0 0% 98%;
  --border: 210 16% 25%;
}
```

### Section Dark Override (`.section-dark` class)

Used for dark sections within a light-mode page (Contact, Footer):

```css
.section-dark {
  --background: 210 100% 12%;
  --foreground: 0 0% 98%;
  --muted: 210 16% 22%;
  --muted-foreground: 210 10% 65%;
  --card: 210 16% 18%;
  --card-foreground: 0 0% 98%;
  --border: 210 16% 25%;
}
```

---

## 7. Tone of Voice

### Tone Guidelines
- **Confident yet friendly** — Expertise without arrogance
- **Clear and concise** — Direct language that respects time
- **Results-focused** — Always tie features to outcomes
- **Empowering** — Enable action, don't overwhelm

### Example Headlines
```
"Start Automating Today"
"Automation That Delivers Results"
"The Dovito Universe"
```

### Example CTAs
```
"Start Automating" (primary)
"Explore Universe" (secondary)
"Schedule Free Consultation"
```

---

## 8. Key Files

| File | Purpose |
|------|---------|
| `client/src/index.css` | Global styles, CSS variables, gradients |
| `tailwind.config.ts` | Tailwind theme extensions |
| `client/src/pages/BrandKit.tsx` | Brand guidelines page |
| `client/src/components/BeamStyleLanding.tsx` | Main landing page with hero gradient |
| `BRAND_KIT.md` | This brand documentation file |

---

## 9. Implementation Notes

### Hero Section Gradient

The hero gradient is applied via inline styles to prevent CSS variable conflicts:

```tsx
<section 
  id="home" 
  style={{ 
    background: 'linear-gradient(180deg, #0f2744 0%, #1a3a5c 30%, #2a5070 60%, #3d6585 100%)' 
  }}
>
```

### CTA Button Styling

Primary CTAs use the secondary cyan color for maximum visibility:

```tsx
<Button className="bg-[#3fb9ff] hover:bg-[#3fb9ff]/90 text-white">
  Get Started
</Button>
```

### Text on White Backgrounds

For sections with white backgrounds, use dark brand colors:

```tsx
<h2 className="text-[#1a365d]">Section Title</h2>
<p className="text-[#001f3f]/80">Description text</p>
```

---

*Last updated: December 2024*
*© 2024 Dovito.ai. All brand assets are property of Dovito.ai.*
