# Dovito.ai Brand Kit

---

## 1. Brand Overview

- **Brand Name:** Dovito.ai
- **Tagline:** "Automation That Delivers Results"
- **One-sentence Summary:** Dovito.ai is a modern business process automation platform that combines cutting-edge AI with intuitive design to help companies automate workflows, reduce manual tasks, and achieve measurable ROI.
- **Tone & Personality:** Confident yet friendly, professional with approachable expertise, results-driven but empowering. Technical knowledge delivered with clarity—we empower, not overwhelm.

### Mission Statement
To democratize business process automation, making powerful AI-driven solutions accessible to organizations of all sizes, enabling them to focus on what matters most—growth and innovation.

### Vision Statement
A world where every business operates at peak efficiency, with intelligent automation handling repetitive tasks while humans focus on creativity, strategy, and meaningful work.

### Core Values
- **Innovation** — Pushing boundaries with cutting-edge AI solutions
- **Reliability** — Dependable automation that works when you need it
- **Transparency** — Clear communication and measurable outcomes
- **Empowerment** — Enabling teams to do more with less

### Brand Personality Traits
- Professional
- Innovative
- Approachable
- Results-driven
- Trustworthy

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

### Usage Notes
- Maintain minimum clear space equal to the height of the "D" in Dovito around all sides of the logo
- For light backgrounds, use the inverted (color) version
- Primary logo is optimized for dark backgrounds

### Logo Don'ts
- Don't stretch or distort
- Don't change colors arbitrarily
- Don't add effects or shadows
- Don't rotate the logo
- Don't use on busy backgrounds
- Don't crop any part

---

## 3. Color System

### 3.1 Primary Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Primary Blue** | `240 100% 60%` | `#3366FF` | `51, 102, 255` | Primary actions, links, highlights, CTAs |
| **Primary Light** | `231 100% 79%` | `#94A6FF` | `148, 166, 255` | Beams effect, accents, glows |

### 3.2 Background Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Background** | `0 0% 0%` | `#000000` | `0, 0, 0` | Main page background |
| **Card** | `0 0% 3%` | `#080808` | `8, 8, 8` | Cards, elevated surfaces |
| **Muted** | `0 0% 5%` | `#0D0D0D` | `13, 13, 13` | Secondary backgrounds |
| **Popover** | `0 0% 3%` | `#080808` | `8, 8, 8` | Popovers, overlays |

### 3.3 Text Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Foreground** | `0 0% 98%` | `#FAFAFA` | `250, 250, 250` | Primary text, headings |
| **Muted Foreground** | `0 0% 65%` | `#A6A6A6` | `166, 166, 166` | Secondary text, descriptions, labels |

### 3.4 Border & Input Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Border** | `0 0% 10%` | `#1A1A1A` | `26, 26, 26` | Dividers, card outlines |
| **Input** | `0 0% 10%` | `#1A1A1A` | `26, 26, 26` | Form input borders |
| **Border Light** | `0 0% 100% / 10%` | `#FFFFFF1A` | `255, 255, 255, 0.1` | Subtle borders, glass effects |

### 3.5 Secondary & Accent Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Secondary** | `0 0% 8%` | `#141414` | `20, 20, 20` | Secondary buttons, backgrounds |
| **Accent** | `0 0% 8%` | `#141414` | `20, 20, 20` | Accented elements |

### 3.6 Semantic Colors

| Name | HSL | HEX | RGB | Role |
|------|-----|-----|-----|------|
| **Destructive** | `0 84% 60%` | `#EF4444` | `239, 68, 68` | Error states, warnings, delete actions |
| **Success** | `142 76% 46%` | `#22C55E` | `34, 197, 94` | Success states, confirmations |
| **Ring** | `240 100% 60%` | `#3366FF` | `51, 102, 255` | Focus rings, selection states |

### 3.7 Gradients

| Name | CSS Value | Usage |
|------|-----------|-------|
| **Primary Gradient** | `linear-gradient(135deg, #3366FF 0%, #94A6FF 100%)` | Hero backgrounds, CTA highlights |
| **Background Gradient** | `linear-gradient(180deg, #000000 0%, #0D0D0D 100%)` | Page sections, depth |
| **Text Gradient** | `bg-gradient-to-b from-foreground to-foreground/70` | Display headings, titles |
| **Hero Gradient** | `linear-gradient(135deg, var(--background) 0%, var(--muted)/0.3 50%, var(--background) 100%)` | Animated hero section |

### 3.8 Floating Lines Colors

```javascript
// Gradient colors for FloatingLines effect
linesGradient: ["#1E3A8A", "#3B82F6", "#4F46E5", "#1E1B4B"]
```

---

## 4. Typography

### Font Families

| Role | Family | Fallbacks |
|------|--------|-----------|
| **Primary** | Inter | system-ui, -apple-system, sans-serif |
| **Monospace** | System monospace | Consolas, Monaco, monospace |

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

### Type Scale (Heading Hierarchy)

| Level | Size | Classes | Usage |
|-------|------|---------|-------|
| **Display** | 4.5rem / 72px | `text-7xl` | Hero headlines |
| **H1** | 3rem / 48px | `text-5xl` | Page titles |
| **H2** | 2.25rem / 36px | `text-4xl md:text-6xl` | Section headings |
| **H3** | 1.5rem / 24px | `text-2xl` | Subsections, card titles |
| **H4** | 1.25rem / 20px | `text-xl` | Card titles, labels |
| **Body** | 1rem / 16px | `text-base` | Paragraph text |
| **Small** | 0.875rem / 14px | `text-sm` | Captions, labels |
| **XSmall** | 0.75rem / 12px | `text-xs` | Fine print, badges |

### Heading Styles

```css
/* Display/H1 - Gradient text */
.heading-display {
  @apply text-5xl md:text-7xl font-bold leading-tight;
  @apply bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent;
}

/* Section heading */
.heading-section {
  @apply text-4xl md:text-6xl font-bold mb-6;
  @apply bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent;
}

/* Subtitle */
.subtitle {
  @apply text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed;
}
```

---

## 5. Spacing, Radius & Elevation

### Spacing Scale

Uses Tailwind CSS 4px base unit system:

| Token | Size | Tailwind Class |
|-------|------|----------------|
| 1 | 4px | `p-1`, `m-1` |
| 2 | 8px | `p-2`, `m-2` |
| 3 | 12px | `p-3`, `m-3` |
| 4 | 16px | `p-4`, `m-4` |
| 6 | 24px | `p-6`, `m-6` |
| 8 | 32px | `p-8`, `m-8` |
| 12 | 48px | `p-12`, `m-12` |
| 16 | 64px | `p-16`, `m-16` |
| 20 | 80px | `py-20` |
| 32 | 128px | `py-32` |

### Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| **--radius** | 0.75rem (12px) | Base radius variable |
| `rounded-sm` | calc(var(--radius) - 4px) | Small elements |
| `rounded-md` | calc(var(--radius) - 2px) | Medium elements |
| `rounded-lg` | var(--radius) | Default radius |
| `rounded-xl` | 0.75rem | Cards, badges |
| `rounded-2xl` | 1rem | Large cards, product tiles |
| `rounded-3xl` | 1.5rem | Section cards, main containers |
| `rounded-full` | 9999px | Buttons, pills, avatars |

### Shadow/Elevation Tokens

| Token | CSS Value | Usage |
|-------|-----------|-------|
| **Primary Glow** | `0 20px 40px rgba(96, 102, 255, 0.3)` | Live product hover |
| **Subtle Glow** | `0 20px 40px rgba(255, 255, 255, 0.1)` | Coming Soon hover |
| **Card Shadow** | `0 10px 25px rgba(0, 0, 0, 0.1)` | Elevated cards |
| **Navbar Shadow** | `shadow-lg shadow-black/20` | Fixed navbar |

---

## 6. Components & Patterns

### Buttons

#### Primary CTA Button
```tsx
<Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
  Start Automating
  <ArrowRight className="ml-2 w-5 h-5" />
</Button>
```

| Property | Value |
|----------|-------|
| Background | `hsl(var(--primary))` |
| Text | `hsl(var(--primary-foreground))` |
| Border Radius | `rounded-full` |
| Padding | `px-8 py-4` (large), `px-6 py-2` (default) |
| Font Weight | `font-semibold` |
| Hover | `hover:bg-primary/90 hover:scale-105` |
| Transition | `transition-all duration-300` |

#### Outline Button
```tsx
<Button variant="outline" className="border-border/50 hover:border-primary/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
  Explore Universe
  <ArrowRight className="w-5 h-5 ml-2" />
</Button>
```

#### Button Variants
| Variant | Background | Border | Text |
|---------|------------|--------|------|
| **Default** | `primary` | none | `primary-foreground` |
| **Secondary** | `secondary` | none | `secondary-foreground` |
| **Outline** | transparent | `border-border/50` | `foreground` |
| **Ghost** | transparent | none | `foreground` |
| **Destructive** | `destructive` | none | `destructive-foreground` |

### Navigation (AnimatedNavbar)

Glass-morphism pill navbar with scroll-triggered animations:

| Property | Value |
|----------|-------|
| Background | `bg-black/40 backdrop-blur-xl` |
| Border | `border border-white/10` |
| Border Radius | `rounded-full` |
| Height | `h-14` |
| Shadow | `shadow-lg shadow-black/20` |
| Logo | `h-8 w-auto` |
| Link Style | `text-sm font-medium text-muted-foreground hover:text-foreground` |
| Active Link | `text-primary` with `bg-primary/10 rounded-lg` indicator |

### Cards

#### Glass Card
```tsx
<Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-3xl overflow-hidden">
  <CardHeader className="border-b border-white/5">
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent className="p-8">
    Content here
  </CardContent>
</Card>
```

#### Value Proposition Card
```tsx
<Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
  <CardContent className="p-8">
    <Icon className="w-12 h-12 text-primary mx-auto mb-6" />
    <div className="text-3xl font-bold text-primary mb-2">Value</div>
    <div className="text-sm font-medium mb-3">Label</div>
    <p className="text-xs text-muted-foreground">Description</p>
  </CardContent>
</Card>
```

### Badges

```tsx
// Live status
<Badge variant="default" className="text-xs px-2 py-1">Live</Badge>

// Coming Soon status
<Badge variant="secondary" className="text-xs px-2 py-1">Coming Soon</Badge>

// Feature badge
<Badge className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
  <Sparkles className="w-4 h-4" />
  Feature Label
</Badge>
```

### Form Inputs

```tsx
<Input 
  className="bg-background/50 border-border/50 focus:border-primary"
  placeholder="Placeholder text"
/>

<Textarea 
  className="bg-background/50 border-border/50 focus:border-primary"
  rows={4}
/>
```

### Periodic Table Cards

Grid-based product showcase with status-aware styling:

| State | Border | Background | Text | Shadow |
|-------|--------|------------|------|--------|
| **Live** | `border-primary/40` | `bg-primary/5` | `text-primary` | Blue glow |
| **Live (Hover)** | `border-primary/60` | `bg-primary/10` | `text-primary` | `rgba(96,102,255,0.3)` |
| **Coming Soon** | `border-border/40` | `bg-card/30` | `text-muted-foreground` | White glow |
| **Coming Soon (Hover)** | — | `bg-card/50` | — | `rgba(255,255,255,0.1)` |

### Layout Patterns

#### Hero Section
- Full viewport height consideration
- Centered text with max-width constraints
- Gradient overlay: `bg-gradient-to-br from-primary/10 via-transparent to-background`
- Padding: `pt-48 pb-32`

#### Section Container
```tsx
<section className="py-32 relative">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

#### Content Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Grid items */}
</div>
```

---

## 7. Imagery & Iconography

### Icon Style

- **Library:** Lucide React
- **Size Scale:** `w-4 h-4` (small), `w-5 h-5` (default), `w-12 h-12` (large)
- **Color:** Inherits from parent or uses `text-primary`
- **Stroke Width:** Default (typically 2px)

### Commonly Used Icons

| Icon | Usage |
|------|-------|
| `ArrowRight` | CTAs, navigation arrows |
| `ExternalLink` | External link indicators |
| `Sparkles` | Feature highlights, special badges |
| `Zap` | Speed, efficiency metrics |
| `Target` | Goals, task reduction |
| `TrendingUp` | Growth, conversions |
| `Clock` | Time-related features |
| `CheckCircle` | Success, completed items |
| `Check` | List items, confirmations |
| `Copy` | Copy to clipboard |
| `Download` | Download actions |
| `Palette`, `Type`, `Layout`, `Image`, `MessageSquare`, `FileText` | Brand kit tab icons |

### Visual Effects

| Effect | Description | Implementation |
|--------|-------------|----------------|
| **Beams** | 3D animated light beams | Three.js WebGL shader |
| **FloatingLines** | Interactive wave lines | Three.js orthographic camera |
| **SplashCursor** | Ripple effect on click | CSS animation with WebGL |
| **Glass-morphism** | Frosted glass appearance | `backdrop-blur-sm bg-opacity-*` |

### Example Assets

- `attached_assets/white_1749151126542.png` — Primary logo (white)
- `attached_assets/dovito logo_color-pos_1749151126542.png` — Color logo
- `attached_assets/1024-app-icon_1749575157884.png` — App icon
- `attached_assets/Screenshot 2025-06-06 at 12.03.42_1749233039038.png` — UI screenshot
- `attached_assets/Screenshot 2025-06-10 at 11.05.42_1749575146189.png` — App screenshot

---

## 8. Tone of Voice & Copy Examples

### Tone Guidelines

- **Confident yet friendly** — Expertise without arrogance
- **Clear and concise** — Direct language that respects time
- **Results-focused** — Always tie features to outcomes
- **Empowering** — Enable action, don't overwhelm
- **Human** — Acknowledge the people behind the processes

### Do's

- Use clear, actionable language
- Focus on outcomes and results
- Be concise and direct
- Emphasize transformation and growth
- Use inclusive language

### Don'ts

- Use excessive jargon without explanation
- Over-promise or use hyperbole
- Sound robotic or impersonal
- Use negative or fear-based messaging
- Ignore the human element of automation

### Example Headlines

```
"Start Automating Today"
"Transformational SaaS"
"The Dovito Universe"
"Ready to Transform?"
"Automation That Delivers Results"
```

### Example Subtitles

```
"AI-powered business automation that delivers measurable ROI in 90 days or less."

"A growing ecosystem of automation tools designed to transform business operations."

"Measurable results that transform your business operations."

"Ready to start a new automation project or see our existing solutions in action? Let's discuss your needs."
```

### Example CTAs

```
"Start Automating" (primary)
"Explore Universe" (secondary)
"Schedule Free Consultation"
"Get Started"
```

### Value Propositions

| Metric | Label | Description |
|--------|-------|-------------|
| 25-40% | Task Reduction | Eliminate manual work |
| 15-30% | Conversion Boost | Improve lead-to-close |
| $15K-$50K | Monthly Savings | Direct cost reduction |
| 90-Day | Impactful Results | Impactful results for real people |

### Positioning Statement

> "For forward-thinking businesses seeking to optimize operations, Dovito.ai is the automation partner that combines cutting-edge AI with intuitive design, delivering measurable results without complexity."

### Elevator Pitch

> "Dovito.ai transforms how businesses operate by automating complex workflows with AI. From document processing to customer communications, we help organizations save time, reduce errors, and scale efficiently—without the complexity of traditional automation tools."

---

## 9. Animations & Interactions

### Timing Functions

| Name | Value | Usage |
|------|-------|-------|
| **Default** | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| **Navbar Ease** | `cubic-bezier(0.33, 1, 0.68, 1)` | Smooth navbar animations |
| **Spring** | `type: "spring", stiffness: 100` | Entry animations |

### Standard Durations

| Duration | Usage |
|----------|-------|
| 200ms | Micro-interactions |
| 300ms | Quick transitions |
| 500ms | Standard animations |
| 600ms | Navbar animations |
| 800ms | Entry animations |

### Hover States

- **Scale:** `hover:scale-105` (buttons, cards)
- **Lift:** `whileHover={{ y: -8 }}` (product cards)
- **Background:** `hover:bg-primary/90`, `hover:bg-card/80`
- **Border:** `hover:border-primary/60`

### Entry Animations

```tsx
// Fade up
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, ease: "easeOut" }}

// Scale in
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ type: "spring", stiffness: 100 }}

// Staggered
transition={{ delay: index * 0.1, duration: 0.6 }}
```

---

## 10. Technical Specifications

### CSS Custom Properties (Complete)

```css
:root {
  --background: 0 0% 0%;
  --foreground: 0 0% 98%;
  --muted: 0 0% 5%;
  --muted-foreground: 0 0% 65%;
  --popover: 0 0% 3%;
  --popover-foreground: 0 0% 98%;
  --card: 0 0% 3%;
  --card-foreground: 0 0% 98%;
  --border: 0 0% 10%;
  --input: 0 0% 10%;
  --primary: 240 100% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 8%;
  --secondary-foreground: 0 0% 98%;
  --accent: 0 0% 8%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --ring: 240 100% 60%;
  --radius: 0.75rem;
}
```

### Key Files

| File | Purpose |
|------|---------|
| `client/src/index.css` | Global styles, CSS variables, animations |
| `tailwind.config.ts` | Tailwind theme extensions, colors |
| `client/src/components/BeamStyleLanding.tsx` | Main landing page |
| `client/src/pages/BrandKit.tsx` | Brand guidelines page |
| `client/src/components/ui/*.tsx` | shadcn/ui components |

---

## 11. Contact

For brand asset requests and guidelines questions:

- **Email:** brand@dovito.ai
- **Website:** dovito.ai

---

*© 2024 Dovito.ai. All brand assets are property of Dovito.ai.*
