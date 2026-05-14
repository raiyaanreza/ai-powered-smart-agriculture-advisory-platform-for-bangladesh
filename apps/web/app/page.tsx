import { Button, GlassCard, Badge } from "@agri-packages/ui";
import { 
  Camera, 
  Leaf, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  MessageSquare,
  Search,
  Users
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-forest text-foreground selection:bg-emerald/30">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald/10 via-forest to-forest opacity-40" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-mint/5 via-forest to-forest opacity-30" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-forest/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald shadow-[0_0_20px_rgba(56,210,125,0.4)]">
              <Leaf className="text-forest h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">AgriVision<span className="text-emerald">.ai</span></span>
          </div>
          
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-foreground/70 transition-colors hover:text-emerald">Features</Link>
            <Link href="#about" className="text-sm font-medium text-foreground/70 transition-colors hover:text-emerald">About</Link>
            <Link href="/alerts" className="text-sm font-medium text-foreground/70 transition-colors hover:text-emerald">Alerts</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="glass" size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Outbreak Banner */}
        <div className="container mx-auto px-6 pt-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
              <Badge variant="pulse">ALERT</Badge>
              <span>⚠️ Brown Spot Outbreak - Rajshahi Region. <Link href="/alerts" className="underline hover:text-red-300">View Details</Link></span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="emerald" className="mb-6 py-1 px-4">Trusted by 50,000+ Farmers</Badge>
            <h1 className="text-5xl font-bold leading-tight tracking-tighter md:text-7xl">
              AI-Powered Smart <br /> 
              <span className="bg-gradient-to-r from-emerald to-gold bg-clip-text text-transparent">Agriculture for Bangladesh</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-foreground/60 md:text-xl">
              Instant disease diagnosis, localized crop advisory, and real-time weather-risk alerts in Bangla. তাত্ক্ষণিক রোগ নির্ণয় ও পরামর্শ।
            </p>
            
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/diagnose">
                <Button variant="gold" size="lg" className="group">
                  Diagnose Your Crop Now
                  <ChevronRight className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="glass" size="lg">How It Works</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Supported Crops */}
        <section id="features" className="container mx-auto px-6 py-24 border-t border-white/5">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">Supported Crops</h2>
            <p className="mt-4 text-foreground/60">AI models trained on local Bangladeshi varieties.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {['Rice', 'Wheat', 'Corn', 'Potato', 'Brassica', 'Jute'].map((crop) => (
              <GlassCard key={crop} className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <Leaf className="h-6 w-6" />
                </div>
                <span className="font-semibold">{crop}</span>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-surface/30 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-4 text-foreground/60">Simple 3-step process to secure your harvest.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: 'Upload', desc: 'Take a photo of the affected plant. আক্রান্ত গাছের ছবি তুলুন।', icon: Camera },
                { title: 'Analyze', desc: 'AI scans for disease patterns instantly. এআই তাৎক্ষণিকভাবে রোগ নির্ণয় করে।', icon: Zap },
                { title: 'Treat', desc: 'Get verified treatment plans. যাচাইকৃত চিকিৎসা পরিকল্পনা পান।', icon: ShieldCheck },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald/20 text-emerald shadow-[0_0_30px_rgba(56,210,125,0.15)]">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-4 text-foreground/60 leading-relaxed">{step.desc}</p>
                  {i < 2 && <ChevronRight className="absolute -right-4 top-8 hidden h-8 w-8 text-white/10 md:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid gap-8 lg:grid-cols-3">
            <GlassCard className="lg:col-span-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-gold">AI Diagnosis</h3>
              <p className="mt-4 text-foreground/60 leading-relaxed">
                Upload field images for sub-second pathogen identification powered by our custom computer vision models trained on South Asian agronomic data.
              </p>
            </GlassCard>

            <GlassCard className="lg:col-span-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald/10 text-emerald">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-emerald">Expert Network</h3>
              <p className="mt-4 text-foreground/60 leading-relaxed">
                Complex cases are automatically routed to our network of verified agronomists for human-in-the-loop validation, ensuring high-stakes decisions are always correct.
              </p>
            </GlassCard>

            <GlassCard className="lg:col-span-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-mint">Regional Monitoring</h3>
              <p className="mt-4 text-foreground/60 leading-relaxed">
                Access real-time geospatial maps tracking disease outbreaks, pest migrations, and hyper-local weather risks across different agricultural zones.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-forest py-12 text-center text-foreground/40">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium mb-8">
              <Link href="#" className="hover:text-emerald">Government Portals</Link>
              <Link href="#" className="hover:text-emerald">Expert Network</Link>
              <Link href="#" className="hover:text-emerald">Privacy Policy</Link>
              <Link href="#" className="hover:text-emerald">Terms of Service</Link>
            </div>
            <p>© 2026 AgriVision AI. A Government of Bangladesh Initiative.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
