"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Palette, 
  Type, 
  Layout, 
  MousePointer2, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Home,
  ShieldCheck,
  UserCheck
} from "lucide-react"

export default function StyleGuidePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Palette className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">CleanSweep Style Guide</h1>
        </div>
        <p className="text-lg text-muted-foreground">The visual identity and component standards for the CleanSweep platform.</p>
      </header>

      {/* Colors Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Color Palette</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { name: "Primary Teal", class: "bg-primary", hex: "#00A896", label: "Brand Identity" },
            { name: "Accent Mint", class: "bg-accent", hex: "#4AD991", label: "Action Buttons" },
            { name: "Navy Sidebar", class: "bg-[hsl(174,100%,12%)]", hex: "#001D1A", label: "Navigation" },
            { name: "Fresh Background", class: "bg-background border", hex: "#F7FEFC", label: "Main Canvas" },
            { name: "Secondary Mint", class: "bg-secondary", hex: "#E6F7F2", label: "Subtle Areas" },
          ].map((color) => (
            <div key={color.name} className="flex flex-col gap-2 p-4 bg-white rounded-2xl border shadow-sm">
              <div className={`h-24 w-full rounded-xl ${color.class}`} />
              <div className="mt-2">
                <p className="font-bold text-sm">{color.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                <Badge variant="secondary" className="mt-1 text-[10px] uppercase font-bold tracking-wider">{color.label}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2">
          <Type className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Typography</h2>
        </div>
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-8 space-y-8 bg-white">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold font-headline">Heading 1</h1>
              <p className="text-sm text-muted-foreground font-mono">Font: Inter Bold / Size: 48px</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold font-headline">Heading 2</h2>
              <p className="text-sm text-muted-foreground font-mono">Font: Inter Bold / Size: 30px</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-headline">Heading 3</h3>
              <p className="text-sm text-muted-foreground font-mono">Font: Inter Bold / Size: 20px</p>
            </div>
            <div className="space-y-2">
              <p className="text-base leading-relaxed">
                Body Text: Professional home cleaning services tailored to your life. From recurring visits to deep cleans, we bring the sparkle back to your space.
              </p>
              <p className="text-sm text-muted-foreground font-mono">Font: Inter Regular / Size: 16px</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Components Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2">
          <MousePointer2 className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Buttons & Controls</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Action Buttons</CardTitle>
              <CardDescription>Primary and decorative actions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button className="bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20">
                Get Free Estimate
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Primary Action
              </Button>
              <Button variant="outline">Secondary Action</Button>
              <Button variant="ghost">Ghost Button</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Badges & Indicators</CardTitle>
              <CardDescription>Status and category labels</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge className="bg-accent text-white">Active Service</Badge>
              <Badge variant="secondary">Recurring Clean</Badge>
              <Badge variant="outline" className="border-primary text-primary">Certified</Badge>
              <Badge variant="destructive">Urgent Alert</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Brand Cards Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2">
          <Layout className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Brand Card Styles</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-accent/20 overflow-hidden group">
            <div className="h-48 bg-secondary relative overflow-hidden">
               <img 
                src="https://picsum.photos/seed/clean1/600/400" 
                alt="Cleaning" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                data-ai-hint="clean house"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-accent text-white border-none">Recurring</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Premium Cleaning
              </CardTitle>
              <CardDescription>The perfect maintenance plan for busy families.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> Regular maintenance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> Same professional team
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary text-white border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <CardHeader>
              <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Bonded & Insured</CardTitle>
              <CardDescription className="text-white/80">Your home is safe with us. We carry full liability insurance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-accent hover:bg-accent/90 border-none shadow-xl">
                View Policy Details
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/30 bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Background Checked
              </CardTitle>
              <CardDescription>Every CleanSweep professional undergoes rigorous screening.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-accent/10">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Verification Status</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">100% Verified</span>
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Brand Motto Section */}
      <section className="bg-white rounded-3xl p-12 text-center border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold font-headline leading-tight">
            Your Home, <span className="text-accent">Cleaned Your Way.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We don't just clean; we restore your peace of mind. Our 49-point checklist ensures your home meets our highest standards of cleanliness every single time.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 h-14 px-8 rounded-full shadow-xl shadow-accent/20">
              Start Free Custom Plan
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}