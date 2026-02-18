import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "Non-Custodial Wallet",
    description: "Your private keys are stored on your device. You control your funds. Pay by sharing your phone number—no seed phrases.",
  },
  {
    title: "Near-Zero Fees & Instant",
    description: "$0.0001-$0.001 fees and 0.4-5 second finality on Hedera/Solana. Cut total payout costs to under 2%.",
  },
  {
    title: "Stablecoin + Yield",
    description: "Hold value in USDC to avoid currency swings. Optional yield of 4-8% APY on idle balances.",
  },
  {
    title: "Multi-Chain Choice",
    description: "Choose Hedera (lowest fees) or Solana (speed + Coinbase integration).",
  },
  {
    title: "Built for Gig Workers",
    description: "Phone-linked invoices, planned escrow, and fraud protection built for freelancers.",
  },
  {
    title: "Africa-First, US Tech",
    description: "Kenya-first UX with global rails (Circle USDC, Coinbase ramps, Hedera/Solana).",
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
      className="py-16 lg:py-20 bg-background relative overflow-hidden -mt-px"
      style={{ perspective: '1000px' }}
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="container relative z-10 px-4 md:px-6" style={{ transformStyle: 'preserve-3d' }}>
        <div className="text-center mb-10 md:mb-16 pt-2 md:pt-4">
          <h2 className="text-[28px] sm:text-[38px] md:text-[52px] lg:text-[60px] font-black text-primary mb-4 md:mb-6 tracking-tight uppercase">
            Why GigPay Wins.
          </h2>
          <p className="text-primary/60 text-[14px] md:text-[17px] lg:text-[20px] max-w-3xl mx-auto font-medium leading-relaxed px-2">
            Non-custodial. Phone-number simple. Near-zero fees. Instant settlement. Stable USDC.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-border/50 shadow-sm transition-all overflow-hidden"
            >
              <div className="relative">
                <h3 className="text-[14px] md:text-[16px] font-black text-primary mb-2 md:mb-3 tracking-tighter uppercase">{feature.title}</h3>
                <p className="text-primary/60 text-[9px] md:text-[10px] font-medium leading-relaxed transition-colors">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
