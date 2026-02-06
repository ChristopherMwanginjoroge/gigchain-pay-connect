import { ShieldAlert, Globe2, Unlock } from "lucide-react";

const benefits = [
  {
    title: "10x Lower Fees",
    text: "Slash total payment costs to <2%—keeping $25+ more in your pocket every month."
  },
  {
    title: "Regulatory Moat",
    text: "Built-in AI KYC aligned with Central Bank (CBK/AML) rules for institutional trust."
  },
  {
    title: "Real Ownership",
    text: "Non-custodial wallets mean you own your keys. No one can freeze your hard-earned money."
  },
  {
    title: "Africa-First Tech",
    text: "Tuned for Kenya's $3.3B stablecoin market with seamless M-Pesa or bank exits."
  },
];

const BusinessModel = () => {
  return (
    <section id="benefits" className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />

      <div className="container relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider mb-5 border border-white/10">
            The GigChain Advantage
          </div>
          <h2 className="text-2xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Built for the <span className="text-accent italic">Future of Africa.</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Delivering sovereign, instant, and ultra-cheap payouts on the world's most reliable enterprise blockchain.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left content - Value Matrix */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-7 hover:bg-white/10 transition-all duration-500 group"
                >
                  <h3 className="text-white font-bold mb-2 tracking-tight text-sm">{benefit.title}</h3>
                  <p className="text-white/40 text-[11px] font-medium leading-relaxed">{benefit.text}</p>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-x-8 -translate-y-8" />
              <h3 className="text-xl font-bold text-primary mb-6 italic">The $54B Market Reality</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-black text-primary mb-1">43%</p>
                  <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-tight">Stablecoin <br />TX Volume</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-primary mb-1">&lt;2%</p>
                  <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-tight">Total <br />Transaction Cost</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-primary mb-1">$0.0001</p>
                  <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-tight">Fixed <br />Hedera Fee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - The Network Edge */}
          <div className="animate-fade-up">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Financial Moat</h3>
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="w-4 h-4 text-accent" />
                  <p className="text-white font-bold text-[10px] uppercase tracking-widest text-accent">Full Independence</p>
                </div>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  Unlike competitors who route through third-party partners, we utilize circles native USDC on Hedera. No bridging risks, no custodial locks.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/10 border border-border/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-accent" />
                  <p className="text-white font-bold text-[10px] uppercase tracking-widest text-accent">Institutional Grade</p>
                </div>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  We deploy the same rails used by Shinhan Bank and Visa pilots. Carbon-negative, enterprise-governed, and built to scale globally.
                </p>
              </div>
            </div>

            <div className="mt-10 p-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl">
              <div className="bg-primary p-5 rounded-[0.9rem] flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-base tracking-tight italic">Built for unbanked freelancers</p>
                  <p className="text-white/40 text-[9px] font-medium uppercase tracking-widest">Nairobi | Lagos | Global</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-accent" />
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
