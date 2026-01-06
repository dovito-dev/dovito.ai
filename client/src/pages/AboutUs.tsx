import { useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowLeft } from "lucide-react";
import type { Product } from "@shared/schema";
import dovitoLogo from "@assets/white_1749151126542.png";
import FloatingLines from "@/components/FloatingLines";

export default function AboutUs() {
  const productsSectionRef = useRef<HTMLElement>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: contentSections = [] } = useQuery<any[]>({
    queryKey: ["/api/content"],
  });

  const getContentByKey = (key: string, fallback: string = "") => {
    const section = contentSections.find((s: any) => s.sectionKey === key && s.isActive);
    return section?.content || fallback;
  };

  const handleProductClick = (product: Product) => {
    if (product.status === "live" && product.url) {
      window.open(product.url, "_blank");
    }
  };

  const renderPeriodicTable = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary/40"></div>
          </div>
        </div>
      );
    }

    if (!products || products.length === 0) return null;

    const maxX = 4;
    const maxY = Math.max(...products.map(p => p.positionY), 1);

    const grid = [];
    for (let y = 1; y <= maxY; y++) {
      const hasProductsInRow = products.some(p => p.positionY === y);
      
      if (hasProductsInRow) {
        const row = [];
        for (let x = 1; x <= maxX; x++) {
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
                  className={`h-full cursor-pointer transition-all duration-500 rounded-2xl border ${
                    product.status === "live" 
                      ? "border-secondary/40 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary/60" 
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleProductClick(product)}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    boxShadow: product.status === "live" 
                      ? "0 20px 40px rgba(63, 185, 255, 0.3)" 
                      : "0 20px 40px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="p-6 flex flex-col items-center justify-center h-full text-center relative">
                    <div className={`text-3xl font-bold mb-3 ${
                      product.status === "live" ? "text-secondary" : "text-gray-400"
                    }`}>
                      {product.abbreviation}
                    </div>
                    <div className="text-sm font-medium mb-3 text-primary">{product.name}</div>
                    <Badge 
                      variant={product.status === "live" ? "default" : "secondary"} 
                      className="text-xs px-2 py-1"
                    >
                      {product.status === "live" ? "Live" : "Coming Soon"}
                    </Badge>
                    {product.status === "live" && (
                      <ExternalLink className="w-4 h-4 mt-2 opacity-60" />
                    )}

                    {product.status === "live" && (
                      <div className="absolute inset-0 rounded-2xl bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border border-gray-100 rounded-2xl bg-gray-50/50"></div>
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-6 relative flex justify-between items-center h-14">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a365d] flex items-center justify-center rounded-none">
              <img src={dovitoLogo} alt="dovito.ai" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-xl font-bold text-primary">dovito.ai</span>
          </Link>
          
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-primary mb-6"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Learn more about our team, technology approach, and the projects we've built.
          </motion.p>
        </div>
      </section>

      {/* About dovito.ai Section */}
      <section id="about" className="py-24 relative" style={{ zIndex: 1, background: 'linear-gradient(to right, #f5f5f5, #e8f0f8)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
              About dovito.ai
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  Who We Are
                </h3>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">dovito.ai</span> is the full-stack development arm of Dovito Business Solutions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  Our Approach
                </h3>
                <p className="text-gray-600">
                  Human-first development assisted by AI for cost-effective, production-quality software.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  Our Promise
                </h3>
                <p className="text-gray-600">
                  Honest feasibility assessments. Fixed-price development. Code that actually works.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-lg text-gray-700">
                <span className="font-bold text-gray-900">Part of:</span>{" "}
                <a 
                  href="https://dovito.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary/80 underline transition-colors font-semibold"
                >
                  dovito.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Technology Approach Section */}
      <section id="technology" className="py-24 bg-muted relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
              Our Technology Approach
            </h2>
            <h3 className="text-2xl font-semibold text-primary-light mb-16 text-center">
              Human-First, AI-Assisted
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h4 className="text-xl font-bold text-primary mb-6">
                  Humans handle:
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Architecture decisions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Security implementation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Code review
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Testing strategy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    System design
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h4 className="text-xl font-bold text-primary mb-6">
                  AI assists with:
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Boilerplate generation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Documentation creation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Test case writing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Code suggestions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Repetitive tasks
                  </li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-none p-8 text-center text-[#1a3] bg-[#1a365d]"
            >
              <p className="text-[#ffffff] text-[24px] font-semibold">
                <span className="font-bold">Result:</span> Production-quality code at 30-40% lower cost than traditional development, with better quality than pure AI-generated code.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Some of Our Projects Section (Periodic Table) */}
      <section id="products" ref={productsSectionRef} className="py-32 relative overflow-hidden bg-white" style={{ zIndex: 1 }}>
        <FloatingLines
          linesGradient={["#1a365d", "#4682b4", "#3fb9ff", "#001f3f"]}
          enabledWaves={['middle']}
          lineCount={[4, 4, 4]}
          lineDistance={[45, 45, 45]}
          animationSpeed={0.8}
          interactive={true}
          bendRadius={1.0}
          bendStrength={-0.5}
          mouseDamping={0.08}
          parallax={true}
          parallaxStrength={0.08}
          mixBlendMode={"screen" as const}
          activeAreaRef={productsSectionRef}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
              {getContentByKey("periodic_table_title", "Some of Our Projects")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {getContentByKey("periodic_table_description", "A growing ecosystem of automation tools designed to transform business operations")}
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {renderPeriodicTable()}
          </div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-500">
              {getContentByKey("periodic_table_footer", "Click live products to visit • Click coming soon for early access")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a365d] border-t border-white/10 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-none">
                <img src={dovitoLogo} alt="dovito.ai" className="w-5 h-5 object-contain" />
              </div>
              <span className="text-white/80 font-medium">dovito.ai</span>
            </div>
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Dovito Business Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
