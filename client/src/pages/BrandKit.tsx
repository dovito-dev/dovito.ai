import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Download,
  Palette,
  Type,
  Layout,
  Image,
  MessageSquare,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dovitoLogo from "@assets/white_1749151126542.png";

const colorPalette = {
  primary: [
    { name: "Primary Blue", hex: "#3366FF", hsl: "240 100% 60%", rgb: "51, 102, 255", usage: "Primary actions, links, highlights" },
    { name: "Primary Light", hex: "#94A6FF", hsl: "231 100% 79%", rgb: "148, 166, 255", usage: "Beams effect, accents" },
  ],
  background: [
    { name: "Background", hex: "#000000", hsl: "0 0% 0%", rgb: "0, 0, 0", usage: "Main background" },
    { name: "Card", hex: "#080808", hsl: "0 0% 3%", rgb: "8, 8, 8", usage: "Cards, elevated surfaces" },
    { name: "Muted", hex: "#0D0D0D", hsl: "0 0% 5%", rgb: "13, 13, 13", usage: "Secondary backgrounds" },
  ],
  text: [
    { name: "Foreground", hex: "#FAFAFA", hsl: "0 0% 98%", rgb: "250, 250, 250", usage: "Primary text" },
    { name: "Muted Text", hex: "#A6A6A6", hsl: "0 0% 65%", rgb: "166, 166, 166", usage: "Secondary text, descriptions" },
  ],
  border: [
    { name: "Border", hex: "#1A1A1A", hsl: "0 0% 10%", rgb: "26, 26, 26", usage: "Dividers, outlines" },
    { name: "Border Light", hex: "#FFFFFF1A", hsl: "0 0% 100% / 10%", rgb: "255, 255, 255, 0.1", usage: "Subtle borders" },
  ],
  accent: [
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
        className="h-24 rounded-lg mb-3 border border-border/50 cursor-pointer transition-transform hover:scale-105"
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
  const { toast } = useToast();

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-6 mb-12">
            <img src={dovitoLogo} alt="Dovito.ai" className="h-12 w-auto" />
            <div>
              <h1 className="text-4xl font-bold">Brand Kit</h1>
              <p className="text-muted-foreground mt-1">Official brand guidelines and assets</p>
            </div>
          </div>

          <Tabs defaultValue="strategy" className="space-y-8">
            <TabsList className="bg-card border border-border/50 p-1 h-auto flex-wrap">
              <TabsTrigger value="strategy" className="gap-2" data-testid="tab-strategy">
                <FileText className="w-4 h-4" />
                Strategy
              </TabsTrigger>
              <TabsTrigger value="logo" className="gap-2" data-testid="tab-logo">
                <Image className="w-4 h-4" />
                Logo
              </TabsTrigger>
              <TabsTrigger value="colors" className="gap-2" data-testid="tab-colors">
                <Palette className="w-4 h-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="gap-2" data-testid="tab-typography">
                <Type className="w-4 h-4" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="components" className="gap-2" data-testid="tab-components">
                <Layout className="w-4 h-4" />
                Components
              </TabsTrigger>
              <TabsTrigger value="voice" className="gap-2" data-testid="tab-voice">
                <MessageSquare className="w-4 h-4" />
                Voice & Tone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strategy" className="space-y-8">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Brand Strategy & Essence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-primary">Mission Statement</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        To democratize business process automation, making powerful AI-driven solutions accessible to organizations of all sizes, enabling them to focus on what matters most—growth and innovation.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-primary">Vision Statement</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        A world where every business operates at peak efficiency, with intelligent automation handling repetitive tasks while humans focus on creativity, strategy, and meaningful work.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Core Values</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {["Innovation", "Reliability", "Transparency", "Empowerment"].map((value) => (
                        <div key={value} className="bg-muted/50 rounded-lg p-4 text-center">
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Brand Personality</h3>
                    <div className="flex flex-wrap gap-3">
                      {["Professional", "Innovative", "Approachable", "Results-driven", "Trustworthy"].map((trait) => (
                        <span key={trait} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Positioning Statement</h3>
                    <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-4">
                      "For forward-thinking businesses seeking to optimize operations, Dovito.ai is the automation partner that combines cutting-edge AI with intuitive design, delivering measurable results without complexity."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logo" className="space-y-8">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Logo System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Primary Logo</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-black rounded-xl p-12 flex items-center justify-center border border-border/50">
                        <img src={dovitoLogo} alt="Dovito.ai Logo - Dark Background" className="h-16 w-auto" />
                      </div>
                      <div className="bg-white rounded-xl p-12 flex items-center justify-center border border-border/50">
                        <img src={dovitoLogo} alt="Dovito.ai Logo - Light Background" className="h-16 w-auto invert" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      The primary logo should be used on dark backgrounds. For light backgrounds, use the inverted version.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Logo Clear Space</h3>
                    <div className="bg-muted/30 rounded-xl p-8 border border-dashed border-border">
                      <div className="border-2 border-dashed border-primary/50 p-8 rounded-lg inline-block">
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
                        <div key={dont} className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-center">
                          {dont}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-8">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Color Palette</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
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
                    <h3 className="text-lg font-semibold mb-4">Accent Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {colorPalette.accent.map((color) => (
                        <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Gradients</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div 
                          className="h-24 rounded-lg mb-3 border border-border/50"
                          style={{ background: "linear-gradient(135deg, #3366FF 0%, #94A6FF 100%)" }}
                        />
                        <h4 className="font-medium text-sm">Primary Gradient</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          linear-gradient(135deg, #3366FF 0%, #94A6FF 100%)
                        </p>
                      </div>
                      <div>
                        <div 
                          className="h-24 rounded-lg mb-3 border border-border/50"
                          style={{ background: "linear-gradient(180deg, #000000 0%, #0D0D0D 100%)" }}
                        />
                        <h4 className="font-medium text-sm">Background Gradient</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          linear-gradient(180deg, #000000 0%, #0D0D0D 100%)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-8">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Font Family</h3>
                    <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                      <p className="text-4xl font-semibold mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        Inter
                      </p>
                      <p className="text-muted-foreground">
                        Primary typeface for all brand communications
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://fonts.google.com/specimen/Inter" target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download from Google Fonts
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Font Weights</h3>
                    <div className="space-y-4">
                      {typography.weights.map((weight) => (
                        <div key={weight.name} className="flex items-center justify-between border-b border-border/30 pb-4">
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
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Type Scale</h3>
                    <div className="space-y-6">
                      {typography.sizes.map((size) => (
                        <div key={size.name} className="flex items-baseline gap-6 border-b border-border/30 pb-4">
                          <span className="text-muted-foreground text-sm w-20">{size.name}</span>
                          <span 
                            className="flex-1"
                            style={{ fontSize: size.size.split(" / ")[0] }}
                          >
                            The quick brown fox
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">{size.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="components" className="space-y-8">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>UI Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Buttons</h3>
                    <div className="flex flex-wrap gap-4">
                      <Button>Primary Button</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Cards</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-card border-border/50">
                        <CardHeader>
                          <CardTitle className="text-lg">Card Title</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            Standard card with subtle border and dark background.
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-primary/10 border-primary/30">
                        <CardHeader>
                          <CardTitle className="text-lg text-primary">Highlighted Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            Card with primary color accent for emphasis.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Spacing</h3>
                    <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
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
                        <div key={radius.name} className="text-center">
                          <div 
                            className="w-16 h-16 bg-primary/30 border border-primary/50"
                            style={{ borderRadius: radius.value }}
                          />
                          <p className="text-sm font-medium mt-2">{radius.name}</p>
                          <p className="text-xs text-muted-foreground">{radius.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice" className="space-y-8">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Voice & Tone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Brand Voice</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {brandVoice.personality.map((trait) => (
                        <span key={trait} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {trait}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {brandVoice.tone}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
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
                    </div>
                    <div>
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
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sample Messaging</h3>
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-2">Tagline</p>
                        <p className="text-xl font-semibold">"Automation That Delivers Results"</p>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-2">Elevator Pitch</p>
                        <p className="text-muted-foreground leading-relaxed">
                          "Dovito.ai transforms how businesses operate by automating complex workflows with AI. From document processing to customer communications, we help organizations save time, reduce errors, and scale efficiently—without the complexity of traditional automation tools."
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <footer className="mt-16 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© 2024 Dovito.ai. All brand assets are property of Dovito.ai.</p>
          <p className="mt-2">For brand asset requests, contact <span className="text-primary">brand@dovito.ai</span></p>
        </footer>
      </div>
    </div>
  );
}
