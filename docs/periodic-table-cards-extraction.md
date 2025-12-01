# PeriodicTableCards Extraction

---

## Component Overview

The **PeriodicTableCards** component displays a grid of product cards arranged in a periodic table-style layout. It appears in Section 1 of the landing page, directly below the header, within "The Dovito Universe" section.

**Key behaviors:**
- **Grid layout**: 4-column fixed grid displaying products based on their x/y position coordinates
- **Status-based styling**: "Live" products have primary blue styling with external link icon; "Coming Soon" products have muted styling
- **Staggered entry animations**: Cards fade in and scale up with position-based delays
- **Hover effects**: Cards lift, scale, and display colored shadows on hover
- **Tap feedback**: Scale-down animation on click/tap
- **Click actions**: Live products open external URLs; Coming Soon products trigger a callback (e.g., modal)
- **Empty cell placeholders**: Grid positions without products show subtle placeholder cells
- **Loading state**: Animated spinner while data is being fetched

---

## Component Structure

- **PeriodicTableCards (Root)**
  - **Grid Container** — max-w-5xl wrapper for the periodic table
    - **Row Container** (`div.grid.grid-cols-4`) — 4-column grid row
      - **Cell Wrapper** (`motion.div`) — Aspect-square container with entry animation
        - **Product Card** (`motion.div`) — Interactive card with status-based styling
          - **Content Wrapper** (`div`) — Centered flex column layout
            - **Abbreviation** (`div`) — Large bold 2-4 character product code
            - **Product Name** (`div`) — Medium text product title
            - **Status Badge** (`Badge`) — "Live" or "Coming Soon" indicator
            - **External Link Icon** (`ExternalLink`) — Only for live products
            - **Glow Overlay** (`div`) — Hover glow effect for live products
        - **Empty Cell** (`div`) — Placeholder for grid positions without products
  - **Loading Spinner** — Displayed while products are loading
    - **Spinner Container** — Centered wrapper
    - **Primary Ring** — Spinning border animation
    - **Ping Ring** — Pulsing overlay effect

---

## Dependencies Required

| Dependency | Purpose |
|------------|---------|
| `react` | Core React library for component creation |
| `framer-motion` | Animation library for entry, hover, and tap effects |
| `lucide-react` | Icon library for ExternalLink icon |
| `@/components/ui/badge` | shadcn/ui Badge component for status indicators |
| `tailwindcss` | Utility-first CSS framework for all styling |

### Installation Commands

```bash
# Using npm
npm install framer-motion lucide-react

# Using pnpm
pnpm add framer-motion lucide-react

# shadcn/ui Badge component
npx shadcn-ui@latest add badge
```

---

## CSS Custom Properties and Design Tokens

```css
:root {
  /* Background colors */
  --background: 0 0% 0%;           /* #000000 */
  --card: 0 0% 3%;                 /* #080808 */
  
  /* Text colors */
  --foreground: 0 0% 98%;          /* #FAFAFA */
  --muted-foreground: 0 0% 65%;    /* #A6A6A6 */
  
  /* Brand colors */
  --primary: 240 100% 60%;         /* #3366FF / rgb(96, 102, 255) */
  --primary-foreground: 0 0% 100%; /* #FFFFFF */
  
  /* Utility colors */
  --border: 0 0% 10%;              /* #1A1A1A */
}
```

### Token Usage Reference

| Token | Usage |
|-------|-------|
| `--primary` | Live product abbreviation text, badge background, border accents, hover shadows |
| `--primary/5` | Live product card background |
| `--primary/10` | Live product card hover background, glow overlay |
| `--primary/40` | Live product border color |
| `--primary/60` | Live product border hover color |
| `--muted-foreground` | Coming Soon abbreviation text |
| `--card/30` | Coming Soon card background |
| `--card/50` | Coming Soon card hover background |
| `--card/5` | Empty cell background |
| `--border/40` | Coming Soon card border |
| `--border/10` | Empty cell border |

---

## Styles and Classes Reference

### Grid Layout

| Element | Classes | Purpose |
|---------|---------|---------|
| Grid wrapper | `max-w-5xl mx-auto` | Centered container with max width |
| Row container | `grid grid-cols-4 gap-6 mb-6` | 4-column fixed grid with spacing |

### Cell Wrapper (Entry Animation Container)

| Element | Classes | Purpose |
|---------|---------|---------|
| Cell wrapper | `aspect-square` | Maintains 1:1 aspect ratio |

### Product Card (Live Status)

| Element | Classes | Purpose |
|---------|---------|---------|
| Card container | `h-full cursor-pointer transition-all duration-500 rounded-2xl border backdrop-blur-sm` | Base card styling |
| Live variant | `border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60` | Primary color scheme |

### Product Card (Coming Soon Status)

| Element | Classes | Purpose |
|---------|---------|---------|
| Card container | `h-full cursor-pointer transition-all duration-500 rounded-2xl border backdrop-blur-sm` | Base card styling |
| Coming Soon variant | `border-border/40 bg-card/30 hover:bg-card/50` | Muted color scheme |

### Card Content

| Element | Classes | Purpose |
|---------|---------|---------|
| Content wrapper | `p-6 flex flex-col items-center justify-center h-full text-center relative` | Centered flex layout |
| Abbreviation (live) | `text-3xl font-bold mb-3 text-primary` | Large primary-colored code |
| Abbreviation (coming soon) | `text-3xl font-bold mb-3 text-muted-foreground` | Large muted code |
| Product name | `text-sm font-medium mb-3 opacity-90` | Product title |
| Status badge | `text-xs px-2 py-1` | Small status indicator |
| External link icon | `w-4 h-4 mt-2 opacity-60` | Link indicator for live |
| Glow overlay | `absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none` | Hover glow effect |

### Empty Cell (Placeholder)

| Element | Classes | Purpose |
|---------|---------|---------|
| Empty cell | `h-full border border-border/10 rounded-2xl bg-card/5 backdrop-blur-sm` | Subtle placeholder |

### Loading Spinner

| Element | Classes | Purpose |
|---------|---------|---------|
| Spinner container | `flex items-center justify-center py-24` | Centered loading area |
| Spinner wrapper | `relative` | Position context |
| Primary ring | `w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary` | Spinning animation |
| Ping ring | `absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary/40` | Pulse effect |

---

## Animation and Interaction Specifications

### Entry Animation (Cell Wrapper)

```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ 
    delay: (x + y) * 0.1,  // Staggered based on grid position
    type: "spring", 
    stiffness: 100 
  }}
>
```

### Hover Animation (Product Card)

```typescript
<motion.div
  whileHover={{ 
    scale: 1.05, 
    y: -8,
    boxShadow: product.status === "live" 
      ? "0 20px 40px rgba(96, 102, 255, 0.3)"   // Blue glow
      : "0 20px 40px rgba(255, 255, 255, 0.1)"  // Subtle white
  }}
>
```

### Tap Animation (Product Card)

```typescript
<motion.div
  whileTap={{ scale: 0.95 }}
>
```

### Animation Parameters Summary

| Animation | Property | Value | Duration | Easing |
|-----------|----------|-------|----------|--------|
| Entry (initial) | `opacity` | `0` | — | — |
| Entry (initial) | `scale` | `0.8` | — | — |
| Entry (animate) | `opacity` | `1` | spring | stiffness: 100 |
| Entry (animate) | `scale` | `1` | spring | stiffness: 100 |
| Entry delay | — | `(x + y) * 0.1s` | — | — |
| Hover | `scale` | `1.05` | default | default |
| Hover | `y` | `-8px` | default | default |
| Hover (live) | `boxShadow` | `0 20px 40px rgba(96, 102, 255, 0.3)` | default | default |
| Hover (coming soon) | `boxShadow` | `0 20px 40px rgba(255, 255, 255, 0.1)` | default | default |
| Tap | `scale` | `0.95` | default | default |
| CSS transitions | all | — | 500ms | ease |
| Glow overlay | `opacity` | `0 → 1` | 500ms | ease |

---

## Data Model and Props

### Product Interface

```typescript
interface Product {
  id: number;              // Unique identifier
  name: string;            // Product display name
  abbreviation: string;    // 2-4 letter code (e.g., "AI", "CRM")
  description: string;     // Product description
  status: "live" | "coming-soon";  // Product availability
  url?: string;            // External link for live products
  positionX: number;       // Grid column (1-based)
  positionY: number;       // Grid row (1-based)
}
```

### PeriodicTableCards Props Interface

```typescript
interface PeriodicTableCardsProps {
  /** Array of products to display in the grid */
  products: Product[];
  
  /** Number of columns in the grid (default: 4) */
  columns?: number;
  
  /** Whether data is currently loading */
  isLoading?: boolean;
  
  /** Callback when a non-live product is clicked */
  onProductClick?: (product: Product) => void;
}
```

### Props Reference Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | — | Array of products to display (required) |
| `columns` | `number` | `4` | Number of columns in the grid |
| `isLoading` | `boolean` | `false` | Show loading spinner instead of grid |
| `onProductClick` | `(product: Product) => void` | — | Callback for non-live product clicks |

---

## Complete Component Code

```tsx
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  status: "live" | "coming-soon";
  url?: string;
  positionX: number;
  positionY: number;
}

interface PeriodicTableCardsProps {
  products: Product[];
  columns?: number;
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
}

export default function PeriodicTableCards({
  products,
  columns = 4,
  isLoading = false,
  onProductClick,
}: PeriodicTableCardsProps) {
  
  const handleProductClick = (product: Product) => {
    if (product.status === "live" && product.url) {
      window.open(product.url, "_blank");
    } else if (onProductClick) {
      onProductClick(product);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary/40" />
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return null;
  }

  // Calculate grid dimensions
  const maxY = Math.max(...products.map(p => p.positionY), 1);

  const renderGrid = () => {
    const grid = [];

    for (let y = 1; y <= maxY; y++) {
      const hasProductsInRow = products.some(p => p.positionY === y);
      
      if (hasProductsInRow) {
        const row = [];
        
        for (let x = 1; x <= columns; x++) {
          const product = products.find(p => p.positionX === x && p.positionY === y);
          
          row.push(
            <motion.div 
              key={`${x}-${y}`} 
              className="aspect-square"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: (x + y) * 0.1, 
                type: "spring", 
                stiffness: 100 
              }}
            >
              {product ? (
                <motion.div
                  className={`h-full cursor-pointer transition-all duration-500 rounded-2xl border backdrop-blur-sm ${
                    product.status === "live" 
                      ? "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60" 
                      : "border-border/40 bg-card/30 hover:bg-card/50"
                  }`}
                  onClick={() => handleProductClick(product)}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    boxShadow: product.status === "live" 
                      ? "0 20px 40px rgba(96, 102, 255, 0.3)" 
                      : "0 20px 40px rgba(255, 255, 255, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="p-6 flex flex-col items-center justify-center h-full text-center relative">
                    <div 
                      className={`text-3xl font-bold mb-3 ${
                        product.status === "live" 
                          ? "text-primary" 
                          : "text-muted-foreground"
                      }`}
                      data-testid={`product-abbreviation-${product.id}`}
                    >
                      {product.abbreviation}
                    </div>
                    <div 
                      className="text-sm font-medium mb-3 opacity-90"
                      data-testid={`product-name-${product.id}`}
                    >
                      {product.name}
                    </div>
                    <Badge 
                      variant={product.status === "live" ? "default" : "secondary"} 
                      className="text-xs px-2 py-1"
                      data-testid={`product-badge-${product.id}`}
                    >
                      {product.status === "live" ? "Live" : "Coming Soon"}
                    </Badge>
                    {product.status === "live" && (
                      <ExternalLink 
                        className="w-4 h-4 mt-2 opacity-60" 
                        data-testid={`product-link-icon-${product.id}`}
                      />
                    )}

                    {/* Glow effect for live products */}
                    {product.status === "live" && (
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    )}
                  </div>
                </motion.div>
              ) : (
                <div 
                  className="h-full border border-border/10 rounded-2xl bg-card/5 backdrop-blur-sm"
                  data-testid={`empty-cell-${x}-${y}`}
                />
              )}
            </motion.div>
          );
        }
        
        grid.push(
          <div 
            key={y} 
            className={`grid grid-cols-${columns} gap-6 mb-6`}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {row}
          </div>
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {renderGrid()}
    </div>
  );
}
```

---

## Usage Example

```tsx
import { useState } from "react";
import PeriodicTableCards from "@/components/PeriodicTableCards";

// Sample product data
const sampleProducts = [
  { 
    id: 1, 
    name: "AI Assistant", 
    abbreviation: "AI", 
    description: "Intelligent automation assistant",
    status: "live" as const, 
    url: "https://ai.dovito.ai",
    positionX: 1, 
    positionY: 1 
  },
  { 
    id: 2, 
    name: "CRM Integration", 
    abbreviation: "CRM", 
    description: "Customer relationship management",
    status: "coming-soon" as const,
    positionX: 2, 
    positionY: 1 
  },
  { 
    id: 3, 
    name: "Data Pipeline", 
    abbreviation: "DP", 
    description: "ETL automation tool",
    status: "live" as const, 
    url: "https://pipeline.dovito.ai",
    positionX: 1, 
    positionY: 2 
  },
  { 
    id: 4, 
    name: "Email Automation", 
    abbreviation: "EA", 
    description: "Automated email workflows",
    status: "coming-soon" as const,
    positionX: 3, 
    positionY: 1 
  },
];

function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProductClick = (product) => {
    // Open modal, navigate, or handle selection
    setSelectedProduct(product);
    console.log("Selected product:", product.name);
  };

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            The Dovito Universe
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A growing ecosystem of automation tools designed to transform business operations
          </p>
        </div>
        
        {/* Periodic table cards */}
        <PeriodicTableCards 
          products={sampleProducts}
          columns={4}
          isLoading={isLoading}
          onProductClick={handleProductClick}
        />
        
        {/* Footer text */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground">
            Click live products to visit • Click coming soon for early access
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;
```

---

## Design Notes and Behavior

### Visual Style

- **Glass-morphism**: Cards use `backdrop-blur-sm` with semi-transparent backgrounds for frosted glass effect
- **Status differentiation**: Live products use primary blue (#3366FF) accents; Coming Soon products use muted grays
- **Colored shadows**: Live products cast blue shadows on hover (`rgba(96, 102, 255, 0.3)`); Coming Soon products cast subtle white shadows
- **Rounded corners**: All cards use `rounded-2xl` (1rem border radius)
- **Subtle borders**: 40% opacity borders that increase to 60% on hover

### Responsive Behavior

The current implementation uses a fixed 4-column grid. For responsive behavior, modify the grid classes:

```tsx
// Fixed 4 columns (current)
<div className="grid grid-cols-4 gap-6 mb-6">

// Responsive columns (alternative)
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
```

| Breakpoint | Recommended Columns | Gap |
|------------|---------------------|-----|
| Mobile (< `md`) | 2 columns | 1rem (gap-4) |
| Tablet (≥ `md`) | 3 columns | 1.5rem (gap-6) |
| Desktop (≥ `lg`) | 4 columns | 1.5rem (gap-6) |

### Accessibility Considerations

- **Keyboard navigation**: Buttons are focusable and clickable with Enter/Space
- **Data-testid**: All interactive elements have test identifiers for automation
- **External links**: Live products open in new tabs (consider adding `aria-label` for screen readers)
- **Color contrast**: Primary blue on dark background meets WCAG AA standards

**Recommended enhancements:**
- Add `aria-label` to cards describing the product and action
- Add `role="link"` to live product cards
- Add keyboard focus ring styles (`focus-visible:ring-2`)
- Include screen reader text for status badges

---

## Scope and IDs/Classes Summary

### Classes Used by PeriodicTableCards

**Grid Layout:**
- `max-w-5xl`, `mx-auto`
- `grid`, `grid-cols-4`, `gap-6`, `mb-6`

**Cell Wrapper:**
- `aspect-square`

**Product Card:**
- `h-full`, `cursor-pointer`, `transition-all`, `duration-500`
- `rounded-2xl`, `border`, `backdrop-blur-sm`
- `border-primary/40`, `bg-primary/5`, `hover:bg-primary/10`, `hover:border-primary/60`
- `border-border/40`, `bg-card/30`, `hover:bg-card/50`

**Card Content:**
- `p-6`, `flex`, `flex-col`, `items-center`, `justify-center`
- `h-full`, `text-center`, `relative`
- `text-3xl`, `font-bold`, `mb-3`, `text-primary`, `text-muted-foreground`
- `text-sm`, `font-medium`, `opacity-90`
- `text-xs`, `px-2`, `py-1`
- `w-4`, `h-4`, `mt-2`, `opacity-60`

**Glow Overlay:**
- `absolute`, `inset-0`, `rounded-2xl`, `bg-primary/10`
- `opacity-0`, `group-hover:opacity-100`, `transition-opacity`, `duration-500`
- `pointer-events-none`

**Empty Cell:**
- `h-full`, `border`, `border-border/10`, `rounded-2xl`
- `bg-card/5`, `backdrop-blur-sm`

**Loading Spinner:**
- `flex`, `items-center`, `justify-center`, `py-24`
- `relative`, `w-16`, `h-16`, `border-4`
- `border-primary/20`, `rounded-full`, `animate-spin`, `border-t-primary`
- `absolute`, `inset-0`, `border-transparent`, `animate-ping`, `border-t-primary/40`

### Data Attributes

- `data-testid="product-card-${id}"`
- `data-testid="product-abbreviation-${id}"`
- `data-testid="product-name-${id}"`
- `data-testid="product-badge-${id}"`
- `data-testid="product-link-icon-${id}"`
- `data-testid="empty-cell-${x}-${y}"`

### Confirmation

✅ **All listed classes and selectors belong exclusively to PeriodicTableCards.**

❌ **No navbar, footer, page shell, or other section selectors are included.**

---

## License & Upstream Source

### Origin

This component is an **original implementation** created for the Dovito.ai business automation platform. It was designed and developed as part of the BeamStyleLanding page component.

### Inspirations & Influences

- Periodic table of elements layout concept
- Modern SaaS product showcase patterns
- Glass-morphism UI trends (2023-2024)
- shadcn/ui component architecture

### Dependencies Licensing

| Dependency | License |
|------------|---------|
| React | MIT |
| framer-motion | MIT |
| lucide-react | ISC |
| Tailwind CSS | MIT |
| shadcn/ui | MIT |

### Component License

```
MIT License

Copyright (c) 2024 Dovito.ai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Attribution Requirements

- No attribution required for personal or commercial projects
- If redistributing source code, include the MIT license notice
- Mentioning Dovito.ai is appreciated but not required

---

## Changelog

### v1.0.0 — December 1, 2024

**Initial Extraction**

- Extracted PeriodicTableCards from Dovito.ai BeamStyleLanding component
- Documented all animations, styles, and interactions
- Created reusable component with configurable props
- Added TypeScript interfaces for Product and PeriodicTableCardsProps
- Included loading state with animated spinner
- Added data-testid attributes for testing

**Features:**
- 4-column fixed grid layout
- Position-based staggered entry animations (spring physics)
- Status-based styling (live vs coming-soon)
- Hover effects with lift, scale, and colored shadows
- Tap feedback animation
- Click handling for external links and callbacks
- Empty cell placeholders
- Loading spinner

**Technical Details:**
- Entry animation delay: `(x + y) * 0.1s`
- Spring stiffness: 100
- Hover scale: 1.05
- Hover lift: -8px
- Tap scale: 0.95
- CSS transition duration: 500ms
- Live shadow: `rgba(96, 102, 255, 0.3)`
- Coming Soon shadow: `rgba(255, 255, 255, 0.1)`

---

### Future Considerations

Potential enhancements for future versions:
- [ ] Responsive column count (2/3/4 based on breakpoint)
- [ ] Custom column prop with Tailwind class generation
- [ ] Filter by status (show only live, show only coming soon)
- [ ] Search/filter functionality
- [ ] Keyboard navigation between cards
- [ ] ARIA enhancements for screen readers
- [ ] Optional tooltip with product description
- [ ] Customizable color themes
- [ ] Animation disable preference (prefers-reduced-motion)
- [ ] Skeleton loading state instead of spinner
