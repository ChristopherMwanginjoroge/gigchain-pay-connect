import { useState, useEffect, useRef } from "react";
import { ShieldAlert, Globe2, Unlock } from "lucide-react";

const benefits = [
  {
    title: "Low Fees",
    text: "Reduce payment costs to less than 2%—saving you money on every transaction."
  },
  {
    title: "Secure Compliance",
    text: "Built-in security aligned with central bank rules for institutional trust."
  },
  {
    title: "True Ownership",
    text: "You own your funds. No one can freeze your money without your consent."
  },
  {
    title: "Easy Exits",
    text: "Designed for the local market with seamless M-Pesa or bank transfers."
  },
];

const BusinessModel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-primary relative overflow-hidden"
    >
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />

      <div className="container relative z-10">
        <div className={`text-center mb-16 transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in zoom-in slide-in-from-bottom-8 opacity-100" : "opacity-0"
          }`}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-black uppercase tracking-wider mb-5 border border-white/10">
            The GigChain Advantage
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
            Built for the <span className="text-accent italic font-black">Future of Africa.</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Delivering instant, low-cost payments on a reliable global network.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left content - Value Matrix */}
          <div className={`space-y-6 transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in slide-in-from-left-12 opacity-100" : "opacity-0"
            }`}>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-7 hover:bg-white/10 transition-all duration-1000 group ${isVisible ? "animate-in fade-in slide-in-from-bottom-4 opacity-100" : "opacity-0"
                    } fill-mode-both`}
                  style={{ animationDelay: isVisible ? `${(index + 1) * 200}ms` : "0ms" }}
                >
                  <h3 className="text-white font-black mb-2 tracking-tighter text-xs uppercase">{benefit.title}</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">{benefit.text}</p>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div
              className={`bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group transition-all duration-1000 ${isVisible ? "animate-in fade-in slide-in-from-bottom-8 opacity-100" : "opacity-0"
                } fill-mode-both`}
              style={{ animationDelay: isVisible ? '1000ms' : "0ms" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-x-8 -translate-y-8" />
              <h3 className="text-xl font-black text-primary mb-6 italic tracking-tighter uppercase whitespace-nowrap">The $54B Market Reality</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-black text-primary mb-1">43%</p>
                  <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest leading-tight">Stablecoin <br />TX Volume</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-primary mb-1">&lt;2%</p>
                  <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest leading-tight">Total <br />Transaction Cost</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-primary mb-1">$0.0001</p>
                  <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest leading-tight">Fixed <br />Hedera Fee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - The Network Edge */}
          <div className={`space-y-6 transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in slide-in-from-right-12 opacity-100" : "opacity-0"
            }`}>
            <h3 className="text-2xl font-black text-white mb-6 tracking-tighter uppercase">Financial Moat</h3>
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="w-4 h-4 text-accent" />
                  <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] text-accent">Full Independence</p>
                </div>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  We use native USDC for direct payments. No middleman risks, no custodial locks on your money.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/10 border border-border/20 backdrop-blur-sm group hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-accent" />
                  <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] text-accent">Institutional Grade</p>
                </div>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  We use the same high-standard rails as global banks. Secure, sustainable, and built to scale.
                </p>
              </div>
            </div>
            <div className="mt-10 p-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl transition-all hover:scale-[1.02] duration-500">
              <div className="bg-primary p-5 rounded-[0.9rem] flex items-center justify-between">
                <div>
                  <p className="text-white font-black text-base tracking-tighter italic uppercase">Built for global professionals</p>
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1">Nairobi | Lagos | Global</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Globe2 className="w-5 h-5 text-accent animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
