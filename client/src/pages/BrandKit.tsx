import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight,
  Copy, 
  Download,
  Palette,
  Type,
  Layout,
  Image,
  MessageSquare,
  FileText,
  Check,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dovitoLogo from "@assets/white_1749151126542.png";
import Beams from "@/components/Beams";

const colorPalette = {
  primary: [
    { name: "Primary Deep Blue", hex: "#1a365d", hsl: "210 55% 23%", rgb: "26, 54, 93", usage: "Primary actions, links, highlights" },
    { name: "Primary Steel Blue", hex: "#4682b4", hsl: "207 44% 49%", rgb: "70, 130, 180", usage: "Beams effect, accents, focus rings" },
  ],
  background: [
    { name: "Background Navy", hex: "#001f3f", hsl: "210 100% 12%", rgb: "0, 31, 63", usage: "Main background" },
    { name: "Card Charcoal", hex: "#3d4a55", hsl: "210 16% 29%", rgb: "61, 74, 85", usage: "Cards, elevated surfaces" },
    { name: "Muted", hex: "#2d3a45", hsl: "210 16% 22%", rgb: "45, 58, 69", usage: "Secondary backgrounds" },
  ],
  text: [
    { name: "Foreground", hex: "#FAFAFA", hsl: "0 0% 98%", rgb: "250, 250, 250", usage: "Primary text" },
    { name: "Muted Text", hex: "#94a3b8", hsl: "210 10% 65%", rgb: "148, 163, 184", usage: "Secondary text, descriptions" },
  ],
  border: [
    { name: "Border", hex: "#4a5c6a", hsl: "210 16% 35%", rgb: "74, 92, 106", usage: "Dividers, outlines" },
    { name: "Border Light", hex: "#FFFFFF1A", hsl: "0 0% 100% / 10%", rgb: "255, 255, 255, 0.1", usage: "Subtle borders" },
  ],
  secondary: [
    { name: "Secondary Cyan", hex: "#3fb9ff", hsl: "199 100% 62%", rgb: "63, 185, 255", usage: "Secondary actions, highlights" },
    { name: "Secondary Dark Cyan", hex: "#0099cc", hsl: "195 100% 40%", rgb: "0, 153, 204", usage: "Accent elements" },
  ],
  tertiary: [
    { name: "Tertiary Gold", hex: "#b7791f", hsl: "38 73% 42%", rgb: "183, 121, 31", usage: "Emphasis, special highlights" },
  ],
  semantic: [
    { name: "Destructive", hex: "#EF4444", hsl: "0 84% 60%", rgb: "239, 68, 68", usage: "Error states, warnings" },
    { name: "Success", hex: "#22C55E", hsl: "142 76% 46%", rgb: "34, 197, 94", usage: "Success states" },
  ]
};

const typography = {
  fontFamily: {
    primary: "Inter",
    fallback: "system-ui, -apple-system, sans-serif"
  },
  weights: [
    { name: "Light", value: 300, usage: "Subtle text, captions" },
    { name: "Regular", value: 400, usage: "Body text, paragraphs" },
    { name: "Medium", value: 500, usage: "Labels, navigation" },
    { name: "Semibold", value: 600, usage: "Subheadings, emphasis" },
    { name: "Bold", value: 700, usage: "Headings, titles" },
  ],
  sizes: [
    { name: "Display", size: "4.5rem / 72px", usage: "Hero headlines" },
    { name: "H1", size: "3rem / 48px", usage: "Page titles" },
    { name: "H2", size: "2.25rem / 36px", usage: "Section headings" },
    { name: "H3", size: "1.5rem / 24px", usage: "Subsections" },
    { name: "H4", size: "1.25rem / 20px", usage: "Card titles" },
    { name: "Body", size: "1rem / 16px", usage: "Paragraph text" },
    { name: "Small", size: "0.875rem / 14px", usage: "Captions, labels" },
    { name: "XSmall", size: "0.75rem / 12px", usage: "Fine print" },
  ]
};

const brandVoice = {
  personality: ["Professional", "Innovative", "Approachable", "Results-driven"],
  tone: "Confident yet friendly. Technical expertise delivered with clarity. We empower, not overwhelm.",
  doList: [
    "Use clear, actionable language",
    "Focus on outcomes and results",
    "Be concise and direct",
    "Emphasize transformation and growth",
    "Use inclusive language"
  ],
  dontList: [
    "Use excessive jargon without explanation",
    "Over-promise or use hyperbole",
    "Sound robotic or impersonal",
    "Use negative or fear-based messaging",
    "Ignore the human element of automation"
  ]
};

function ColorSwatch({ color, onCopy }: { color: { name: string; hex: string; hsl: string; rgb: string; usage: string }; onCopy: (text: string) => void }) {
  return (
    <div className="group relative">
      <div 
        className="h-24 rounded-xl mb-3 border border-white/10 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
        style={{ backgroundColor: color.hex }}
        onClick={() => onCopy(color.hex)}
        data-testid={`color-swatch-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
      />
      <div className="space-y-1">
        <h4 className="font-medium text-sm">{color.name}</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{color.hex}</span>
          <button 
            onClick={() => onCopy(color.hex)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid={`copy-hex-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{color.usage}</p>
      </div>
    </div>
  );
}

export default function BrandKit() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const { toast } = useToast();

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast({
      title: "Copied to clipboard",
      description: text,
    });
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Beams Background */}
      <div className="fixed inset-0 z-0">
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

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-6 relative flex justify-between items-center h-14">
          {/* Logo - slides to left edge */}
          <motion.div
            className="flex items-center z-10"
            initial={false}
            animate={{ x: navbarCollapsed ? -24 : 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <Link href="/" className="block">
              <img src={dovitoLogo} alt="Dovito.ai" className="h-8 w-auto" />
            </Link>
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
              BRAND KIT
            </span>
          </motion.div>

          {/* CTA - slides to right edge */}
          <motion.div
            className="z-10"
            initial={false}
            animate={{ x: navbarCollapsed ? 24 : 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <Link href="/">
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-sm text-secondary mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              Official Brand Guidelines
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Brand Kit
            </motion.h1>

            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Everything you need to represent Dovito.ai consistently across all touchpoints.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Tabs defaultValue="strategy" className="space-y-8">
            <TabsList className="bg-card/80 backdrop-blur-sm border border-white/10 p-1.5 h-auto flex-wrap rounded-2xl">
              <TabsTrigger value="strategy" className="gap-2 rounded-xl data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary" data-testid="tab-strategy">
                <FileText className="w-4 h-4" />
                Strategy
              </TabsTrigger>
              <TabsTrigger value="logo" className="gap-2 rounded-xl data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary" data-testid="tab-logo">
                <Image className="w-4 h-4" />
                Logo
              </TabsTrigger>
              <TabsTrigger value="colors" className="gap-2 rounded-xl data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary" data-testid="tab-colors">
                <Palette className="w-4 h-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="gap-2 rounded-xl data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary" data-testid="tab-typography">
                <Type className="w-4 h-4" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="components" className="gap-2 rounded-xl data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary" data-testid="tab-components">
                <Layout className="w-4 h-4" />
                Components
              </TabsTrigger>
              <TabsTrigger value="voice" className="gap-2 rounded-xl data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary" data-testid="tab-voice">
                <MessageSquare className="w-4 h-4" />
                Voice & Tone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strategy" className="space-y-8">
              <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-2xl">Brand Strategy & Essence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div 
                      className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-2xl border border-white/5"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold mb-3 text-secondary">Mission Statement</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        To democratize business process automation, making powerful AI-driven solutions accessible to organizations of all sizes, enabling them to focus on what matters most—growth and innovation.
                      </p>
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-2xl border border-white/5"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold mb-3 text-secondary">Vision Statement</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        A world where every business operates at peak efficiency, with intelligent automation handling repetitive tasks while humans focus on creativity, strategy, and meaningful work.
                      </p>
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-secondary">Core Values</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {["Innovation", "Reliability", "Transparency", "Empowerment"].map((value, index) => (
                        <motion.div 
                          key={value} 
                          className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 text-center border border-white/5"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, borderColor: "rgba(51, 102, 255, 0.3)" }}
                        >
                          <span className="font-semibold">{value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-secondary">Brand Personality</h3>
                    <div className="flex flex-wrap gap-3">
                      {["Professional", "Innovative", "Approachable", "Results-driven", "Trustworthy"].map((trait) => (
                        <span key={trait} className="px-5 py-2.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium border border-secondary/20 hover:bg-secondary/20 transition-colors cursor-default">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold mb-3 text-secondary">Positioning Statement</h3>
                    <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-4">
                      "For forward-thinking businesses seeking to optimize operations, Dovito.ai is the automation partner that combines cutting-edge AI with intuitive design, delivering measurable results without complexity."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logo" className="space-y-8">
              <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-2xl">Logo System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Primary Logo</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div 
                        className="bg-black rounded-2xl p-12 flex items-center justify-center border border-white/10"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img src={dovitoLogo} alt="Dovito.ai Logo - Dark Background" className="h-16 w-auto" />
                      </motion.div>
                      <motion.div 
                        className="bg-white rounded-2xl p-12 flex items-center justify-center border border-white/10"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img src={dovitoLogo} alt="Dovito.ai Logo - Light Background" className="h-16 w-auto invert" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      The primary logo should be used on dark backgrounds. For light backgrounds, use the inverted version.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Logo Clear Space</h3>
                    <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-8 border border-dashed border-white/20">
                      <div className="border-2 border-dashed border-primary/50 p-8 rounded-xl inline-block">
                        <img src={dovitoLogo} alt="Logo with clear space" className="h-12 w-auto" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Maintain minimum clear space equal to the height of the "D" in Dovito around all sides of the logo.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Logo Don'ts</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        "Don't stretch or distort",
                        "Don't change colors arbitrarily",
                        "Don't add effects or shadows",
                        "Don't rotate the logo",
                        "Don't use on busy backgrounds",
                        "Don't crop any part"
                      ].map((dont) => (
                        <motion.div 
                          key={dont} 
                          className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          {dont}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-8">
              <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-2xl">Color Palette</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {colorPalette.primary.map((color) => (
                        <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Background Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {colorPalette.background.map((color) => (
                        <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Text Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {colorPalette.text.map((color) => (
                        <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Border Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {colorPalette.border.map((color) => (
                        <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Secondary Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {colorPalette.secondary.map((color) => (
                        <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tertiary Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {colorPalette.tertiary.map((color) => (
                        <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Semantic Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {colorPalette.semantic.map((color) => (
                        <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Gradients</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <div 
                          className="h-24 rounded-2xl mb-3 border border-white/10"
                          style={{ background: "linear-gradient(135deg, #1a365d 0%, #4682b4 100%)" }}
                        />
                        <h4 className="font-medium text-sm">Primary Gradient</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          linear-gradient(135deg, #1a365d 0%, #4682b4 100%)
                        </p>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <div 
                          className="h-24 rounded-2xl mb-3 border border-white/10"
                          style={{ background: "linear-gradient(180deg, #001f3f 0%, #3d4a55 100%)" }}
                        />
                        <h4 className="font-medium text-sm">Background Gradient</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          linear-gradient(180deg, #001f3f 0%, #3d4a55 100%)
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-8">
              <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-2xl">Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Font Family</h3>
                    <motion.div 
                      className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/5"
                      whileHover={{ scale: 1.01 }}
                    >
                      <p className="text-4xl font-semibold mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        Inter
                      </p>
                      <p className="text-muted-foreground">
                        Primary typeface for all brand communications
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <Button variant="outline" size="sm" className="rounded-full border-white/20" asChild>
                          <a href="https://fonts.google.com/specimen/Inter" target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download from Google Fonts
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Font Weights</h3>
                    <div className="space-y-4">
                      {typography.weights.map((weight) => (
                        <motion.div 
                          key={weight.name} 
                          className="flex items-center justify-between border-b border-white/5 pb-4 hover:bg-white/5 px-4 py-2 -mx-4 rounded-xl transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center gap-6">
                            <span 
                              className="text-2xl w-32"
                              style={{ fontWeight: weight.value }}
                            >
                              Aa Bb Cc
                            </span>
                            <div>
                              <p className="font-medium">{weight.name}</p>
                              <p className="text-sm text-muted-foreground">{weight.value}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{weight.usage}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Type Scale</h3>
                    <div className="space-y-6">
                      {typography.sizes.map((size) => (
                        <motion.div 
                          key={size.name} 
                          className="flex items-baseline gap-6 border-b border-white/5 pb-4"
                          whileHover={{ x: 4 }}
                        >
                          <span className="text-muted-foreground text-sm w-20">{size.name}</span>
                          <span 
                            className="flex-1"
                            style={{ fontSize: size.size.split(" / ")[0] }}
                          >
                            The quick brown fox
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">{size.size}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="components" className="space-y-8">
              <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-2xl">UI Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Buttons</h3>
                    <div className="flex flex-wrap gap-4">
                      <Button className="rounded-full">Primary Button</Button>
                      <Button variant="secondary" className="rounded-full">Secondary</Button>
                      <Button variant="outline" className="rounded-full border-white/20">Outline</Button>
                      <Button variant="ghost" className="rounded-full">Ghost</Button>
                      <Button variant="destructive" className="rounded-full">Destructive</Button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <Button size="sm" className="rounded-full">Small</Button>
                      <Button size="default" className="rounded-full">Default</Button>
                      <Button size="lg" className="rounded-full">Large</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Cards</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-2xl">
                          <CardHeader>
                            <CardTitle className="text-lg">Card Title</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              Standard card with subtle border and dark background.
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Card className="bg-primary/10 border-primary/30 rounded-2xl">
                          <CardHeader>
                            <CardTitle className="text-lg text-secondary">Highlighted Card</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              Card with primary color accent for emphasis.
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Spacing</h3>
                    <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/5">
                      <p className="text-sm text-muted-foreground mb-4">
                        Use consistent spacing based on 4px increments:
                      </p>
                      <div className="flex items-end gap-4">
                        {[4, 8, 12, 16, 24, 32, 48, 64].map((size) => (
                          <div key={size} className="text-center">
                            <div 
                              className="bg-primary/50 rounded"
                              style={{ width: size, height: size }}
                            />
                            <span className="text-xs text-muted-foreground mt-2 block">{size}px</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Border Radius</h3>
                    <div className="flex gap-6">
                      {[
                        { name: "Small", value: "0.375rem" },
                        { name: "Default", value: "0.75rem" },
                        { name: "Large", value: "1rem" },
                        { name: "Full", value: "9999px" },
                      ].map((radius) => (
                        <motion.div key={radius.name} className="text-center" whileHover={{ scale: 1.1 }}>
                          <div 
                            className="w-16 h-16 bg-primary/30 border border-primary/50"
                            style={{ borderRadius: radius.value }}
                          />
                          <p className="text-sm font-medium mt-2">{radius.name}</p>
                          <p className="text-xs text-muted-foreground">{radius.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice" className="space-y-8">
              <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-2xl">Voice & Tone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Brand Voice</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {brandVoice.personality.map((trait) => (
                        <span key={trait} className="px-5 py-2.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium border border-primary/20">
                          {trait}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {brandVoice.tone}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div 
                      className="bg-gradient-to-br from-green-500/10 to-transparent p-6 rounded-2xl border border-green-500/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        Do's
                      </h3>
                      <ul className="space-y-3">
                        {brandVoice.doList.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-muted-foreground">
                            <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-red-500/10 to-transparent p-6 rounded-2xl border border-red-500/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-5 h-5 text-red-500">✕</span>
                        Don'ts
                      </h3>
                      <ul className="space-y-3">
                        {brandVoice.dontList.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-muted-foreground">
                            <span className="text-red-500 mt-0.5 flex-shrink-0">✕</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sample Messaging</h3>
                    <div className="space-y-4">
                      <motion.div 
                        className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/5"
                        whileHover={{ scale: 1.01 }}
                      >
                        <p className="text-sm text-muted-foreground mb-2">Tagline</p>
                        <p className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">"Automation That Delivers Results"</p>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/5"
                        whileHover={{ scale: 1.01 }}
                      >
                        <p className="text-sm text-muted-foreground mb-2">Elevator Pitch</p>
                        <p className="text-muted-foreground leading-relaxed">
                          "Dovito.ai transforms how businesses operate by automating complex workflows with AI. From document processing to customer communications, we help organizations save time, reduce errors, and scale efficiently—without the complexity of traditional automation tools."
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <footer className="backdrop-blur-sm border-t border-white/10 py-8 mt-20 relative z-10">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 Dovito.ai. All brand assets are property of Dovito.ai.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground">
                For brand asset requests, contact <span className="text-secondary">brand@dovito.ai</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
