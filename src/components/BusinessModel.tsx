import { CheckCircle } from "lucide-react";

const benefits = [
  {
    title: "Transactional Integrity",
    text: "0.5-1% transparent protocol fees—bypassing the 7-15% legacy tax."
  },
  {
    title: "Scalable Economics",
    text: "Projected $408K annual ARR at 10K active users through network velocity."
  },
  {
    title: "Direct User Impact",
    text: "Average $25+ monthly savings per freelancer in fee recovery alone."
  },
  {
    title: "Premium Liquidity",
    text: "Access to yield-bearing vaults and higher-tier settlement limits."
  },
];

const BusinessModel = () => {
  return (
    <section id="benefits" className="py-16 lg:py-24 bg-primary relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />

      <div className="container relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider mb-5 border border-white/10">
            Economic Dynamics
          </div>
          <h2 className="text-2xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Why Choose <span className="text-accent italic">GigChain Pay.</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Sustainable, low-friction infrastructure engineered for the 83% informal economy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left content - Value Matrix */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-7 hover:bg-white/10 transition-all duration-500 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2 tracking-tight">{benefit.title}</h3>
                  <p className="text-white/40 text-xs font-medium leading-relaxed">{benefit.text}</p>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-x-8 -translate-y-8" />
              <h3 className="text-xl font-bold text-primary mb-6 italic">Impact Projections</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-black text-primary mb-1">$25+</p>
                  <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-tight">Monthly <br />User Savings</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-primary mb-1">$408K</p>
                  <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-tight">Target <br />Annual Rev</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-primary mb-1">&lt;2%</p>
                  <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-tight">Total <br />Friction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - The Network Edge */}
          <div className="animate-fade-up">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">The Network Edge</h3>
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-white font-bold text-[10px] uppercase tracking-widest mb-2 text-accent">Atomic vs Centralized</p>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  While competitors like Yellow Card and Kotani Pay focus on merchant payments with 1-3% centralized tolls, we deliver peer-to-peer liquidity with ~$0.0001 protocol costs.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <p className="text-white font-bold text-[10px] uppercase tracking-widest mb-2 text-accent">Sovereign Independence</p>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  Bypass the mandatory bank dependencies and custodial lock-ins of legacy providers. GigChain Pay is the first genuinely independent solution for Kenya's talent frontier.
                </p>
              </div>
            </div>

            <div className="mt-10 p-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl">
              <div className="bg-primary p-5 rounded-[0.9rem] flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-base tracking-tight">Aligned with CBK/AML</p>
                  <p className="text-white/40 text-[9px] font-medium uppercase tracking-widest">Regulatory Security Built-in</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✓</span>
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
