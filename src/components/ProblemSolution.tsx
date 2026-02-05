import { AlertTriangle, CheckCircle, ArrowRight, Zap, Phone, Globe, TrendingUp, Unlock } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section id="problem" className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-3xl mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-wider mb-5">
            Protocol Independence
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-primary mb-5 tracking-tight leading-[1.1]">
            Breaking Legacy <br />
            <span className="text-accent">Dependencies.</span>
          </h2>
          <p className="text-primary/60 text-base md:text-lg font-medium leading-relaxed">
            Most solutions in Africa focus on general remittances, layering centralized rails with 1-3% fees. GigChain Pay delivers true independence from bank-centric and high-fee custodial intermediaries.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Problem Card - Refined Analytical View */}
          <div className="lg:col-span-12 group">
            <div className="bg-white/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 lg:p-12 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary tracking-tight italic">The $20B "Holding" Tax</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-3xl bg-white/50 border border-border shadow-sm group-hover:bg-white transition-colors">
                      <p className="font-bold text-primary text-sm uppercase tracking-widest mb-3 text-accent">Centralized Overhead</p>
                      <p className="text-primary/60 text-sm font-medium leading-relaxed">Competitors like Yellow Card or Deel still rely on centralized rails with multiple hops, adding 1-3% friction even for stablecoins.</p>
                      <div className="mt-4 pt-4 border-t border-border flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">15% LOSS</span>
                        <span className="text-[10px] font-bold text-primary/40 uppercase">on legacy chains</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/50 border border-border shadow-sm group-hover:bg-white transition-colors">
                      <p className="font-bold text-primary text-sm uppercase tracking-widest mb-3 text-accent">Custodial Lock-in</p>
                      <p className="text-primary/60 text-sm font-medium leading-relaxed">Mandatory bank/M-Pesa dependencies create bottlenecks. Funds are subject to third-party policy, not user ownership.</p>
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden">
                          <div className="h-full bg-destructive/20 w-[85%] animate-pulse" />
                        </div>
                        <p className="text-[9px] font-bold text-destructive/40 uppercase mt-2 tracking-widest">High Dependency Risk</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/50 border border-border shadow-sm group-hover:bg-white transition-colors">
                      <p className="font-bold text-primary text-sm uppercase tracking-widest mb-3 text-accent">The Gig Tax</p>
                      <p className="text-primary/60 text-sm font-medium leading-relaxed">Lack of gig-specific escrow or tax calcs forces informal workers to manually reconcile fragmented incomes.</p>
                      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary/40 uppercase">Unoptimized for Talent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Card - Modern Minimalist */}
          <div className="lg:col-span-12 mt-12 bg-primary rounded-[2.5rem] p-8 lg:p-12 shadow-2xl overflow-hidden relative border border-white/10">
            {/* Subtle light leak for depth instead of green blur */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col items-center relative z-10">
              <div className="flex-1 text-center w-full">
                <h3 className="text-2xl font-bold text-white tracking-tight italic mb-6">Atomic Independence</h3>
                <h4 className="text-white/60 font-medium mb-10 max-w-xl mx-auto">Bypassing legacy banking and custodial bottlenecks using phone-as-universal-ID on Hedera HTS.</h4>

                <div className="grid md:grid-cols-3 gap-12 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold mb-1">Non-Custodial Ownership</p>
                      <p className="text-white/40 text-sm font-medium">Full control of portable keys. Your phone number is your universal gateway.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold mb-1">Near-Zero Core Fees</p>
                      <p className="text-white/40 text-sm font-medium">Bypass the 1-3% centralized tolls. Total operational friction &lt;2%.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold mb-1">Gig-Specific Tooling</p>
                      <p className="text-white/40 text-sm font-medium">Integrated escrow, invoice tracking, and Kenyan crypto tax calcs built-in.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-8">
                  <button className="group flex items-center gap-3 text-white font-bold uppercase tracking-[0.2em] text-xs hover:translate-x-2 transition-transform">
                    EXPLORE THE INDEPENDENCE ARCHITECTURE
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-primary-foreground/10" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-primary bg-accent flex items-center justify-center text-[10px] font-bold text-white">+2.4k</div>
                  </div>
                  <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Empowering the unbanked 83% informal economy</p>
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
