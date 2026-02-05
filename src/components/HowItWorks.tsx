import { Wallet, Globe, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Onboard via Persona",
    description: "Register with phone/email. Secure KYC verification powered by Persona—upload your ID for instant protocol access.",
    icon: ShieldCheck,
    color: "bg-primary/5",
    iconColor: "text-primary"
  },
  {
    number: "02",
    title: "Connect Hedera",
    description: "Link your non-custodial wallet. Your phone number acts as the secure bridge to the Hedera Token Service (HTS).",
    icon: Wallet,
    color: "bg-primary/10",
    iconColor: "text-primary"
  },
  {
    number: "03",
    title: "Receive USDC Liquidity",
    description: "Accept payments from global clients. Watch value flow from Canada to Kenya in <5s via atomic settlement.",
    icon: Globe,
    color: "bg-primary/5",
    iconColor: "text-primary"
  },
  {
    number: "04",
    title: "M-Pesa Off-ramp",
    description: "Convert USDC to KES instantly. Withdraw directly to your M-Pesa account with <2% total friction.",
    icon: Zap,
    color: "bg-primary/10",
    iconColor: "text-primary"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest mb-5 border border-primary/20">
            Protocol Execution
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-5 tracking-tight">
            The Velocity of <span className="text-accent italic">Reward.</span>
          </h2>
          <p className="text-primary/60 text-base md:text-lg font-medium">
            We've condensed the legacy 5-day clearing cycle into a 4-step atomic workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative bg-white border border-border rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-6 right-8 text-3xl font-black text-primary/5 italic group-hover:text-primary/10 transition-colors">
                {step.number}
              </div>

              <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <step.icon className={`w-7 h-7 ${step.iconColor}`} />
              </div>

              <h3 className="text-lg font-bold text-primary mb-3 tracking-tight">{step.title}</h3>
              <p className="text-primary/60 text-xs font-medium leading-relaxed">
                {step.description}
              </p>

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Validated</span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Visual Workflow - Modern Dashboard Peek */}
        <div className="mt-20 lg:mt-32 p-1 lg:p-2 bg-gradient-to-br from-border to-transparent rounded-[3rem] animate-fade-up">
          <div className="bg-white rounded-[2.8rem] overflow-hidden shadow-2xl border border-white">
            <div className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-primary mb-6 tracking-tight capitalize">
                    Designed for the global <br />
                    talent frontier.
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-primary/70 font-medium">Persona-integrated ID verification flow.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-primary/70 font-medium">Hedera Hashgraph mainnet finality.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-primary/70 font-medium">Instant M-Pesa liquidity via Celo/USD onramp.</p>
                    </div>
                  </div>

                  <Button className="mt-10 rounded-2xl px-8 h-12 bg-primary font-bold hover:shadow-glow transition-all">
                    Start Onboarding
                  </Button>
                </div>

                <div className="relative group">
                  <div className="bg-primary shadow-2xl rounded-[2rem] p-8 lg:p-12 text-white relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <span className="font-bold">CA</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40" />
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <span className="font-bold text-white">KE</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-white/80 font-bold text-xs uppercase tracking-widest">Settled - 2.8s</p>
                      </div>
                    </div>

                    <div className="space-y-6 mb-10">
                      <div className="flex justify-between items-center text-sm font-medium border-b border-white/10 pb-4">
                        <span className="text-white/60">Amount Recv</span>
                        <span>$2,450.00 USDC</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium border-b border-white/10 pb-4">
                        <span className="text-white/60">Global Fee</span>
                        <span>$1.22 USDC</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-white/60">ID Status</span>
                        <span className="text-white/80 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>
                      </div>
                    </div>

                    <div className="w-full h-12 rounded-xl bg-white text-primary flex items-center justify-center font-bold text-sm shadow-lg">
                      Transfer Audited & Signed
                    </div>
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

export default HowItWorks;
