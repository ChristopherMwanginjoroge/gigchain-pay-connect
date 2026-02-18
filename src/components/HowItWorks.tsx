import { useState, useEffect, useRef } from "react";
import { Smartphone, Share2, Wallet, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Verify Phone",
    description: "Enter your phone number to start. No complex setup required.",
    highlight: "Your global ID."
  },
  {
    number: "02",
    icon: Share2,
    title: "Request Payment",
    description: "Share your phone number. We handle the rest automatically.",
    highlight: "Works everywhere."
  },
  {
    number: "03",
    icon: Wallet,
    title: "Receive Money",
    description: "Get paid in seconds. Keep or spend your funds instantly.",
    highlight: "Instant access."
  },
];

const HowItWorks = () => {
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
      { threshold: 0.15 }
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
      id="how-it-works"
      ref={sectionRef}
      className="relative h-screen min-h-[600px] flex items-center bg-primary overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 py-4 max-w-5xl mx-auto">
        <div className="w-full">
          {/* Centered Heading - Single Line + Pop-up Animation repeated on scroll */}
          <div className={`text-center mb-12 lg:mb-20 transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in zoom-in slide-in-from-bottom-8 opacity-100" : "opacity-0"
            }`}>
            <h2 className="text-3xl lg:text-7xl font-black text-white tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis uppercase">
              How It <span className="text-accent italic font-black">Works.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-10 relative max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) - Subtle */}
            <div className="hidden lg:block absolute top-[2.25rem] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`group relative flex flex-col items-center text-center transition-all duration-[1200ms] ${isVisible ? "animate-in fade-in slide-in-from-bottom-8 opacity-100" : "opacity-0"
                  } fill-mode-both`}
                style={{
                  animationDelay: isVisible ? `${index * 300}ms` : "0ms",
                  animationDuration: '1200ms'
                }}
              >
                {/* Step Icon & Number - Scaled Down */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 transition-all duration-500 relative z-10">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary border border-white/20 flex items-center justify-center z-20">
                    <span className="text-white text-[9px] font-black tracking-tighter">{step.number}</span>
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Step Content - Scaled Down & Bolder */}
                <div className="space-y-3">
                  <h3 className="text-lg lg:text-xl font-black text-white tracking-tighter">{step.title}</h3>
                  <p className="text-white/50 text-xs font-medium leading-[1.5] max-w-[200px] mx-auto">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center gap-2 py-1 px-3 bg-white/5 rounded-full border border-white/5 group-hover:bg-white/10 transition-colors">
                    <div className="w-1 h-1 rounded-full bg-accent" />
                    <span className="text-accent text-[9px] font-black uppercase tracking-widest">{step.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA area - Compacted */}
          <div className={`mt-12 lg:mt-20 pt-8 border-t border-white/5 text-center transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in slide-in-from-bottom-4 opacity-100" : "opacity-0"
            }`} style={{ animationDelay: isVisible ? '1200ms' : "0ms" }}>
            <div className="inline-flex p-0.5 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
              <div className="bg-primary px-6 py-3 rounded-[1.5rem] flex items-center justify-between gap-8 group hover:bg-white/10 transition-colors cursor-pointer">
                <span className="text-white font-black text-xs tracking-tight uppercase">Ready to start?</span>
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
