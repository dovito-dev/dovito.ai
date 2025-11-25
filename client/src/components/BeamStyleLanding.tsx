import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, ArrowRight, Sparkles, Zap, Target, TrendingUp, Clock, CheckCircle } from "lucide-react";
import type { Product, ContentSection } from "@shared/schema";
import dovitoLogo from "@assets/white_1749151126542.png";
import SplashCursor from "./SplashCursor";
import FloatingLines from "./FloatingLines";
import AnimationToggle from "./AnimationToggle";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function BeamStyleLanding() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const productsSectionRef = useRef<HTMLElement>(null);
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
                    <div className="text-sm font-medium mb-3 opacity-90">{product.name}</div>
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
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border border-border/10 rounded-2xl bg-card/5 backdrop-blur-sm"></div>
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img src={dovitoLogo} alt="Dovito.ai" className="h-8 w-auto" />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "Home" },
                { id: "products", label: "Universe" },
                { id: "value", label: "Impact" },
                { id: "contact", label: "Connect" }
              ].map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute inset-0 bg-primary/10 rounded-lg" />
                  )}
                </button>
              ))}

              <Button 
                onClick={() => scrollToSection("contact")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section id="home" ref={heroSectionRef} className="pt-20 min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-background opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              Business Process Automation
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Automation That<br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Delivers Results
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Reduce manual tasks by 25-40% and improve lead conversion by 15-30%. 
              Most clients see measurable results within 90 days or less.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                onClick={() => scrollToSection("contact")}
              >
                <Zap className="w-5 h-5 mr-2" />
                Get Free Consultation
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-border/50 hover:border-primary/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                onClick={() => scrollToSection("products")}
              >
                Explore Universe
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Periodic Table Section */}
      <section id="products" ref={productsSectionRef} className="py-32 relative overflow-hidden">
        <FloatingLines
          linesGradient={["#1E3A8A", "#3B82F6", "#4F46E5", "#1E1B4B"]}
          enabledWaves={['middle']}
          lineCount={[4, 4, 4]}
          lineDistance={[45, 45, 45]}
          animationSpeed={0.8}
          interactive={true}
          bendRadius={2.0}
          bendStrength={0.25}
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
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              {getContentByKey("periodic_table_title", "The Dovito Universe")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
            <p className="text-muted-foreground">
              {getContentByKey("periodic_table_footer", "Click live products to visit • Click coming soon for early access")}
            </p>
          </motion.div>
        </div>
      </section>
      {/* Value Proposition Section */}
      <section id="value" className="py-32 bg-card/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">Transformational SaaS</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Measurable results that transform your business operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Target, 
                value: "25-40%", 
                label: "Task Reduction",
                description: "Eliminate manual work"
              },
              { 
                icon: TrendingUp, 
                value: "15-30%", 
                label: "Conversion Boost",
                description: "Improve lead-to-close"
              },
              { 
                icon: Zap, 
                value: "$15K-$50K", 
                label: "Monthly Savings",
                description: "Direct cost reduction"
              },
              { 
                icon: Clock, 
                value: "90-Day", 
                label: "Impactful Results",
                description: "Impactful results for real people"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                  <CardContent className="p-8">
                    <item.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                    <div className="text-3xl font-bold text-primary mb-2">{item.value}</div>
                    <div className="text-sm font-medium mb-3">{item.label}</div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Ready to Transform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to start a new automation project or see our existing solutions in action? Let's discuss your needs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      placeholder="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Business Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <Input
                    placeholder="Company Name"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />

                  <Textarea
                    placeholder="Tell us about your biggest operational challenges..."
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
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
              <Card className="border-border/50 bg-card/95 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-3xl font-bold text-primary">
                          {selectedProduct.abbreviation}
                        </span>
                        <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedProduct(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
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

      {/* Footer with Admin Access */}
      <footer className="bg-background/80 backdrop-blur-sm border-t border-border/50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 Dovito.ai. All rights reserved.
            </div>
            <a
              href="/admin"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}