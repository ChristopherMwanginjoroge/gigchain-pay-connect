import { Smartphone, Wallet, ArrowRightLeft, Banknote, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Sign Up with Phone",
    description: "Register using your phone number or email. Complete KYC verification by uploading your ID securely through Persona.",
    icon: Smartphone,
    color: "bg-primary",
  },
  {
    number: 2,
    title: "Link Hedera Wallet",
    description: "Connect your non-custodial Hedera wallet or create a new one. Your phone number serves as your secure identifier.",
    icon: Wallet,
    color: "bg-gigchain-navy-light",
  },
  {
    number: 3,
    title: "Receive from Clients",
    description: "International clients send USDC directly to your wallet. Funds arrive in 3-5 seconds with minimal fees.",
    icon: ArrowRightLeft,
    color: "bg-accent",
  },
  {
    number: 4,
    title: "Off-ramp to M-Pesa",
    description: "Convert USDC to KES and withdraw directly to your M-Pesa account. Fast, secure, and fully compliant.",
    icon: Banknote,
    color: "bg-gigchain-green-light",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It <span className="text-accent">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in minutes. Receive global payments instantly.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-gigchain-green-light -translate-y-1/2 z-0" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="relative bg-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border group-hover:border-accent/30 h-full">
                  {/* Number badge */}
                  <div className={`absolute -top-4 left-6 w-8 h-8 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md z-10`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${step.color}/10 flex items-center justify-center mt-4 mb-4 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-7 h-7 ${step.color === 'bg-primary' ? 'text-primary' : step.color === 'bg-accent' ? 'text-accent' : 'text-gigchain-navy-light'}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
                
                {/* Arrow connector for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 z-20 w-8 h-8 bg-background rounded-full items-center justify-center shadow-sm border border-border">
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visual workflow */}
        <div className="mt-16 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-2xl">🇨🇦</span>
              </div>
              <p className="font-semibold text-foreground">Canadian Client</p>
              <p className="text-sm text-muted-foreground">Sends USDC</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-accent hidden md:block" />
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="w-8 h-0.5 bg-accent hidden md:block" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="font-semibold text-foreground">GigChain Pay</p>
              <p className="text-sm text-muted-foreground">3-5s Transfer</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-accent hidden md:block" />
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="w-8 h-0.5 bg-accent hidden md:block" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gigchain-green-light/10 flex items-center justify-center mb-2">
                <span className="text-2xl">🇰🇪</span>
              </div>
              <p className="font-semibold text-foreground">Kenyan Freelancer</p>
              <p className="text-sm text-muted-foreground">Receives KES via M-Pesa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
