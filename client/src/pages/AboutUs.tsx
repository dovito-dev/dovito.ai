import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { Product } from "@shared/schema";
import dovitoLogo from "@assets/white_1749151126542.png";
import heroBackground from "@assets/dynamic-wang-rV9YIchqXEk-unsplash_1766100911024.jpg";
import FloatingLines from "@/components/FloatingLines";
import SplashCursor from "@/components/SplashCursor";
import AnimationToggle from "@/components/AnimationToggle";

export default function AboutUs() {
  const productsSectionRef = useRef<HTMLElement>(null);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const lastScrollY = useRef(0);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: contentSections = [] } = useQuery<any[]>({
    queryKey: ["/api/content"],
  });

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <AnimationToggle onToggle={setAnimationsEnabled} />
      
      {/* Navigation - Same as Home Page */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-6 relative flex justify-between items-center h-14">
          {/* Logo - slides to left edge */}
          <motion.div
            className="flex items-center z-10 relative"
            initial={false}
            animate={{ x: navbarCollapsed ? -24 : 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <Link href="/" className="block">
              <img src={dovitoLogo} alt="Dovito.ai" className="h-8 w-auto" />
            </Link>
            {/* Logo pill background - appears when scrolling */}
            <motion.div
              className="absolute -inset-x-4 -inset-y-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-lg shadow-black/20 -z-10"
              initial={false}
              animate={{
                opacity: navbarCollapsed ? 1 : 0,
                scale: navbarCollapsed ? 1 : 0.9,
              }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            />
          </motion.div>

          {/* Center Nav Links */}
          <motion.div
            className="hidden md:flex items-center space-x-8"
            initial={false}
            animate={{
              opacity: navbarCollapsed ? 0 : 1,
              pointerEvents: navbarCollapsed ? "none" : "auto"
            }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          >
            <Link
              href="/"
              className="relative px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 text-white/70 hover:text-white"
            >
              HOME
            </Link>
            <span className="relative px-3 py-1.5 text-xs font-medium tracking-wider text-white">
              ABOUT US
            </span>
            <Link
              href="/#contact"
              className="relative px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 text-white/70 hover:text-white"
            >
              CONNECT
            </Link>
          </motion.div>

          {/* CTA - slides to right edge */}
          <motion.div
            className="z-10"
            initial={false}
            animate={{ x: navbarCollapsed ? 24 : 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <Link href="/#contact">
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-2 rounded-lg font-medium uppercase text-xs tracking-wider transition-all duration-300"
              >
                Get Started
              </Button>
            </Link>
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

      {/* Hero Section - Fixed background with parallax effect (Same as Home Page) */}
      <section className="fixed top-0 left-0 right-0 h-screen flex items-center overflow-hidden" style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}>
        {animationsEnabled && <SplashCursor />}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 relative w-full">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              About Us
            </motion.h1>

            <motion.p 
              className="text-xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Learn more about our team, technology approach, and the projects we've built.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Hero spacer - pushes content down to account for fixed hero */}
      <div className="h-screen" style={{ zIndex: 1 }}></div>

      {/* Content sections with z-index above hero */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* About dovito.ai Section */}
        <section id="about" className="py-24 relative" style={{ background: 'linear-gradient(to right, #f5f5f5, #e8f0f8)' }}>
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
        <section id="technology" className="py-24 bg-muted relative">
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
        <section id="products" ref={productsSectionRef} className="py-32 relative overflow-hidden bg-white">
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

        {/* Footer - Same as Home Page */}
        <footer className="bg-[#1a365d] py-8 mt-20 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-white/60">
                © 2024 Dovito.ai. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href="/brand-kit"
                  className="text-xs text-white/60 hover:text-white transition-colors"
                  data-testid="link-brand-kit"
                >
                  Brand Kit
                </Link>
                <a
                  href="/admin"
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
