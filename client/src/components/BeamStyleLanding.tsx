import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, ArrowRight, Zap, Target, TrendingUp, Clock, CheckCircle } from "lucide-react";
import type { Product, ContentSection } from "@shared/schema";
import dovitoLogo from "@assets/white_1749151126542.png";
import heroBackground from "@assets/dynamic-wang-rV9YIchqXEk-unsplash_1766100911024.jpg";
import SplashCursor from "./SplashCursor";
import FloatingLines from "./FloatingLines";
import Beams from "./Beams";
import AnimationToggle from "./AnimationToggle";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function BeamStyleLanding() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [activeTocSection, setActiveTocSection] = useState("");
  const lastScrollY = useRef(0);
  const heroSectionRef = useRef<HTMLElement>(null);
  const productsSectionRef = useRef<HTMLElement>(null);
  
  const tocSections = [
    { id: "problem", title: "The Problem" },
    { id: "how-it-works", title: "How It Works" },
    { id: "what-makes-us-different", title: "What Makes Us Different" },
    { id: "pricing", title: "Pricing" },
    { id: "audit", title: "The $1,500 Audit" },
    { id: "technology", title: "Our Technology Approach" },
    { id: "who-this-is-for", title: "Who This Is For" },
    { id: "why-prototype", title: "Why We Require a Prototype First" },
    { id: "faq", title: "FAQ" },
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: contentSections = [] } = useQuery({
    queryKey: ["/api/content"],
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "products", "value", "contact"];
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
      
      const heroSection = document.getElementById("home");
      const readySection = document.getElementById("ready-to-start");
      
      if (heroSection && readySection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const readyTop = readySection.offsetTop;
        const shouldShow = currentScrollY > heroBottom - 100 && currentScrollY < readyTop - 200;
        setShowToc(shouldShow);
      }
      
      for (const section of tocSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveTocSection(section.id);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent successfully",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", company: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProductClick = (product: Product) => {
    if (product.status === "live" && product.url) {
      window.open(product.url, "_blank");
    } else {
      setSelectedProduct(product);
    }
  };

  const getContentByKey = (key: string, fallback: string = "") => {
    const section = contentSections.find((s: any) => s.sectionKey === key && s.isActive);
    return section?.content || fallback;
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

    const maxX = 4; // Fixed 4-column layout
    const maxY = Math.max(...products.map(p => p.positionY), 1);

    const grid = [];
    for (let y = 1; y <= maxY; y++) {
      // Check if this row has any products
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

                    {/* Glow effect for live products */}
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
      {animationsEnabled && <SplashCursor activeAreaRef={heroSectionRef} />}
      <AnimationToggle onToggle={setAnimationsEnabled} />
      {/* Sticky Table of Contents Sidebar */}
      <AnimatePresence>
        {showToc && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200/50 max-w-[200px]">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                Table of Contents
                <span className="flex-1 h-px bg-gray-300"></span>
              </p>
              <nav className="space-y-2">
                {tocSections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block text-left text-sm transition-colors w-full ${
                      activeTocSection === section.id
                        ? "text-gray-900 font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {index + 1}. {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-6 relative flex justify-between items-center h-14">
          {/* Logo - slides to left edge */}
          <motion.div
            className="flex items-center z-10 relative"
            initial={false}
            animate={{ x: navbarCollapsed ? -24 : 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <button onClick={() => scrollToSection("home")} className="block">
              <img src={dovitoLogo} alt="Dovito.ai" className="h-8 w-auto" />
            </button>
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
            {[
              { id: "home", label: "HOME" },
              { id: "products", label: "UNIVERSE" },
              { id: "contact", label: "CONNECT" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                  activeSection === item.id ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>

          {/* CTA - slides to right edge */}
          <motion.div
            className="z-10"
            initial={false}
            animate={{ x: navbarCollapsed ? 24 : 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <Button 
              onClick={() => scrollToSection("contact")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-2 rounded-lg font-medium uppercase text-xs tracking-wider transition-all duration-300"
            >
              Get Started
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
      {/* Hero Section - Fixed background with parallax effect */}
      <section id="home" ref={heroSectionRef} className="fixed top-0 left-0 right-0 h-screen flex items-center" style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}>
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
              Your Prototype.<br />
              Professionally Built.
            </motion.h1>

            <motion.p 
              className="text-xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >You've got an idea. Now let's make it real.</motion.p>


            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Button 
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                onClick={() => scrollToSection("contact")}
              >
                Submit Your Prototype →
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Hero spacer - pushes content down to account for fixed hero */}
      <div className="h-screen" style={{ zIndex: 1 }}></div>
      {/* Ribbon Divider */}
      <div className="w-full py-3 text-center text-[#1a3a60] bg-[#1a365d] relative" style={{ zIndex: 1 }}>
        <p className="text-white text-sm font-medium tracking-wide">Bring us your AI prototype and we'll audit, validate, and build the production-grade software behind it.</p>
      </div>
      {/* The Problem Section */}
      <section id="problem" className="py-24 bg-white relative overflow-hidden" style={{ zIndex: 1 }}>
        
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
              The Problem
            </h2>
            
            <p className="text-xl text-gray-700 mb-16 text-center max-w-3xl mx-auto">
              AI tools make building prototypes easy. Building production software is not.
            </p>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-none p-8 border border-gray-100"
              >
                <h3 className="text-xl font-bold text-primary mb-4">The Promise</h3>
                <p className="text-gray-600 leading-relaxed">
                  You can spin up a working prototype in Replit, Bolt, or v0. It looks good. It sort of works.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-none p-8 border border-gray-100"
              >
                <h3 className="text-xl font-bold text-primary mb-4">The Reality</h3>
                <p className="text-gray-600 leading-relaxed">
                  But the code is a mess. Security is questionable. It won't scale. No tests, no documentation. Technical debt from day one.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="from-primary to-primary-light rounded-none p-8 text-center text-[#1a365d] bg-[#1a365d]"
            >
              <p className="text-xl md:text-2xl text-white font-semibold">
                You need it rebuilt professionally, without wasting $50,000+ on something that will fail in production.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-muted relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
              How It Works
            </h2>

            <div className="space-y-16">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-primary mb-4 ml-24">
                  You Build a Prototype
                </h3>
                <div className="flex">
                  <div className="flex-shrink-0 w-24 flex items-start justify-center pt-6">
                    <span className="text-5xl font-bold text-primary-light">01</span>
                  </div>
                  <div className="flex-1 bg-primary-light/10 rounded-none p-8">
                    <p className="text-gray-600 mb-4">
                      Use any AI tool you want: Replit Agent, Bolt.new, v0, Cursor, Claude Code—whatever works.
                    </p>
                    <p className="text-gray-600">
                      Build something that shows your idea. Doesn't need to be perfect. Just functional enough to demonstrate what you want.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-primary mb-4 ml-24">
                  Submit for $1,500 Audit
                </h3>
                <div className="flex">
                  <div className="flex-shrink-0 w-24 flex items-start justify-center pt-6">
                    <span className="text-5xl font-bold text-primary-light">02</span>
                  </div>
                  <div className="flex-1 bg-primary-light/10 rounded-none p-8">
                    <p className="text-gray-600 mb-6">
                      We analyze your prototype and validate feasibility.
                    </p>
                    
                    <p className="font-semibold text-gray-900 mb-3">What you get:</p>
                    <ul className="space-y-2 text-gray-600 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Feasibility Report (10-15 pages)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Technical assessment
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Lean user stories (prioritized)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Architecture recommendations
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Realistic timeline and budget estimate
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Go/no-go recommendation
                      </li>
                    </ul>
                    
                    <p className="text-gray-900 font-medium">
                      <span className="text-[#4682b4]">Timeline:</span> 5-7 business days
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-primary mb-4 ml-24">
                  Approve & Move Forward
                </h3>
                <div className="flex">
                  <div className="flex-shrink-0 w-24 flex items-start justify-center pt-6">
                    <span className="text-5xl font-bold text-primary-light">03</span>
                  </div>
                  <div className="flex-1 bg-primary-light/10 rounded-none p-8">
                    <p className="text-gray-600 mb-4">
                      If the feasibility report makes sense, we proceed with:
                    </p>
                    <ul className="space-y-2 text-gray-600 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Product Requirements Document (PRD)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Detailed technical design
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Sprint-based development
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Production deployment
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4682b4] mt-1">•</span>
                        Documentation and training
                      </li>
                    </ul>
                    
                    <p className="text-lg text-gray-900 font-semibold border-t border-secondary/30 pt-6">
                      If it doesn't make sense, you've spent $1,500 to avoid wasting $50,000.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* What Makes Us Different Section */}
      <section id="what-makes-us-different" className="py-24 bg-white relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
              What Makes Us Different
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Not a Dev Shop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  Not a Dev Shop
                </h3>
                <p className="text-gray-500 mb-4">
                  Traditional dev shops build what you ask for. Don't question scope. Bill hourly forever.
                </p>
                <p className="text-gray-700 font-medium">
                  We audit first. Challenge assumptions. Build what you actually need. Fixed scope per sprint.
                </p>
              </motion.div>

              {/* Not AI-Generated Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  Not AI-Generated Code
                </h3>
                <p className="text-gray-500 mb-4">
                  AI tools create fast prototypes with technical debt that doesn't scale.
                </p>
                <p className="text-gray-700 font-medium">
                  We use human-first development assisted by AI. Production-grade code. Proper architecture. Built to last.
                </p>
              </motion.div>

              {/* Not "Yes Men" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  Not "Yes Men"
                </h3>
                <p className="text-gray-500 mb-4">
                  Agencies say yes to everything. Scope creep. Timeline disasters.
                </p>
                <p className="text-gray-700 font-medium">
                  We tell you the truth in the audit. If it won't work, we say so. If there's a better approach, we recommend it.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
              Pricing
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* $1,500 Audit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-none p-8 shadow-sm border-2 border-secondary"
              >
                <h3 className="text-2xl font-bold text-primary mb-6">
                  $1,500 Audit
                </h3>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Feasibility report
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Lean user stories
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Technical assessment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Budget estimate
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Go/no-go recommendation
                  </li>
                </ul>
                <p className="text-gray-900 font-medium">
                  <span className="text-secondary">Timeline:</span> 5-7 business days
                </p>
              </motion.div>

              {/* $15,000 - $35,000 MVP */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h3 className="text-2xl font-bold text-primary mb-6">
                  $15,000 - $35,000 MVP
                </h3>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    PRD and technical design
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Core functionality built
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Production deployment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Basic documentation
                  </li>
                </ul>
                <p className="text-gray-900 font-medium">
                  <span className="text-secondary">Timeline:</span> 4-8 weeks
                </p>
              </motion.div>

              {/* $25,000 - $75,000 V1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h3 className="text-2xl font-bold text-primary mb-6">
                  $25,000 - $75,000 V1
                </h3>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Full feature set
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Advanced functionality
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Comprehensive testing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Complete documentation
                  </li>
                </ul>
                <p className="text-gray-900 font-medium">
                  <span className="text-secondary">Timeline:</span> 8-16 weeks
                </p>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h3 className="text-2xl font-bold text-primary mb-2">
                  $2,500 - $7,500/month Support
                </h3>
                <p className="text-gray-500 text-sm mb-6">(Optional)</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Bug fixes and maintenance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Feature additions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Performance monitoring
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Security updates
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* The $1,500 Audit Section */}
      <section id="audit" className="py-24 bg-white relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
              The $1,500 Audit
            </h2>

            <p className="text-xl font-semibold text-gray-900 mb-12 text-center">
              What's included:
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Feasibility Report */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  Feasibility Report
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Is this buildable? Should we build it?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Technical challenges identified
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Required architecture and technology stack
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Security and scalability assessment
                  </li>
                </ul>
              </motion.div>

              {/* Lean User Stories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  Lean User Stories
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Core features (must-have)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Secondary features (should-have)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Nice-to-have features (later)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Prioritization framework
                  </li>
                </ul>
              </motion.div>

              {/* Scope & Estimate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  Scope & Estimate
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Realistic timeline
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Budget range (fixed-price per phase)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Phase breakdown (MVP → V1 → V2)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Risk factors
                  </li>
                </ul>
              </motion.div>

              {/* Recommendation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  Recommendation
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Go forward (here's how)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Adjust scope (here's why)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4682b4] mt-1">•</span>
                    Don't build it (here's why not)
                  </li>
                </ul>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-900 font-semibold text-center max-w-3xl mx-auto"
            >
              Even if we recommend NOT building it, you've saved yourself from a costly mistake.
            </motion.p>
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
              {/* Humans handle */}
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

              {/* AI assists with */}
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
              className="bg-secondary/10 rounded-none p-8 text-center"
            >
              <p className="text-lg text-gray-900">
                <span className="font-bold">Result:</span> Production-quality code at 30-40% lower cost than traditional development, with better quality than pure AI-generated code.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Who This Is For Section */}
      <section id="who-this-is-for" className="py-24 bg-white relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
              Who This Is For
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Entrepreneurs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  Entrepreneurs with AI-Built Prototypes
                </h3>
                <p className="text-gray-600">
                  You built something in Cursor or Replit. It works. Now you need it production-ready.
                </p>
              </motion.div>

              {/* Startups */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  Startups Validating Ideas
                </h3>
                <p className="text-gray-600">
                  You need an MVP fast, but it needs to actually work. No technical debt.
                </p>
              </motion.div>

              {/* Businesses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  Businesses Automating Operations
                </h3>
                <p className="text-gray-600">
                  You've identified a process to automate. You need software built, not a consultant who talks.
                </p>
              </motion.div>

              {/* Teams Burned */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-muted rounded-none p-8"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  Teams Burned by Dev Shops
                </h3>
                <p className="text-gray-600">
                  You've been through scope creep hell. You want fixed pricing and honest timelines.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Why We Require a Prototype First Section */}
      <section id="why-prototype" className="py-24 bg-muted relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
              Why We Require a Prototype First
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* It Forces Clarity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  It Forces Clarity
                </h3>
                <p className="text-gray-600">
                  Building a prototype makes you think through your idea. It reveals gaps in your thinking.
                </p>
              </motion.div>

              {/* It Validates Demand */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  It Validates Demand
                </h3>
                <p className="text-gray-600">
                  If you won't spend time building a prototype, you probably won't succeed with a full product.
                </p>
              </motion.div>

              {/* It Saves Everyone Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  It Saves Everyone Time
                </h3>
                <p className="text-gray-600">
                  We can assess feasibility faster with a working prototype than with a 40-page document.
                </p>
              </motion.div>

              {/* It Reduces Risk */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-none p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  It Reduces Risk
                </h3>
                <p className="text-gray-600">
                  Better to discover problems in a prototype than after we've built production software.
                </p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-900 font-semibold text-center max-w-3xl mx-auto"
            >
              Bottom line: If you can't articulate your idea well enough to prototype it, you're not ready for production development.
            </motion.p>
          </motion.div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white relative" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
              FAQ
            </h2>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-b border-gray-200 pb-8"
              >
                <h3 className="text-lg font-bold text-primary mb-3">
                  What if the audit says my idea won't work?
                </h3>
                <p className="text-gray-600">
                  Then you've spent $1,500 to avoid wasting $50,000+. We'll explain why and may suggest alternatives.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="border-b border-gray-200 pb-8"
              >
                <h3 className="text-lg font-bold text-primary mb-3">
                  Can you build my prototype for me?
                </h3>
                <p className="text-gray-600">
                  No. The prototype is your responsibility. It validates that you understand what you want. Use Replit Agent, Bolt, Cursor, Claude Code, or any AI tool.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="border-b border-gray-200 pb-8"
              >
                <h3 className="text-lg font-bold text-primary mb-3">
                  Do you do hourly billing?
                </h3>
                <p className="text-gray-600">
                  No. Fixed-price per phase after the audit. You know exactly what you're paying.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="border-b border-gray-200 pb-8"
              >
                <h3 className="text-lg font-bold text-primary mb-3">
                  What if I want changes mid-development?
                </h3>
                <p className="text-gray-600">
                  Minor refinements are included. Scope changes are evaluated and priced separately. This is why the audit phase is critical.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="border-b border-gray-200 pb-8"
              >
                <h3 className="text-lg font-bold text-primary mb-3">
                  Who owns the code?
                </h3>
                <p className="text-gray-600">
                  You do. Full ownership transfer upon final payment.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg font-bold text-primary mb-3">
                  Do you sign NDAs?
                </h3>
                <p className="text-gray-600">
                  Yes, before the audit begins.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Ready to Get Started Section */}
      <section id="ready-to-start" className="py-24 bg-muted relative" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
              Ready to Get Started?
            </h2>

            <p className="text-xl text-gray-700 mb-12">
              You've got a prototype. We'll tell you if it's worth building—and build it right.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                onClick={() => scrollToSection("contact")}
              >
                Submit Your Prototype →
              </Button>
              <a 
                href="mailto:hello@dovito.ai" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                hello@dovito.ai
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      {/* About dovito.ai Section */}
      <section id="about" className="py-24 bg-white relative" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12">
              About dovito.ai
            </h2>

            <div className="space-y-6 text-lg text-gray-600">
              <p>
                <span className="font-bold text-gray-900">dovito.ai</span> is the full-stack development arm of Dovito Business Solutions.
              </p>
              
              <p>
                <span className="font-bold text-gray-900">Our approach:</span> Human-first development assisted by AI for cost-effective, production-quality software.
              </p>
              
              <p>
                <span className="font-bold text-gray-900">Our promise:</span> Honest feasibility assessments. Fixed-price development. Code that actually works.
              </p>
              
              <p className="pt-4">
                <span className="font-bold text-gray-900">Part of:</span>{" "}
                <a 
                  href="https://dovito.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary/80 underline transition-colors"
                >
                  dovito.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Periodic Table Section */}
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
      {/* Beams Background Container - Contact Section */}
      <div className="relative section-dark" style={{ background: 'linear-gradient(180deg, #0a1929 0%, #1a365d 100%)' }}>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Beams
            beamWidth={3}
            beamHeight={18}
            beamNumber={20}
            lightColor="#4682b4"
            speed={2.2}
            noiseIntensity={0}
            scale={0.24}
            rotation={28}
          />
        </div>
        
        {/* Contact Section */}
        <section id="contact" className="py-32 relative" style={{ zIndex: 1 }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Ready to Transform?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Ready to start a new automation project or see our existing solutions in action? Let's discuss your needs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      placeholder="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Business Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary"
                      required
                    />
                  </div>

                  <Input
                    placeholder="Company Name"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary"
                    required
                  />

                  <Textarea
                    placeholder="Tell us about your biggest operational challenges..."
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary"
                    required
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                  >
                    Schedule Free Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          </div>
        </section>

        {/* Footer with Admin Access */}
        <footer className="backdrop-blur-sm border-t border-white/10 py-8 mt-20 relative z-10">
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
      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="max-w-lg w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-gray-200 bg-white shadow-xl">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-3xl font-bold text-secondary">
                          {selectedProduct.abbreviation}
                        </span>
                        <h3 className="text-xl font-semibold text-primary">{selectedProduct.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{selectedProduct.category}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedProduct(null)}
                      className="text-gray-400 hover:text-primary"
                    >
                      ✕
                    </Button>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <Badge variant={selectedProduct.status === "live" ? "default" : "secondary"}>
                      {selectedProduct.status === "live" ? "Live" : "Coming Soon"}
                    </Badge>
                    {selectedProduct.launchDate && (
                      <span className="text-sm text-muted-foreground">
                        Expected: {new Date(selectedProduct.launchDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {selectedProduct.status === "coming_soon" && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        Be the first to experience this revolutionary automation tool. 
                        Contact us for early access and exclusive beta testing opportunities.
                      </p>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full" 
                        onClick={() => {
                          setSelectedProduct(null);
                          scrollToSection("contact");
                        }}
                      >
                        Get Early Access
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}