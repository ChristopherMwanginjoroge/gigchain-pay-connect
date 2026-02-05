import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gigchain-green/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-primary-foreground/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10 pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
          <div className="container flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">GC</span>
              </div>
              <span className="text-primary-foreground font-bold text-xl">GigChain Pay</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#problem" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">Solution</a>
              <a href="#how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">How It Works</a>
              <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">Features</a>
              <a href="#benefits" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">Benefits</a>
            </div>
            <Button variant="cta" size="sm">
              Get Started
            </Button>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
          {/* Left content */}
          <div className="text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-primary-foreground/90 text-sm font-medium">Now in Beta • Testnet Phase</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              GigChain Pay:{" "}
              <span className="text-accent">Instant, Low-Fee</span>{" "}
              Payments for Global Gigs
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Empowering Kenyan freelancers to earn more from international clients using secure phone-linked USDC on Hedera.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl">
                Get Started
                <ArrowRight className="ml-2" />
              </Button>
              <Button variant="outline_hero" size="xl">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-primary-foreground/20">
              <div>
                <p className="text-3xl font-bold text-accent">&lt;2%</p>
                <p className="text-primary-foreground/70 text-sm">Transaction Fees</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">3-5s</p>
                <p className="text-primary-foreground/70 text-sm">Settlement Time</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">$25+</p>
                <p className="text-primary-foreground/70 text-sm">Monthly Savings</p>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Kenyan freelancer receiving global payments" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-lg animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-lg">$</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Payment Received</p>
                  <p className="text-xs text-muted-foreground">+$150 USDC from Canada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
