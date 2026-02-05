import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ArrowDownRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import narrativeSender from "@/assets/narrative-sender.png";
import narrativeTransit from "@/assets/narrative-transit.png";
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

          {/* The Visual Narrative of Struggle - Expanded Triple Visual */}
          <div className="mt-20 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-12">The Path of Traditional Friction</p>

            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
              {/* Stage 1: The Sender */}
              <div className="relative group">
                <div className="relative rounded-[2rem] overflow-hidden bg-black shadow-2xl aspect-square border-2 border-primary/5">
                  <img src={narrativeSender} alt="Payment successfully sent" className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-accent" />
                      <p className="text-white/60 font-bold uppercase tracking-widest text-[8px]">Stage 01: The Sender</p>
                    </div>
                    <h4 className="text-white text-md font-bold italic">"Successfully Sent"</h4>
                  </div>
                </div>
                <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-primary text-white items-center justify-center shadow-lg">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Stage 2: The Transit (Friction) */}
              <div className="relative group">
                <div className="relative rounded-[2rem] overflow-hidden bg-black shadow-2xl aspect-square border-2 border-primary/5">
                  <img src={narrativeTransit} alt="Payment processing delay" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-destructive" />
                      <p className="text-destructive font-bold uppercase tracking-widest text-[8px]">Stage 02: Legacy Transit</p>
                    </div>
                    <h4 className="text-white text-md font-bold italic">Intermediary Holds & Fees</h4>
                  </div>
                </div>
                <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-destructive text-white items-center justify-center shadow-lg animate-pulse">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Stage 3: The Recipient (Human Struggle) */}
              <div className="relative group">
                <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-2xl aspect-square border-4 border-destructive/20">
                  <img src={humanStruggle} alt="Frustrated recipient waiting" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-3 h-3 text-destructive" />
                      <p className="text-white/60 font-bold uppercase tracking-widest text-[8px]">Stage 03: The Recipient</p>
                    </div>
                    <h4 className="text-white text-md font-bold italic">"Where is my money?"</h4>
                  </div>
                  {/* Floating badge refined */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-destructive text-white rounded-full flex items-center justify-center font-bold text-center border-4 border-white shadow-2xl -rotate-12">
                    <p className="text-[9px] leading-tight font-black">7-DAY<br />DELAY</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-primary/60 font-medium italic">
                GigChain Pay collapses this expensive maze into a single, atomic second.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
