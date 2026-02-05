import { Zap, DollarSign, Shield, TrendingUp, Globe, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Settlements",
    description: "Transactions finalize in 3-5 seconds on Hedera's enterprise-grade hashgraph network.",
  },
  {
    icon: DollarSign,
    title: "USDC Stability",
    description: "Use regulated, dollar-backed stablecoins to avoid cryptocurrency volatility.",
  },
  {
    icon: Shield,
    title: "AI Fraud Detection",
    description: "Advanced machine learning algorithms monitor transactions to prevent fraud in real-time.",
  },
  {
    icon: TrendingUp,
    title: "Yield on Holdings",
    description: "Earn 4-8% APY on your USDC balance through secure DeFi yield strategies.",
  },
  {
    icon: Globe,
    title: "Global Compliance",
    description: "KYC verification via Persona ensures regulatory compliance across jurisdictions.",
  },
  {
    icon: Lock,
    title: "Non-Custodial Security",
    description: "You control your private keys. Your phone is your wallet—no third-party access.",
  },
];

const KeyFeatures = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built for <span className="text-accent">Security & Speed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enterprise-grade infrastructure designed for the modern gig economy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-accent/30 shadow-sm hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
