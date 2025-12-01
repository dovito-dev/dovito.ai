# AnimatedNavbar Extraction

---

## Component Overview

The **AnimatedNavbar** is a fixed-position navigation bar located at the header of the landing page. It features a distinctive "pill" shape with a glass-morphism background that transforms based on scroll behavior.

**Key behaviors:**
- **Scroll-triggered collapse/expand**: When the user scrolls down past 100px, the navbar collapses—the center navigation links fade out while the logo slides left and the CTA button slides right. Scrolling up reverses this animation.
- **Glass-morphism styling**: Semi-transparent black background with blur effect and subtle border.
- **Active section tracking**: Navigation links highlight based on the current scroll position.
- **Smooth Framer Motion animations**: All transitions use a custom cubic-bezier easing curve for natural, polished motion.
- **Responsive behavior**: Center navigation links are hidden on mobile (below `md` breakpoint), showing only logo and CTA.

---

## Component Structure

- **Root Container** (`div.fixed`) — Fixed positioning wrapper that keeps navbar at top of viewport
  - **Inner Container** (`div.max-w-7xl`) — Centers content with max-width constraint and flex layout
    - **Logo Section** (`motion.div`) — Animated wrapper that slides left on collapse
      - **Logo Button** (`button`) — Clickable element for scroll-to-top
        - **Logo Image** (`img`) — Brand logo displayed at h-8 height
    - **Center Nav Links** (`motion.div`) — Animated container that fades out on collapse
      - **Nav Item Buttons** (`button[]`) — Individual navigation links with active state indicator
        - **Label Text** — Button text content
        - **Active Indicator** (`div`) — Absolutely-positioned highlight background for active item
    - **CTA Section** (`motion.div`) — Animated wrapper that slides right on collapse
      - **CTA Button** (`Button`) — Primary call-to-action with icon
        - **Button Text** — "Get Started" label
        - **Arrow Icon** (`ArrowRight`) — Lucide icon indicating action
    - **Pill Background** (`motion.div`) — Absolutely-positioned glass-morphism background layer

---

## Dependencies Required

| Dependency | Purpose |
|------------|---------|
| `react` | Core React library for component creation and hooks (useState, useEffect, useRef) |
| `framer-motion` | Animation library for motion.div components and declarative animations |
| `lucide-react` | Icon library providing ArrowRight icon for CTA button |
| `@/components/ui/button` | shadcn/ui Button component (or equivalent styled button) |
| `tailwindcss` | Utility-first CSS framework for all styling |

### Installation Commands

```bash
# Using npm
npm install framer-motion lucide-react

# Using pnpm
pnpm add framer-motion lucide-react

# shadcn/ui Button (if not already installed)
npx shadcn-ui@latest add button
```

---

## CSS Custom Properties and Design Tokens

Add these CSS custom properties to your global stylesheet (e.g., `index.css` or `globals.css`):

```css
:root {
  /* Core colors */
  --background: 0 0% 0%;           /* #000000 - Page background */
  --foreground: 0 0% 98%;          /* #FAFAFA - Primary text color */
  --muted-foreground: 0 0% 65%;    /* #A6A6A6 - Secondary/inactive text */
  
  /* Brand colors */
  --primary: 240 100% 60%;         /* #3333FF - Primary brand blue */
  --primary-foreground: 0 0% 100%; /* #FFFFFF - Text on primary */
  
  /* UI colors */
  --border: 0 0% 10%;              /* #1A1A1A - Border color */
}
```

### Token Usage Reference

| Token | Purpose |
|-------|---------|
| `--background` | Page background color |
| `--foreground` | Primary text, logo, headings |
| `--muted-foreground` | Inactive nav link text |
| `--primary` | Active nav link text, CTA button background, active indicator |
| `--primary-foreground` | CTA button text color |
| `--border` | Not directly used in navbar, but part of system |

### Hardcoded Color Values

| Value | Usage |
|-------|-------|
| `black/40` | Pill background (40% opacity black) |
| `white/10` | Pill border (10% opacity white) |
| `black/20` | Pill shadow color |

---

## Styles and Classes Reference

### Layout Wrappers

| Element | Classes | Purpose |
|---------|---------|---------|
| Root container | `fixed top-0 left-0 right-0 z-50 pt-4 px-6 lg:px-8` | Fixed header positioning with padding |
| Inner container | `max-w-7xl mx-auto px-6 relative flex justify-between items-center h-14` | Centered content, flex layout, fixed height |

### Logo Section

| Element | Classes | Purpose |
|---------|---------|---------|
| Logo wrapper | `flex items-center z-10` | Flex alignment, z-index above pill |
| Logo button | `block` | Block-level clickable area |
| Logo image | `h-8 w-auto` | Fixed height, auto width ratio |

### Navigation Links

| Element | Classes | Purpose |
|---------|---------|---------|
| Nav container | `hidden md:flex items-center space-x-6` | Hidden on mobile, flex on desktop, spacing |
| Nav button (base) | `relative px-3 py-1.5 text-sm font-medium transition-all duration-300` | Base styling for all nav items |
| Nav button (active) | `text-primary` | Active state color |
| Nav button (inactive) | `text-muted-foreground hover:text-foreground` | Inactive with hover state |
| Active indicator | `absolute inset-0 bg-primary/10 rounded-lg` | Highlight background for active item |

### CTA Button

| Element | Classes | Purpose |
|---------|---------|---------|
| CTA wrapper | `z-10` | Z-index above pill background |
| CTA button | `bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium transition-all duration-300` | Primary button styling |
| Arrow icon | `ml-2 w-4 h-4` | Icon spacing and size |

### Pill Background

| Element | Classes | Purpose |
|---------|---------|---------|
| Pill | `absolute -inset-x-0 -top-1 -bottom-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-lg shadow-black/20 -z-10` | Glass-morphism background layer |

---

## Animation and Interaction Specifications

### Scroll Behavior Logic

```typescript
const scrollThreshold = 100; // pixels

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > scrollThreshold) {
      if (currentScrollY > lastScrollY.current) {
        // Scrolling DOWN → Collapse
        setNavbarCollapsed(true);
      } else {
        // Scrolling UP → Expand
        setNavbarCollapsed(false);
      }
    } else {
      // Near top → Always expanded
      setNavbarCollapsed(false);
    }

    lastScrollY.current = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### Framer Motion Animations

#### Logo Animation

```typescript
<motion.div
  initial={false}
  animate={{ x: navbarCollapsed ? -24 : 0 }}
  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
>
```

#### Nav Links Animation

```typescript
<motion.div
  initial={false}
  animate={{
    opacity: navbarCollapsed ? 0 : 1,
    pointerEvents: navbarCollapsed ? "none" : "auto"
  }}
  transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
>
```

#### CTA Animation

```typescript
<motion.div
  initial={false}
  animate={{ x: navbarCollapsed ? 24 : 0 }}
  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
>
```

#### Pill Background Animation

```typescript
<motion.div
  initial={false}
  animate={{
    opacity: navbarCollapsed ? 0 : 1,
    scaleX: navbarCollapsed ? 0.95 : 1,
  }}
  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
/>
```

### Animation Parameters Summary

| Element | Property | Expanded | Collapsed | Duration | Easing |
|---------|----------|----------|-----------|----------|--------|
| Logo | `x` | `0` | `-24` | 0.6s | `[0.33, 1, 0.68, 1]` |
| Nav Links | `opacity` | `1` | `0` | 0.4s | `[0.33, 1, 0.68, 1]` |
| Nav Links | `pointerEvents` | `"auto"` | `"none"` | — | — |
| CTA | `x` | `0` | `24` | 0.6s | `[0.33, 1, 0.68, 1]` |
| Pill BG | `opacity` | `1` | `0` | 0.5s | `[0.33, 1, 0.68, 1]` |
| Pill BG | `scaleX` | `1` | `0.95` | 0.5s | `[0.33, 1, 0.68, 1]` |

### Custom Easing Curve

The easing `[0.33, 1, 0.68, 1]` is a custom cubic-bezier curve that provides:
- Fast start with smooth deceleration
- Natural, polished feel similar to Apple's animations
- Consistent timing across all animated elements

---

## Data Model and Props

### NavItem Interface

```typescript
interface NavItem {
  id: string;    // Unique identifier, used for scroll targeting and active state
  label: string; // Display text for the navigation link
}
```

### AnimatedNavbar Props Interface

```typescript
interface AnimatedNavbarProps {
  /** Path to logo image (required) */
  logo: string;
  
  /** Alt text for logo image */
  logoAlt?: string;
  
  /** Array of navigation items to display */
  navItems?: NavItem[];
  
  /** Currently active section ID for highlighting */
  activeSection?: string;
  
  /** Text to display on CTA button */
  ctaText?: string;
  
  /** Icon to display after CTA text */
  ctaIcon?: React.ReactNode;
  
  /** Callback when navigation item is clicked */
  onNavClick?: (sectionId: string) => void;
  
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
  
  /** Callback when logo is clicked (alternative to homeHref) */
  onLogoClick?: () => void;
  
  /** Link href for logo click (uses Link component) */
  homeHref?: string;
}
```

### Props Reference Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logo` | `string` | — | Path to logo image file (required) |
| `logoAlt` | `string` | `"Logo"` | Accessible alt text for logo |
| `navItems` | `NavItem[]` | `[]` | Navigation items to render |
| `activeSection` | `string` | `""` | ID of currently active section |
| `ctaText` | `string` | `"Get Started"` | CTA button label |
| `ctaIcon` | `ReactNode` | `<ArrowRight />` | Icon element after CTA text |
| `onNavClick` | `(id: string) => void` | — | Handler for nav item clicks |
| `onCtaClick` | `() => void` | — | Handler for CTA button click |
| `onLogoClick` | `() => void` | — | Handler for logo click |
| `homeHref` | `string` | `"/"` | URL for logo link |

---

## Complete Component Code

```tsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  id: string;
  label: string;
}

interface AnimatedNavbarProps {
  logo: string;
  logoAlt?: string;
  navItems?: NavItem[];
  activeSection?: string;
  ctaText?: string;
  ctaIcon?: React.ReactNode;
  onNavClick?: (sectionId: string) => void;
  onCtaClick?: () => void;
  onLogoClick?: () => void;
  homeHref?: string;
}

export default function AnimatedNavbar({
  logo,
  logoAlt = "Logo",
  navItems = [],
  activeSection = "",
  ctaText = "Get Started",
  ctaIcon = <ArrowRight className="ml-2 w-4 h-4" />,
  onNavClick,
  onCtaClick,
  onLogoClick,
  homeHref,
}: AnimatedNavbarProps) {
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;

      if (currentScrollY > scrollThreshold) {
        if (currentScrollY > lastScrollY.current) {
          setNavbarCollapsed(true);
        } else {
          setNavbarCollapsed(false);
        }
      } else {
        setNavbarCollapsed(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavItemClick = (sectionId: string) => {
    if (onNavClick) {
      onNavClick(sectionId);
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-6 relative flex justify-between items-center h-14">
        {/* Logo - slides to left edge on collapse */}
        <motion.div
          className="flex items-center z-10"
          initial={false}
          animate={{ x: navbarCollapsed ? -24 : 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          {homeHref ? (
            <a href={homeHref} className="block">
              <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            </a>
          ) : (
            <button onClick={handleLogoClick} className="block">
              <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            </button>
          )}
        </motion.div>

        {/* Center Nav Links - fade out on collapse */}
        {navItems.length > 0 && (
          <motion.div
            className="hidden md:flex items-center space-x-6"
            initial={false}
            animate={{
              opacity: navbarCollapsed ? 0 : 1,
              pointerEvents: navbarCollapsed ? "none" : "auto",
            }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute inset-0 bg-primary/10 rounded-lg" />
                )}
              </button>
            ))}
          </motion.div>
        )}

        {/* CTA - slides to right edge on collapse */}
        <motion.div
          className="z-10"
          initial={false}
          animate={{ x: navbarCollapsed ? 24 : 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <Button
            onClick={onCtaClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium transition-all duration-300"
          >
            {ctaText}
            {ctaIcon}
          </Button>
        </motion.div>

        {/* Pill Background - glass-morphism effect, fades and scales on collapse */}
        <motion.div
          className="absolute -inset-x-0 -top-1 -bottom-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-lg shadow-black/20 -z-10"
          initial={false}
          animate={{
            opacity: navbarCollapsed ? 0 : 1,
            scaleX: navbarCollapsed ? 0.95 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        />
      </div>
    </div>
  );
}
```

---

## Usage Example

```tsx
import { useState, useEffect } from "react";
import AnimatedNavbar from "@/components/AnimatedNavbar";
import logo from "@/assets/logo.png";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  // Track active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedNavbar
        logo={logo}
        logoAlt="My Brand"
        navItems={navItems}
        activeSection={activeSection}
        ctaText="Get Started"
        onNavClick={scrollToSection}
        onCtaClick={() => scrollToSection("contact")}
        onLogoClick={() => scrollToSection("home")}
      />

      {/* Page sections */}
      <section id="home" className="min-h-screen pt-20">
        {/* Hero content */}
      </section>
      <section id="products" className="min-h-screen">
        {/* Products content */}
      </section>
      <section id="about" className="min-h-screen">
        {/* About content */}
      </section>
      <section id="contact" className="min-h-screen">
        {/* Contact content */}
      </section>
    </div>
  );
}

export default App;
```

---

## Design Notes and Behavior

### Visual Style

- **Glass-morphism**: The pill background uses `bg-black/40` with `backdrop-blur-xl` to create a frosted glass effect that allows content behind to show through with blur.
- **Subtle borders**: `border-white/10` provides a barely-visible edge that adds depth without harsh lines.
- **Soft shadows**: `shadow-lg shadow-black/20` creates depth without being overpowering on dark backgrounds.
- **Primary accent**: Active states and CTA use the primary blue color for brand consistency.

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< `md`) | Center nav links hidden, only logo and CTA visible |
| Desktop (≥ `md`) | Full navbar with all elements visible |

The collapse animation works identically across all breakpoints.

### Accessibility Considerations

- **Semantic buttons**: Navigation items use `<button>` elements for keyboard accessibility
- **Alt text**: Logo image includes configurable `alt` attribute via `logoAlt` prop
- **Pointer events**: When nav links are hidden, `pointerEvents: "none"` prevents accidental clicks
- **Focus states**: Native button focus styles are preserved (can be enhanced with `focus-visible` utilities)

**Recommended enhancements:**
- Add `aria-current="page"` to active nav item
- Add skip-to-content link before navbar
- Ensure sufficient color contrast for text on glass background

---

## Scope and IDs/Classes Summary

### Classes Used by AnimatedNavbar

**Layout:**
- `fixed`, `top-0`, `left-0`, `right-0`, `z-50`
- `pt-4`, `px-6`, `lg:px-8`
- `max-w-7xl`, `mx-auto`, `relative`
- `flex`, `justify-between`, `items-center`, `h-14`

**Logo section:**
- `flex`, `items-center`, `z-10`
- `block`
- `h-8`, `w-auto`

**Nav links:**
- `hidden`, `md:flex`, `space-x-6`
- `relative`, `px-3`, `py-1.5`, `text-sm`, `font-medium`
- `transition-all`, `duration-300`
- `text-primary`, `text-muted-foreground`, `hover:text-foreground`
- `absolute`, `inset-0`, `bg-primary/10`, `rounded-lg`

**CTA button:**
- `z-10`
- `bg-primary`, `hover:bg-primary/90`, `text-primary-foreground`
- `px-6`, `py-2`, `rounded-full`, `font-medium`
- `ml-2`, `w-4`, `h-4`

**Pill background:**
- `absolute`, `-inset-x-0`, `-top-1`, `-bottom-1`
- `bg-black/40`, `backdrop-blur-xl`
- `border`, `border-white/10`, `rounded-full`
- `shadow-lg`, `shadow-black/20`
- `-z-10`

### Confirmation

✅ **All listed classes and selectors belong exclusively to AnimatedNavbar.**

❌ **No navbar, footer, page shell, or other section selectors are included.**

---

## Dependencies Checklist

Before using this component, ensure you have:

- [ ] React 18+ installed
- [ ] Tailwind CSS configured with the documented custom properties
- [ ] `framer-motion` installed
- [ ] `lucide-react` installed
- [ ] shadcn/ui Button component (or equivalent)
- [ ] Logo image asset available at the specified path
