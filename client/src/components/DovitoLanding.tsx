import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Zap, Target, TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import type { Product } from "@shared/schema";
import dovitoLogo from "@assets/dovito logo_color-pos_1749151126542.png";

export default function DovitoLanding() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "products", "value", "about", "contact"];
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
    setMobileMenuOpen(false);
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
      title: "Consultation Request Sent!",
      description: "Thank you for your interest. We'll contact you within 24 hours to schedule your free consultation.",
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

  const renderPeriodicTable = () => {
    const maxX = Math.max(...products.map(p => p.positionX), 4);
    const maxY = Math.max(...products.map(p => p.positionY), 3);

    const grid = [];
    for (let y = 1; y <= maxY; y++) {
      const row = [];
      for (let x = 1; x <= maxX; x++) {
        const product = products.find(p => p.positionX === x && p.positionY === y);
        row.push(
          <div key={`${x}-${y}`} className="aspect-square">
            {product ? (
              <Card 
                className={`h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  product.status === "live" 
                    ? "border-primary bg-primary/5 hover:bg-primary/10" 
                    : "border-muted-foreground/30 bg-muted/30"
                }`}
                onClick={() => handleProductClick(product)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    product.status === "live" ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {product.abbreviation}
                  </div>
                  <div className="text-xs font-medium mb-1">{product.name}</div>
                  <Badge variant={product.status === "live" ? "default" : "secondary"} className="text-xs">
                    {product.status === "live" ? "Live" : "Coming Soon"}
                  </Badge>
                  {product.status === "live" && (
                    <ExternalLink className="w-3 h-3 mt-1 text-primary" />
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="h-full border-2 border-dashed border-muted-foreground/20 rounded-lg"></div>
            )}
          </div>
        );
      }
      grid.push(
        <div key={y} className="grid grid-cols-4 gap-4 mb-4">
          {row}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={dovitoLogo} alt="Dovito.ai" className="h-8 w-auto" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {[
                  { id: "home", label: "Home" },
                  { id: "products", label: "Products" },
                  { id: "value", label: "Value" },
                  { id: "about", label: "About" },
                  { id: "contact", label: "Contact" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      activeSection === item.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {[
                { id: "home", label: "Home" },
                { id: "products", label: "Products" },
                { id: "value", label: "Value" },
                { id: "about", label: "About" },
                { id: "contact", label: "Contact" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Business Process Automation<br />
              <span className="text-primary">That Delivers Results</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Guaranteed ROI through intelligent automation. Reduce manual tasks by 25-40% 
              and improve lead-to-close conversion by 15-30%. 90-day ROI guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="px-8 py-3 font-semibold"
                onClick={() => scrollToSection("contact")}
              >
                <Zap className="w-5 h-5 mr-2" />
                Get Free Consultation
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-3 font-semibold"
                onClick={() => scrollToSection("products")}
              >
                Explore Our Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Periodic Table Section */}
      <section id="products" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Dovito Product Universe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our growing ecosystem of automation tools designed to transform your business operations.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {renderPeriodicTable()}
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Click on live products to visit them directly, or click coming soon products to learn more.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section id="value" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Guaranteed Results</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We deliver measurable improvements to your business operations with our proven automation solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-primary">25-40%</CardTitle>
                <CardDescription>Reduction in Manual Tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Eliminate repetitive administrative work and focus on strategic initiatives.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-primary">15-30%</CardTitle>
                <CardDescription>Lead-to-Close Improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Streamlined sales processes that convert more prospects into customers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-primary">$15K-$50K</CardTitle>
                <CardDescription>Monthly Savings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Direct cost savings through process optimization and automation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-primary">90-Day</CardTitle>
                <CardDescription>ROI Guarantee</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See measurable results within 90 days or we'll work for free until you do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Growing Businesses</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Dovito.ai specializes in automation solutions for companies with $3-25M annual revenue. 
                We focus on construction, manufacturing, and professional services industries where 
                manual processes are holding back growth.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span>30-60 day implementation timeline</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span>Personal CEO involvement in every project</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span>Industry-specific expertise and solutions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span>Comprehensive training and ongoing support</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">$3M-$25M</div>
                  <div className="text-sm text-muted-foreground">Target Company Size</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">Companies Automated</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">90%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Available</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule a free consultation to discover how Dovito.ai can automate your processes and guarantee ROI within 90 days.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Get Your Free Consultation</CardTitle>
                <CardDescription>
                  Tell us about your business challenges and we'll show you exactly how automation can help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      placeholder="Business Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      placeholder="Company Name"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder="Tell us about your biggest operational challenges..."
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Schedule Free Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Dovito.ai?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold">Personal CEO Involvement</h4>
                      <p className="text-sm text-muted-foreground">
                        Direct access to leadership ensures your project gets the attention it deserves.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Target className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold">Industry Expertise</h4>
                      <p className="text-sm text-muted-foreground">
                        Specialized knowledge in construction, manufacturing, and professional services.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Zap className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold">Rapid Implementation</h4>
                      <p className="text-sm text-muted-foreground">
                        Most projects launch within 30-60 days with immediate impact.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold">Guaranteed Results</h4>
                      <p className="text-sm text-muted-foreground">
                        90-day ROI guarantee or we continue working until you see results.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Ready to Start?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Most clients see initial results within the first month of implementation.
                  </p>
                  <Button variant="outline" onClick={() => scrollToSection("products")}>
                    Explore Our Products
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {selectedProduct.abbreviation}
                    </span>
                    {selectedProduct.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {selectedProduct.category}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedProduct(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {selectedProduct.description}
              </p>
              <div className="flex items-center justify-between">
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
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Interested in early access? Contact us to learn more about this upcoming product.
                  </p>
                  <Button 
                    className="mt-2 w-full" 
                    onClick={() => {
                      setSelectedProduct(null);
                      scrollToSection("contact");
                    }}
                  >
                    Get Early Access
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}