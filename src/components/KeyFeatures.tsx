import { Zap, DollarSign, Shield, TrendingUp, Globe, Lock, FileText } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fixed-Fee Settlement",
    description: "Atomic finality on Hedera Hashgraph with fixed protocol fees of ~$0.0001. We bypass the variable overhead of Ethereum L2s and custodial tolls.",
  },
  {
    icon: Shield,
    title: "AI Guardrails",
    description: "Real-time ML checkpoints tailored for SIM-swap and social engineering risks. Integrated Chainalysis scoring ensures every transaction is audited.",
  },
  {
    icon: Lock,
    title: "Enterprise Core",
    description: "Governed by a council including Google, IBM, and Boeing. Institutional-grade predictability and carbon-negative efficiency on every payment.",
  },
  {
    icon: TrendingUp,
    title: "Gig-Specific yield",
    description: "Earn 4-8% APY on idle USDC via native Hedera DeFi (e.g. SaucerSwap). Secure, over-collateralized lending geared for freelancer stability.",
  },
  {
    icon: Globe,
    title: "Global Compliance",
    description: "Bank-grade KYC/KYB via Persona and Onfido. Our infrastructure is purpose-built to align with CBK/AML regulatory standards in Kenya.",
  },
  {
    icon: FileText,
    title: "Gig Logic Layer",
    description: "Integrated escrow for invoices, real-time analytics, and automated Kenyan crypto tax calculations designed for the global talent frontier.",
  },
];

const KeyFeatures = () => {
  return (
    <section id="features" className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="container relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-wider mb-5 border border-primary/10">
            Network Capabilities
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-5 tracking-tight">
            Built for <span className="text-accent italic">Sovereign Performance.</span>
          </h2>
          <p className="text-primary/60 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Enterprise-grade infrastructure designed to empower individual talent at global scale.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-3xl p-8 border border-border hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-x-12 -translate-y-12 group-hover:bg-primary/10 transition-colors" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 border border-primary/10">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-primary mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-primary/60 text-sm font-medium leading-relaxed group-hover:text-primary transition-colors">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
