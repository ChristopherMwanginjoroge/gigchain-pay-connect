import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "Instant Transactions",
    description: "Move money globally in 3-5 seconds. No more bank holidays, no more waiting days for settlement.",
  },
  {
    title: "Advanced AI Security",
    description: "Automatic fraud detection and AI scoring tuned for modern risks—keeping your money and identity safe.",
  },
  {
    title: "Reliable Network",
    description: "Built on high-performance infrastructure trusted by global leaders. Secure and always active.",
  },
  {
    title: "Automatic Yield",
    description: "Earn 4-8% yearly on your digital assets automatically. Your money works for you while you carry on with your day.",
  },
  {
    title: "Secure & Compliant",
    description: "Fully aligned with global standards while remaining accessible to everyone, everywhere.",
  },
  {
    title: "Universal ID",
    description: "Your phone number is your key. No complex crypto addresses or bank account codes needed to transact.",
  },
];

const KeyFeatures = () => {
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
      id="features"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-background relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="container relative z-10">
        <div className={`text-center mb-16 transition-all duration-[1500ms] ${isVisible ? "animate-in fade-in zoom-in slide-in-from-bottom-8 opacity-100" : "opacity-0"
          }`}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[11px] font-black uppercase tracking-wider mb-5 border border-primary/10">
            Platform Benefits
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 tracking-tight uppercase">
            Transact with Total Confidence.
          </h2>
          <p className="text-primary/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Professional tools for everyone. Get the power of a global bank directly on your phone.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`relative bg-white rounded-3xl p-8 border border-border shadow-sm transition-all duration-[1200ms] overflow-hidden ${isVisible ? "animate-in fade-in slide-in-from-bottom-8 opacity-100" : "opacity-0"
                } fill-mode-both`}
              style={{
                animationDelay: isVisible ? `${index * 200}ms` : "0ms",
                animationDuration: '1200ms'
              }}
            >
              <div className="relative">
                <h3 className="text-lg font-black text-primary mb-3 tracking-tighter uppercase">{feature.title}</h3>
                <p className="text-primary/60 text-xs font-medium leading-relaxed transition-colors">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
