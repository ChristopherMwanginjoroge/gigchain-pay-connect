import { useState, useEffect, useRef } from "react";
import { Unlock, Zap, Smartphone } from "lucide-react";

const ProblemSolution = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle visibility state based on intersection
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset when leaving the viewport to allow repetition
          setIsVisible(false);
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the section is visible
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
      id="problem"
      ref={sectionRef}
      className="relative h-screen min-h-[600px] flex items-center bg-white overflow-hidden"
    >
      {/* Decorative background blurs - subtle */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

      <div className="container relative z-10 py-4 max-w-5xl mx-auto">
        <div className="w-full">
          {/* Centered Heading - Pop-up Animation repeated on scroll */}
          <div className={`text-center mb-12 lg:mb-20 transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in zoom-in slide-in-from-bottom-8 opacity-100" : "opacity-0"
            }`}>
            <h2 className="text-2xl md:text-4xl lg:text-7xl font-black text-primary tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
              The Reality of <span className="text-accent italic font-black">Global Money.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-start max-w-5xl mx-auto">
            {/* The Problem - Left-Fade Animation repeated on scroll */}
            <div className={`space-y-6 transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in slide-in-from-left-12 opacity-100" : "opacity-0"
              }`}>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-destructive font-black text-[11px] uppercase tracking-[0.3em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  Legacy Limitations
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-primary tracking-tighter leading-tight">The Middleman Tax</h3>
              </div>

              <div className="grid gap-3">
                {[
                  { text: "Up to 15% value loss", detail: "Hidden costs in every move" },
                  { text: "Slow processing", detail: "Held by banks for days" },
                  { text: "Limited control", detail: "Banks own your access" },
                  { text: "Privacy risks", detail: "Third-party dependency" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3.5 bg-black/5 rounded-2xl border border-black/5 group hover:bg-black/[0.07] transition-all duration-300 ${isVisible ? "animate-in fade-in slide-in-from-left-8 opacity-100" : "opacity-0"
                      } fill-mode-both`}
                    style={{
                      animationDelay: isVisible ? `${(i + 1) * 250}ms` : "0ms",
                      animationDuration: '1200ms'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <span className="text-primary/90 text-sm font-black uppercase tracking-wider">{item.text}</span>
                    </div>
                    <span className="text-primary/30 text-[10px] font-black uppercase tracking-widest hidden lg:block">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Solution - Staggered Fade Up repeated on scroll */}
            <div className={`space-y-6 transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in slide-in-from-right-12 opacity-100" : "opacity-0"
              }`}>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-accent font-black text-[11px] uppercase tracking-[0.3em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Financial Freedom
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-primary tracking-tighter leading-tight">Direct Global Access.</h3>
              </div>

              <div className="grid gap-4">
                <div
                  className={`flex items-center gap-5 p-5 bg-primary rounded-[2.5rem] border border-primary shadow-xl hover:scale-[1.02] transition-all cursor-default ${isVisible ? "animate-in fade-in slide-in-from-bottom-4 opacity-100" : "opacity-0"
                    } duration-[1200ms] fill-mode-both`}
                  style={{ animationDelay: isVisible ? '600ms' : "0ms" }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Unlock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm uppercase tracking-wider">Full Control</h4>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none mt-1">You own your money</p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-5 p-5 bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-all group cursor-default ${isVisible ? "animate-in fade-in slide-in-from-bottom-4 opacity-100" : "opacity-0"
                    } duration-[1200ms] fill-mode-both`}
                  style={{ animationDelay: isVisible ? '900ms' : "0ms" }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-primary font-black text-sm uppercase tracking-wider">Zero Costs</h4>
                    <p className="text-primary/40 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Fees under 1%</p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-5 p-5 bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-all group cursor-default ${isVisible ? "animate-in fade-in slide-in-from-bottom-4 opacity-100" : "opacity-0"
                    } duration-[1200ms] fill-mode-both`}
                  style={{ animationDelay: isVisible ? '1200ms' : "0ms" }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-primary font-black text-sm uppercase tracking-wider">Universal</h4>
                    <p className="text-primary/40 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Just a phone number</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
