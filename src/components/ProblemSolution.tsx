import { Shield, Smartphone, Globe, ArrowRight, Zap, Target, Lock, Unlock } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section id="problem" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Centered Heading with Accent */}
          <div className="text-center mb-20 animate-fade-up">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-wider mb-5 border border-primary/10">
              The Reality of Global Money
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
              Absolute Financial <span className="text-accent italic">Independence.</span>
            </h2>
            <p className="text-primary/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Old apps, centralized ramps, and banks are slow and expensive. We’ve removed the gates so you can move, own, and grow your money directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* The Problem - Legacy Dependencies */}
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-destructive font-bold text-sm uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  Legacy Limitations
                </div>
                <h3 className="text-2xl font-bold text-primary tracking-tight">The Middleman Tax</h3>
                <p className="text-primary/60 font-medium leading-relaxed text-sm">
                  Whether it's bank wires or custodial apps (Payd, Yellow Card), you're losing 15% to hidden fees, "bridging" risks, and forced delays.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { text: "7-15% total value loss", detail: "Hidden costs in every hop" },
                  { text: "3-10 days to transact", detail: "Held by custodial middlemen" },
                  { text: "Locked into their apps", detail: "They control your access" },
                  { text: "Privacy and data risks", detail: "Dependent on legacy databases" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col p-4 bg-black/5 rounded-2xl border border-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      <span className="text-primary/70 text-sm font-bold">{item.text}</span>
                    </div>
                    <span className="text-primary/30 text-[10px] font-medium ml-4.5">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Solution - Direct Freedom */}
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  The GigChain Freedom
                </div>
                <h3 className="text-2xl font-bold text-primary tracking-tight">Your Identity is Your Edge.</h3>
                <p className="text-primary/60 font-medium leading-relaxed text-sm">
                  GigPay connects you directly to the network. No custodial gates, no bridging risks. Just your phone number and the fastest rails on earth.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-4 p-5 bg-primary rounded-3xl border border-primary shadow-xl group hover:scale-105 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Unlock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Total Ownership</h4>
                    <p className="text-white/40 text-[11px] font-medium leading-tight">No middlemen control your money.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-primary font-bold text-sm">Near-Zero Costs</h4>
                    <p className="text-primary/40 text-[11px] font-medium leading-tight">Cut fees from 15% to less than 2%.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-primary font-bold text-sm">Universal Access</h4>
                    <p className="text-primary/40 text-[11px] font-medium leading-tight">Transact globally with just a phone number.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison summary Footer */}
          <div className="mt-20 p-8 bg-accent/5 rounded-[2.5rem] border border-accent/10 text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-primary/60 font-bold italic text-sm">
              Bypass the limitations of legacy bank rails and centralized apps like Payd or Yellow Card.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
