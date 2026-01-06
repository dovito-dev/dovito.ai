# Brand Kit Page Extraction

---

## Recent Changes (January 2026)

### Site Architecture Updates
- **Multi-page structure**: Site now has three main routes: `/` (Home), `/about` (About Us), `/connect` (Connect/Contact)
- **Navigation updates**: All pages share consistent navbar with links to Home, About Us, and Connect
- **CTA routing**: "Get Started" buttons route to `/connect` page

### Visual Effect Updates
- **Splash cursor auto-hide**: The splash cursor effect automatically turns off when scrolling past the hero section and reactivates when scrolling back up. Implemented via `isInHero` state tracking.
- **Beams background swap**: Home page now has beams animation on "Ready to Transform?" section with footer; Connect page has solid bg-muted background for "Ready to Get Started?" section with solid #1a365d footer
- **Ribbon dividers**: Full-width ribbon banners with #1a365d background and white text used as section separators (e.g., on Connect page above contact form)

### Component Behavior
- **Scroll-based state management**: `isInHero` state tracks scroll position relative to viewport height for conditional rendering
- **Navbar collapse**: Consistent across all pages - collapses when scrolling down, expands when scrolling up

---

## Component Overview

The **Brand Kit** page is a comprehensive brand guidelines portal for Dovito.ai, providing designers, developers, and partners with all assets and specifications needed to represent the brand consistently. It's accessible via the `/brand-kit` route.

**Key behaviors:**
- **Tabbed navigation**: Six content tabs (Strategy, Logo, Colors, Typography, Components, Voice & Tone) for organized access to brand assets
- **Interactive color swatches**: Click-to-copy functionality for color values
- **Scroll-triggered navbar**: Same animated pill navbar as the main landing page with collapse/expand behavior
- **Light theme design**: Clean white/gray background with soft shadows (different from dark main site)

**Main components on this page:**
- **AnimatedNavbar** — Fixed header with logo, nav links, and CTA with scroll-triggered collapse
- **HeroSection** — Gradient header with page title and description
- **TabsContainer** — Six-tab navigation system for content sections
- **StrategyTab** — Mission, vision, values, and brand positioning content
- **LogoTab** — Logo variations and usage guidelines
- **ColorsTab** — Full color palette with interactive swatches and gradients
- **TypographyTab** — Font family, weights, and type scale reference
- **ComponentsTab** — Button variants, card styles, and border radius
- **VoiceTab** — Brand voice, do's/don'ts, and sample messaging
- **ColorSwatch** — Reusable color swatch component with copy functionality
- **PageFooter** — Brand contact information and copyright

---

## Brand Kit Page CSS and Styling

### Page Layout

```css
/* Root container */
.brand-kit-page {
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Main content area */
.main-content {
  max-width: 72rem; /* max-w-6xl */
  margin: 0 auto;
  padding: 3rem 1.5rem; /* py-12 px-6 */
}
```

### Header Gradient

```css
/* Hero header gradient */
.brand-kit-header {
  background: linear-gradient(180deg, #0f2744 0%, #1a3a5c 30%, #2a5070 60%, #3d6585 100%);
  color: white;
  padding-top: 7rem; /* pt-28 for navbar space */
  padding-bottom: 4rem; /* pb-16 */
  position: relative;
  overflow: hidden;
}

/* Decorative blurs */
.header-blur-1 {
  position: absolute;
  top: 5rem;
  right: 5rem;
  width: 24rem;
  height: 24rem;
  background: linear-gradient(to bottom right, rgba(255,255,255,0.1), transparent);
  border-radius: 9999px;
  filter: blur(48px);
  transform: rotate(45deg);
}

.header-blur-2 {
  position: absolute;
  bottom: 0;
  left: 10rem;
  width: 16rem;
  height: 16rem;
  background: linear-gradient(to top right, rgba(255,255,255,0.05), transparent);
  border-radius: 9999px;
  filter: blur(32px);
}
```

### Navigation

```css
/* Navigation container */
.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding-top: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* Inner nav wrapper */
.nav-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
}

/* Logo */
.nav-logo {
  height: 2rem;
  width: auto;
}

/* Nav links */
.nav-link {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: all 0.3s;
}

.nav-link-inactive {
  color: rgba(255, 255, 255, 0.7);
}

.nav-link-inactive:hover {
  color: white;
}

.nav-link-active {
  color: white;
}

/* Pill background */
.nav-pill {
  position: absolute;
  inset: -0.25rem 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  z-index: -10;
}

/* Logo pill (appears on scroll) */
.logo-pill {
  position: absolute;
  inset: -0.5rem -1rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  z-index: -10;
}
```

### Tabs

```css
/* Tab bar container */
.tab-bar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Tab button */
.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button-inactive {
  color: #6b7280;
}

.tab-button-inactive:hover {
  color: #111827;
  background: #f3f4f6;
}

.tab-button-active {
  background: rgba(63, 185, 255, 0.1);
  color: #3fb9ff;
}
```

### Cards

```css
/* Standard card */
.brand-card {
  background: white;
  border-radius: 1rem; /* rounded-2xl */
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Card content */
.brand-card-content {
  padding: 1.5rem;
}

/* Section title (cyan accent) */
.section-title {
  color: #3fb9ff;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

/* Featured card (cyan border) */
.featured-card {
  border: 2px solid #3fb9ff;
  border-radius: 1rem;
}

/* Do's card */
.dos-card {
  border-left: 4px solid #22c55e;
}

/* Don'ts card */
.donts-card {
  border-left: 4px solid #ef4444;
}
```

### Color Swatch Component

```css
/* Color swatch container */
.color-swatch {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Color preview block */
.color-preview {
  height: 5rem;
}

/* Swatch content */
.swatch-content {
  padding: 1rem;
}

/* Color name */
.color-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

/* Hex value */
.color-hex {
  font-family: monospace;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Color role/usage */
.color-role {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}
```

### Buttons

```css
/* Primary CTA */
.btn-primary {
  background: #3fb9ff;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: rgba(63, 185, 255, 0.9);
}

/* Secondary/Outline */
.btn-secondary {
  background: transparent;
  border: 1px solid #1a365d;
  color: #1a365d;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: #1a365d;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
}

/* Inverted (for dark backgrounds) */
.btn-inverted {
  background: white;
  color: #1a365d;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
}
```

### Footer

```css
/* Brand Kit footer */
.brand-kit-footer {
  background: #001f3f;
  color: white;
  padding: 2rem 0;
  margin-top: 3rem;
  text-align: center;
}

.footer-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}
```

---

## Brand Color System

### Primary Colors

| Name | Hex | HSL | RGB | Usage |
|------|-----|-----|-----|-------|
| Primary Deep Blue | #1a365d | 210 55% 23% | 26, 54, 93 | Primary actions, links, text on light backgrounds |
| Primary Steel Blue | #4682b4 | 207 44% 49% | 70, 130, 180 | Beams effect, accents, focus rings |
| Secondary Cyan | #3fb9ff | 199 100% 62% | 63, 185, 255 | Primary CTAs, buttons, highlights |

### Background Colors - Light Mode

| Name | Hex | HSL | RGB | Usage |
|------|-----|-----|-----|-------|
| Background White | #ffffff | 0 0% 100% | 255, 255, 255 | Main page backgrounds |
| Card White | #ffffff | 0 0% 100% | 255, 255, 255 | Cards on light backgrounds |
| Muted Light | #f5f7fa | 210 10% 96% | 245, 247, 250 | Subtle background variations |
| Brand Kit Background | #f0f2f5 | 210 11% 95% | 240, 242, 245 | Brand kit page background |

### Background Colors - Dark Mode

| Name | Hex | HSL | RGB | Usage |
|------|-----|-----|-----|-------|
| Background Navy | #001f3f | 210 100% 12% | 0, 31, 63 | Dark section backgrounds, footer |
| Card Charcoal | #2a3a4a | 210 16% 18% | 42, 58, 74 | Cards on dark backgrounds |
| Muted Dark | #2d3a45 | 210 16% 22% | 45, 58, 69 | Secondary dark backgrounds |
| Hero Overlay | rgba(0,0,0,0.6) | — | — | Hero section overlay |

### Gradients

| Name | CSS | Usage |
|------|-----|-------|
| Hero Gradient | `linear-gradient(180deg, #0f2744 0%, #1a3a5c 30%, #2a5070 60%, #3d6585 100%)` | Hero section background |
| Beams Container | `linear-gradient(180deg, #0a1929 0%, #1a365d 100%)` | Beams effect container (home page) |
| Primary Gradient | `linear-gradient(135deg, #1a365d 0%, #4682b4 100%)` | CTA highlights, accents |

---

## Typography

### Font Family

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Import

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

### Type Scale

| Level | Size | Tailwind Classes | Usage |
|-------|------|------------------|-------|
| Display | 4.5rem / 72px | text-7xl | Hero headlines |
| H1 | 3rem / 48px | text-5xl | Page titles |
| H2 | 2.25rem / 36px | text-4xl | Section headings |
| H3 | 1.5rem / 24px | text-2xl | Subsections |
| Body | 1rem / 16px | text-base | Paragraph text |
| Small | 0.875rem / 14px | text-sm | Captions, labels |

### Font Weights

| Name | Value | Usage |
|------|-------|-------|
| Light | 300 | Subtle text, captions |
| Regular | 400 | Body text, paragraphs |
| Medium | 500 | Labels, navigation |
| Semibold | 600 | Subheadings, emphasis |
| Bold | 700 | Headings, titles |

---

## Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| rounded-lg | 0.5rem | Buttons, small elements |
| rounded-xl | 0.75rem | Medium elements |
| rounded-2xl | 1rem | Cards, larger containers |
| rounded-full | 9999px | Pills, circular buttons |

---

## Animation Specifications

### Navbar Scroll Animation

```typescript
// Logo slides left on collapse
animate={{ x: navbarCollapsed ? -24 : 0 }}
transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}

// Nav links fade out on collapse
animate={{ 
  opacity: navbarCollapsed ? 0 : 1, 
  pointerEvents: navbarCollapsed ? "none" : "auto" 
}}
transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}

// CTA slides right on collapse
animate={{ x: navbarCollapsed ? 24 : 0 }}
transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}

// Pill backgrounds fade/scale
animate={{ 
  opacity: navbarCollapsed ? 0 : 1, 
  scaleX: navbarCollapsed ? 0.95 : 1 
}}
transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}

// Logo pill appears on collapse
animate={{ 
  opacity: navbarCollapsed ? 1 : 0, 
  scale: navbarCollapsed ? 1 : 0.9 
}}
transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
```

### Scroll Threshold

```typescript
const scrollThreshold = 100; // pixels before navbar collapses

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > scrollThreshold) {
      if (currentScrollY > lastScrollY.current) {
        setNavbarCollapsed(true);  // Scrolling down
      } else {
        setNavbarCollapsed(false); // Scrolling up
      }
    } else {
      setNavbarCollapsed(false);   // Near top
    }
    
    lastScrollY.current = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| react | Core React library |
| wouter | Lightweight routing (Link component) |
| framer-motion | Animation library (motion.div) |
| lucide-react | Icon library (Copy, Check, FileText, etc.) |
| @/components/ui/button | shadcn/ui Button component |
| @/components/ui/card | shadcn/ui Card, CardContent |
| tailwindcss | Utility-first CSS framework |

---

## Component Checklist

- [x] Six-tab navigation with icons
- [x] Interactive color swatches with copy
- [x] Scroll-triggered navbar animation
- [x] Light theme design
- [x] Gradient header
- [x] Typography reference table
- [x] Button variants showcase
- [x] Card styles showcase
- [x] Border radius reference
- [x] Voice & tone guidelines
- [x] Logo usage do's and don'ts
- [x] Brand personality badges

---

## File Location

`client/src/pages/BrandKit.tsx`
