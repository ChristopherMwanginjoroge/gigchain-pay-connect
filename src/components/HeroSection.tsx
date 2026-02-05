import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import humanStruggle from "@/assets/human-struggle.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/20">
      {/* Background decorative elements - polished */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/2 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="container relative z-10 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="max-w-5xl mx-auto text-center mt-12">
          {/* Large Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] mb-8 tracking-tighter animate-fade-up">
            The Protocol for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">Global Fluidity.</span>
          </h1>

          {/* Profound but simple explanation */}
          <div className="max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-lg md:text-xl text-primary/60 font-medium leading-[1.4] mb-6">
              True independence from legacy custodial rails. We've collapsed banking hops into a single, atomic settlement layer—no mandatory reliance on banks, SWIFT, or intermediary tolls.
            </p>
            <p className="text-base text-primary/40 leading-relaxed font-medium">
              By leveraging Hedera's enterprise-grade hashgraph (governed by Google, IBM, and Boeing), GigPay bypasses the 3-5 day clearing cycles of traditional finance for near-zero fee fluidity.
            </p>
          </div>

          {/* CTA Area removed per request */}

          {/* Visualizing the Grid of Friction vs Flow */}
          <div className="grid md:grid-cols-3 gap-6 mb-24 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="p-8 bg-black/5 backdrop-blur-xl rounded-[2rem] border border-black/10 shadow-sm transition-all hover:bg-black/10">
              <p className="text-3xl font-black text-primary tracking-tighter mb-1">0.5%</p>
              <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.2em]">Efficiency Standard</p>
            </div>
            <div className="p-8 bg-primary rounded-[2rem] border border-primary shadow-2xl transition-all hover:scale-105">
              <p className="text-3xl font-black text-white tracking-tighter mb-1">3s</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Settlement Velocity</p>
            </div>
            <div className="p-8 bg-black/5 backdrop-blur-xl rounded-[2rem] border border-black/10 shadow-sm transition-all hover:bg-black/10">
              <p className="text-3xl font-black text-primary tracking-tighter mb-1">24/7</p>
              <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.2em]">Atomic Accessibility</p>
            </div>
          </div>

          {/* The Visual Narrative of Struggle - Refined & Human-Centric */}
          <div className="mt-20 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">The Human Cost of Legacy Finance</p>
            <div className="relative group p-1.5 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white/20 shadow-xl">
              <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-inner aspect-square">
                <img
                  src={humanStruggle}
                  alt="Freelancer experiencing transfer delay"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 hover:scale-105"
                />
                {/* Simplified Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center">
                  <p className="text-accent font-bold uppercase tracking-[0.4em] text-[8px] mb-2 text-center">Bypass the digital barrier</p>
                  <h3 className="text-white text-lg font-bold tracking-tight text-center px-4">Financial Autonomy vs. Transactional Inertia</h3>
                </div>
              </div>

              {/* Floating badge refined */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-destructive text-white rounded-full flex items-center justify-center font-bold text-center border-4 border-white shadow-2xl -rotate-12">
                <p className="text-[10px] leading-tight font-black">STOP THE<br />FEE DRAIN</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
