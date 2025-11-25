# Animated Navbar Component Extraction

Complete extraction of the animated pill-shaped navbar with scroll-based collapse/expand behavior, glass-morphism styling, and Framer Motion animations.

---

## Component Structure

```
AnimatedNavbar
├── Outer Container (fixed positioning)
│   └── Inner Container (max-width, flex layout)
│       ├── Logo Section (motion.div - slides left on collapse)
│       │   └── Logo Image/Button
│       ├── Center Nav Links (motion.div - fades out on collapse)
│       │   └── Nav Items (buttons with active state indicator)
│       ├── CTA Button (motion.div - slides right on collapse)
│       │   └── Button with icon
│       └── Pill Background (motion.div - scales/fades on collapse)
```

---

## Dependencies Required

| Dependency | Purpose |
|------------|---------|
| `framer-motion` | Animations (motion.div, animate, transition) |
| `lucide-react` | ArrowRight icon for CTA |
| `wouter` or `react-router` | Link component (optional, for routing) |
| Tailwind CSS | All styling |
| shadcn/ui Button | CTA button component |

### Installation

```bash
npm install framer-motion lucide-react
```

---

## CSS Custom Properties (Required)

Add these to your global CSS file (e.g., `index.css`):

```css
:root {
  --background: 0 0% 0%;
  --foreground: 0 0% 98%;
  --muted-foreground: 0 0% 65%;
  --primary: 240 100% 60%;
  --primary-foreground: 0 0% 100%;
  --border: 0 0% 10%;
}
```

---

## Tailwind Classes Reference

| Element | Classes |
|---------|---------|
| **Outer container** | `fixed top-0 left-0 right-0 z-50 pt-4 px-6 lg:px-8` |
| **Inner container** | `max-w-7xl mx-auto px-6 relative flex justify-between items-center h-14` |
| **Logo wrapper** | `flex items-center z-10` |
| **Logo button** | `block` |
| **Logo image** | `h-8 w-auto` |
| **Nav links container** | `hidden md:flex items-center space-x-6` |
| **Nav link button** | `relative px-3 py-1.5 text-sm font-medium transition-all duration-300` |
| **Nav link (active)** | `text-primary` |
| **Nav link (inactive)** | `text-muted-foreground hover:text-foreground` |
| **Active indicator** | `absolute inset-0 bg-primary/10 rounded-lg` |
| **CTA wrapper** | `z-10` |
| **CTA button** | `bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium transition-all duration-300` |
| **Pill background** | `absolute -inset-x-0 -top-1 -bottom-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-lg shadow-black/20 -z-10` |

---

## Animation Specifications

### Framer Motion Animations

| Element | Property | Expanded State | Collapsed State | Duration | Easing |
|---------|----------|----------------|-----------------|----------|--------|
| **Logo** | `x` | `0` | `-24` | 0.6s | `[0.33, 1, 0.68, 1]` |
| **Nav Links** | `opacity` | `1` | `0` | 0.4s | `[0.33, 1, 0.68, 1]` |
| **Nav Links** | `pointerEvents` | `"auto"` | `"none"` | — | — |
| **CTA** | `x` | `0` | `24` | 0.6s | `[0.33, 1, 0.68, 1]` |
| **Pill BG** | `opacity` | `1` | `0` | 0.5s | `[0.33, 1, 0.68, 1]` |
| **Pill BG** | `scaleX` | `1` | `0.95` | 0.5s | `[0.33, 1, 0.68, 1]` |

### Easing Function

The custom easing `[0.33, 1, 0.68, 1]` is a smooth ease-out curve that provides a natural deceleration effect.

---

## Scroll Behavior Logic

```typescript
const scrollThreshold = 100;

if (currentScrollY > scrollThreshold) {
  if (currentScrollY > lastScrollY) {
    // Scrolling DOWN → Collapse navbar
    setNavbarCollapsed(true);
  } else {
    // Scrolling UP → Expand navbar
    setNavbarCollapsed(false);
  }
} else {
  // Near top of page → Always expanded
  setNavbarCollapsed(false);
}

lastScrollY = currentScrollY;
```

---

## Complete Component Code

```tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  homeHref = "/",
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-6 relative flex justify-between items-center h-14">
        {/* Logo - slides to left edge */}
        <motion.div
          className="flex items-center z-10"
          initial={false}
          animate={{ x: navbarCollapsed ? -24 : 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          {homeHref ? (
            <Link href={homeHref} className="block">
              <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            </Link>
          ) : (
            <button onClick={onLogoClick} className="block">
              <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            </button>
          )}
        </motion.div>

        {/* Center Nav Links */}
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

        {/* CTA - slides to right edge */}
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

        {/* Pill Background - wraps all elements */}
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
import AnimatedNavbar from "@/components/AnimatedNavbar";
import logo from "@assets/logo.png";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(sectionId);
  };

  return (
    <div>
      <AnimatedNavbar
        logo={logo}
        logoAlt="My Company"
        navItems={navItems}
        activeSection={activeSection}
        ctaText="Get Started"
        onNavClick={scrollToSection}
        onCtaClick={() => scrollToSection("contact")}
      />
      
      {/* Page content */}
      <section id="home">...</section>
      <section id="products">...</section>
      <section id="about">...</section>
      <section id="contact">...</section>
    </div>
  );
}
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logo` | `string` | — | Path to logo image (required) |
| `logoAlt` | `string` | `"Logo"` | Alt text for logo |
| `navItems` | `NavItem[]` | `[]` | Array of navigation items |
| `activeSection` | `string` | `""` | Currently active section ID |
| `ctaText` | `string` | `"Get Started"` | CTA button text |
| `ctaIcon` | `ReactNode` | `<ArrowRight />` | Icon after CTA text |
| `onNavClick` | `(id: string) => void` | — | Callback when nav item clicked |
| `onCtaClick` | `() => void` | — | Callback when CTA clicked |
| `onLogoClick` | `() => void` | — | Callback when logo clicked |
| `homeHref` | `string` | `"/"` | Link href for logo (uses Link instead of button) |

---

## Design Tokens

### Glass-morphism Effect

The navbar uses a glass-morphism effect achieved with:
- `bg-black/40` — Semi-transparent black background
- `backdrop-blur-xl` — Strong blur effect on content behind
- `border border-white/10` — Subtle white border at 10% opacity
- `shadow-lg shadow-black/20` — Soft shadow for depth

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `hsl(240 100% 60%)` | Active links, CTA button |
| `primary/10` | 10% opacity | Active link background |
| `muted-foreground` | `hsl(0 0% 65%)` | Inactive nav links |
| `foreground` | `hsl(0 0% 98%)` | Hover state text |
| `white/10` | 10% opacity | Border color |
| `black/40` | 40% opacity | Pill background |
| `black/20` | 20% opacity | Shadow color |
