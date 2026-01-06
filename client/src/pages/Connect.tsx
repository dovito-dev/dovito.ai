import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import dovitoLogo from "@assets/white_1749151126542.png";
import heroBackground from "@assets/dynamic-wang-rV9YIchqXEk-unsplash_1766100911024.jpg";
import SplashCursor from "@/components/SplashCursor";
import AnimationToggle from "@/components/AnimationToggle";

export default function Connect() {
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const lastScrollY = useRef(0);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
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
            <Link
              href="/about"
              className="relative px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 text-white/70 hover:text-white"
            >
              ABOUT US
            </Link>
            <span className="relative px-3 py-1.5 text-xs font-medium tracking-wider text-white">
              CONNECT
            </span>
          </motion.div>

          {/* CTA - slides to right edge */}
          <motion.div
            className="z-10"
            initial={false}
            animate={{ x: navbarCollapsed ? 24 : 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <a href="#contact">
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-2 rounded-lg font-medium uppercase text-xs tracking-wider transition-all duration-300"
              >
                Get Started
              </Button>
            </a>
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
              Connect With Us
            </motion.h1>

            <motion.p 
              className="text-xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Ready to start a new automation project or see our existing solutions in action? Let's discuss your needs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Hero spacer - pushes content down to account for fixed hero */}
      <div className="h-screen" style={{ zIndex: 1 }}></div>

      {/* Content sections with z-index above hero */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Ribbon Divider */}
        <div className="w-full py-3 text-center text-[#1a3a60] bg-[#1a365d] relative" style={{ zIndex: 1 }}>
          <p className="text-white text-sm font-medium tracking-wide">Ready to Get Started? You've got a prototype. We'll tell you if it's worth building—and build it right.</p>
        </div>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-muted relative" style={{ zIndex: 1 }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Ready to start a new automation project or see our existing solutions in action? Let's discuss your needs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-gray-200 bg-white shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        placeholder="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-secondary"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Business Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-secondary"
                        required
                      />
                    </div>

                    <Input
                      placeholder="Company Name"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-secondary"
                      required
                    />

                    <Textarea
                      placeholder="Tell us about your biggest operational challenges..."
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-secondary"
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

        {/* Footer */}
        <footer className="bg-[#1a365d] py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-white/80">
                © 2024 Dovito.ai. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href="/brand-kit"
                  className="text-xs text-white/80 hover:text-white transition-colors"
                  data-testid="link-brand-kit"
                >
                  Brand Kit
                </Link>
                <a
                  href="/admin"
                  className="text-xs text-white/80 hover:text-white transition-colors"
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
