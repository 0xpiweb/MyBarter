import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Wallet, ShieldCheck, Zap, Layers, Globe, CheckCircle2, Menu, X, ArrowLeftRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";
import homepageMockup from "@/assets/homepage-mockup.png";
import escrowImg from "@/assets/escrow.jpg";
import swapMockup from "@/assets/swap-mockup.png";
import multichainImg from "@/assets/multichain.jpg";
import logoFullImg from "@/assets/logo-full.png";

interface HomeProps {
  targetSection?: string;
}

export default function Home({ targetSection }: HomeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle initial hash/route scroll
  useEffect(() => {
    if (targetSection) {
      setTimeout(() => {
        document.getElementById(targetSection)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [targetSection]);

  // Smooth scroll
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-3 group hover:opacity-90 transition-opacity text-left"
          >
            {/* Recreated Logo Icon */}
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0a0b14] rounded-[10px] flex items-center justify-center">
                <ArrowLeftRight className="text-cyan-400 w-6 h-6" />
              </div>
            </div>
            {/* Recreated Logo Text */}
            <div className="flex flex-col justify-center">
              <h1 className="font-heading font-bold text-2xl tracking-tight leading-none">
                <span className="text-cyan-400">My</span><span className="text-[#8b5cf6]">Barter</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase mt-1">
                Browse. Offer. Swap.
              </p>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("problem")} className="text-sm font-medium hover:text-primary transition-colors">Problem</button>
            <button onClick={() => scrollTo("solution")} className="text-sm font-medium hover:text-primary transition-colors">Solution</button>
            <button onClick={() => scrollTo("how-it-works")} className="text-sm font-medium hover:text-primary transition-colors">How it Works</button>
            <button onClick={() => scrollTo("pricing")} className="text-sm font-medium hover:text-primary transition-colors">Pricing</button>
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold">
              Launch App
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-white/10 p-4 flex flex-col gap-4">
            <button onClick={() => scrollTo("problem")} className="text-left py-2">Problem</button>
            <button onClick={() => scrollTo("solution")} className="text-left py-2">Solution</button>
            <button onClick={() => scrollTo("how-it-works")} className="text-left py-2">How it Works</button>
            <button onClick={() => scrollTo("pricing")} className="text-left py-2">Pricing</button>
            <Button className="w-full bg-primary text-black">Launch App</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live in Beta
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Trade <span className="text-primary text-glow">Any</span> Asset <br />
              Across <span className="text-white">Any</span> Chain.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              The first trustless cross-chain barter protocol. Swap your digital assets (NFTs, meme coins or any tokenized asset) instantly. No buyer needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 font-bold px-8 h-12 text-lg">
                Start Trading <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

            </div>
          </div>

          <div className="relative group perspective-1000">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
             <img 
               src={homepageMockup} 
               alt="MyBarter Interface" 
               className="relative rounded-xl border border-white/10 shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]"
             />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 bg-card/50 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Liquidity Trap</h2>
            <p className="text-lg text-muted-foreground">
              Marketplaces like OpenSea rely on someone having "cash" (ETH/APE/AVAX) to buy your asset. 
              In a down market, NFTs are illiquid—you have value, but you can't spend it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/50 border-white/10 p-6">
              <div className="mb-4 w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cash Dependent</h3>
              <p className="text-muted-foreground">You can't trade unless someone buys your asset first.</p>
            </Card>
            <Card className="bg-background/50 border-white/10 p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <div className="mb-4 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">The Opportunity</h3>
              <p className="text-muted-foreground">80% of NFT holders want to upgrade their portfolio but don't want to sell for cash.</p>
            </Card>
            <Card className="bg-background/50 border-white/10 p-6">
              <div className="mb-4 w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Chain Silos</h3>
              <p className="text-muted-foreground">Moving value from Ethereum to Solana requires complex bridging and multiple fees.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden border border-white/10 group">
            <img src={escrowImg} alt="Trustless Escrow" className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Trustless <span className="text-primary">Escrow</span>. <br />
              Zero Scams.
            </h2>
            <p className="text-lg text-muted-foreground">
              MyBarter introduces a trustless middleman that enables direct P2P bartering. 
              Our "Robot Lawyer" smart contracts ensure assets are only released when both parties fulfill the deal.
            </p>
            <ul className="space-y-4">
              {[
                "Instant swaps",
                "Automated escrow guarantees fairness",
                "No need for bridging knowledge"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/50 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to swap anything.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { title: "1. Connect", desc: "Scan all your assets across EVM & Solana instantly." },
                { title: "2. Offer", desc: "Propose a swap with optional cash kickers to balance the deal." },
                { title: "3. Execute", desc: "Pay a flat $2 fee and swap. We handle the rest." }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-20" />
              <img src={swapMockup} alt="Swap Interface" className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="relative rounded-2xl overflow-hidden border border-white/10">
               <img src={multichainImg} alt="Multichain Tech" className="w-full h-auto" />
             </div>
             <div className="space-y-8">
               <h2 className="text-3xl md:text-4xl font-bold">The Secret Sauce</h2>
               <p className="text-lg text-muted-foreground">
                 Modular architecture built on Avalanche for speed, using Wormhole for Solana connectivity.
               </p>
               <div className="grid sm:grid-cols-2 gap-6">
                 <Card className="bg-background/50 border-white/10 p-5">
                   <Zap className="text-primary w-8 h-8 mb-4" />
                   <h4 className="font-bold mb-2">Avalanche Speed</h4>
                   <p className="text-sm text-muted-foreground">Sub-second finality for settlement.</p>
                 </Card>
                 <Card className="bg-background/50 border-white/10 p-5">
                   <Globe className="text-blue-400 w-8 h-8 mb-4" />
                   <h4 className="font-bold mb-2">Wormhole</h4>
                   <p className="text-sm text-muted-foreground">Secure cross-chain messaging.</p>
                 </Card>
                 <Card className="bg-background/50 border-white/10 p-5">
                   <ShieldCheck className="text-green-400 w-8 h-8 mb-4" />
                   <h4 className="font-bold mb-2">Circle CCTP</h4>
                   <p className="text-sm text-muted-foreground">Native USDC transfers on any chain.</p>
                 </Card>
                 <Card className="bg-background/50 border-white/10 p-5">
                   <Layers className="text-purple-400 w-8 h-8 mb-4" />
                   <h4 className="font-bold mb-2">LayerZero V2</h4>
                   <p className="text-sm text-muted-foreground">Omnichain interoperability.</p>
                 </Card>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-card/50 border-y border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Fair Pricing for Everyone</h2>
          <div className="max-w-md mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-b from-primary to-transparent opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
            <Card className="relative bg-background border-primary/20 p-8 pt-12">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-primary/20">
                RECOMMENDED
              </div>
              <h3 className="text-2xl font-bold mb-2">Flat Fee</h3>
              <div className="text-5xl font-bold text-primary mb-2">$2.00</div>
              <p className="text-muted-foreground mb-8">per successful swap</p>
              
              <ul className="space-y-4 text-left mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  <span>No percentage fees (vs 2.5% standard)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  <span>Pay in USDC on any chain</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  <span>Gas optimized contracts</span>
                </li>
              </ul>
              
              <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90">
                Start Trading Now
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA / Footer */}
      <footer className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 max-w-4xl mx-auto">
            Ready to break the <br /> 
            <span className="text-primary">Liquidity Trap?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the beta and start trading across Ethereum, Base, Solana, Polygon and Avalanche today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-black hover:bg-primary/90 font-bold px-12 h-14 text-lg">
              Launch App
            </Button>
            <Button size="lg" variant="outline" className="h-14 text-lg px-8 border-white/20 hover:bg-white/5">
              Contact Sales
            </Button>
          </div>
          
          <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
            <p>© 2026 MyBarter Protocol. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">Discord</a>
              <a href="#" className="hover:text-primary transition-colors">Github</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
