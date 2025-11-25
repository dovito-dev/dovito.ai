# Periodic Table Product Cards Extraction

Complete extraction of the animated periodic table-style product cards from Section 2 ("The Dovito Universe") with Framer Motion animations, glass-morphism styling, and interactive hover effects.

---

## Component Structure

```
PeriodicTableGrid
├── Grid Container (responsive columns)
│   └── Row Container (grid-cols-4)
│       └── Cell Wrapper (motion.div - entry animation)
│           ├── Product Card (motion.div - interactive)
│           │   └── Card Content (flex column, centered)
│           │       ├── Abbreviation (large bold text)
│           │       ├── Product Name (medium text)
│           │       ├── Status Badge (Live/Coming Soon)
│           │       ├── External Link Icon (live products only)
│           │       └── Glow Overlay (live products only)
│           └── Empty Cell (placeholder for grid gaps)
```

---

## Dependencies Required

| Dependency | Purpose |
|------------|---------|
| `framer-motion` | Entry animations, hover/tap effects |
| `lucide-react` | ExternalLink icon |
| shadcn/ui Badge | Status indicator |
| Tailwind CSS | All styling |

### Installation

```bash
npm install framer-motion lucide-react
```

---

## CSS Custom Properties (Required)

Add these to your global CSS file:

```css
:root {
  --background: 0 0% 0%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3%;
  --muted-foreground: 0 0% 65%;
  --primary: 240 100% 60%;
  --primary-foreground: 0 0% 100%;
  --border: 0 0% 10%;
}
```

---

## Tailwind Classes Reference

### Cell Wrapper (Entry Animation Container)

| Element | Classes |
|---------|---------|
| **Cell wrapper** | `aspect-square` |

### Product Card (Live Status)

| Element | Classes |
|---------|---------|
| **Card container** | `h-full cursor-pointer transition-all duration-500 rounded-2xl border backdrop-blur-sm` |
| **Live variant** | `border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60` |

### Product Card (Coming Soon Status)

| Element | Classes |
|---------|---------|
| **Card container** | `h-full cursor-pointer transition-all duration-500 rounded-2xl border backdrop-blur-sm` |
| **Coming Soon variant** | `border-border/40 bg-card/30 hover:bg-card/50` |

### Card Content

| Element | Classes |
|---------|---------|
| **Content wrapper** | `p-6 flex flex-col items-center justify-center h-full text-center relative` |
| **Abbreviation (live)** | `text-3xl font-bold mb-3 text-primary` |
| **Abbreviation (coming soon)** | `text-3xl font-bold mb-3 text-muted-foreground` |
| **Product name** | `text-sm font-medium mb-3 opacity-90` |
| **Status badge** | `text-xs px-2 py-1` |
| **External link icon** | `w-4 h-4 mt-2 opacity-60` |
| **Glow overlay** | `absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none` |

### Empty Cell (Placeholder)

| Element | Classes |
|---------|---------|
| **Empty cell** | `h-full border border-border/10 rounded-2xl bg-card/5 backdrop-blur-sm` |

### Grid Layout

| Element | Classes |
|---------|---------|
| **Row container** | `grid grid-cols-4 gap-6 mb-6` |
| **Grid wrapper** | `max-w-5xl mx-auto` |

---

## Animation Specifications

### Entry Animation (Cell Wrapper)

```typescript
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ 
  delay: (x + y) * 0.1,  // Staggered based on position
  type: "spring", 
  stiffness: 100 
}}
```

### Hover Animation (Product Card)

```typescript
whileHover={{ 
  scale: 1.05, 
  y: -8,
  boxShadow: product.status === "live" 
    ? "0 20px 40px rgba(96, 102, 255, 0.3)"   // Blue glow for live
    : "0 20px 40px rgba(255, 255, 255, 0.1)"  // Subtle white for coming soon
}}
```

### Tap Animation (Product Card)

```typescript
whileTap={{ scale: 0.95 }}
```

---

## Data Model

```typescript
interface Product {
  id: number;
  name: string;
  abbreviation: string;      // 2-4 letter code (e.g., "AI", "CRM")
  description: string;
  status: "live" | "coming-soon";
  url?: string;              // External link for live products
  positionX: number;         // Grid column (1-4)
  positionY: number;         // Grid row (1-n)
}
```

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
  onProductClick?: (product: Product) => void;
}

export default function PeriodicTableCards({
  products,
  columns = 4,
  onProductClick,
}: PeriodicTableCardsProps) {
  
  const handleProductClick = (product: Product) => {
    if (product.status === "live" && product.url) {
      window.open(product.url, "_blank");
    } else if (onProductClick) {
      onProductClick(product);
    }
  };

  const renderGrid = () => {
    if (!products || products.length === 0) return null;

    const maxY = Math.max(...products.map(p => p.positionY), 1);
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
              transition={{ delay: (x + y) * 0.1, type: "spring", stiffness: 100 }}
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
                >
                  <div className="p-6 flex flex-col items-center justify-center h-full text-center relative">
                    <div className={`text-3xl font-bold mb-3 ${
                      product.status === "live" ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {product.abbreviation}
                    </div>
                    <div className="text-sm font-medium mb-3 opacity-90">
                      {product.name}
                    </div>
                    <Badge 
                      variant={product.status === "live" ? "default" : "secondary"} 
                      className="text-xs px-2 py-1"
                    >
                      {product.status === "live" ? "Live" : "Coming Soon"}
                    </Badge>
                    {product.status === "live" && (
                      <ExternalLink className="w-4 h-4 mt-2 opacity-60" />
                    )}

                    {/* Glow effect for live products */}
                    {product.status === "live" && (
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border border-border/10 rounded-2xl bg-card/5 backdrop-blur-sm" />
              )}
            </motion.div>
          );
        }
        grid.push(
          <div key={y} className="grid grid-cols-4 gap-6 mb-6">
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
import PeriodicTableCards from "@/components/PeriodicTableCards";

const products = [
  { 
    id: 1, 
    name: "AI Assistant", 
    abbreviation: "AI", 
    description: "Intelligent automation",
    status: "live", 
    url: "https://ai.example.com",
    positionX: 1, 
    positionY: 1 
  },
  { 
    id: 2, 
    name: "CRM Integration", 
    abbreviation: "CRM", 
    description: "Customer management",
    status: "coming-soon",
    positionX: 2, 
    positionY: 1 
  },
  { 
    id: 3, 
    name: "Data Pipeline", 
    abbreviation: "DP", 
    description: "ETL automation",
    status: "live", 
    url: "https://pipeline.example.com",
    positionX: 1, 
    positionY: 2 
  },
];

function ProductsSection() {
  const handleProductClick = (product) => {
    console.log("Clicked:", product.name);
    // Open modal, navigate, etc.
  };

  return (
    <section className="py-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold mb-6">Product Universe</h2>
        <p className="text-muted-foreground">
          A growing ecosystem of automation tools
        </p>
      </div>
      
      <PeriodicTableCards 
        products={products}
        columns={4}
        onProductClick={handleProductClick}
      />
    </section>
  );
}
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | — | Array of products to display (required) |
| `columns` | `number` | `4` | Number of columns in the grid |
| `onProductClick` | `(product: Product) => void` | — | Callback for non-live product clicks |

---

## Design Tokens

### Glass-morphism Effect

The cards use a glass-morphism effect achieved with:
- `backdrop-blur-sm` — Subtle blur on content behind
- `bg-primary/5` or `bg-card/30` — Semi-transparent background
- `border-primary/40` or `border-border/40` — Colored border at 40% opacity

### Color States

| State | Background | Border | Text |
|-------|------------|--------|------|
| **Live (default)** | `bg-primary/5` | `border-primary/40` | `text-primary` |
| **Live (hover)** | `bg-primary/10` | `border-primary/60` | `text-primary` |
| **Coming Soon (default)** | `bg-card/30` | `border-border/40` | `text-muted-foreground` |
| **Coming Soon (hover)** | `bg-card/50` | `border-border/40` | `text-muted-foreground` |

### Shadow Effects

| State | Box Shadow |
|-------|------------|
| **Live (hover)** | `0 20px 40px rgba(96, 102, 255, 0.3)` |
| **Coming Soon (hover)** | `0 20px 40px rgba(255, 255, 255, 0.1)` |

---

## Responsive Behavior

The grid is fixed at 4 columns. For responsive layouts, modify the grid classes:

```tsx
// Example: Responsive grid
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  {row}
</div>
```

---

## Animation Timing

| Animation | Duration | Easing | Delay |
|-----------|----------|--------|-------|
| **Entry (scale + fade)** | Spring (stiffness: 100) | — | `(x + y) * 0.1s` |
| **Hover (scale + lift)** | Default | Default | — |
| **Tap (scale down)** | Default | Default | — |
| **CSS transitions** | 500ms | ease (default) | — |
