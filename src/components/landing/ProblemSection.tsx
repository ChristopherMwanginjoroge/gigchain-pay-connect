import { AlertTriangle, Clock3, Landmark, MoveRight, ShieldAlert } from "lucide-react";

import Reveal from "@/components/landing/Reveal";
import SectionIntro from "@/components/landing/SectionIntro";

const painPoints = [
  {
    icon: Landmark,
    title: "7 to 15 percent fees disappear from each payout",
    description: "Legacy rails stack transfer fees, FX spread, and withdrawal charges.",
  },
  {
    icon: Clock3,
    title: "3 to 7 day delays crush freelancer cash flow",
    description: "Waiting on a payout approval slows project work and personal cash flow.",
  },
  {
    icon: ShieldAlert,
    title: "Fraud and account risk stay too close to your money",
    description: "Custodial platforms and frozen balances leave freelancers exposed.",
  },
];

const legacyFlow = ["Client payout initiated", "Review plus FX conversion", "Cash-out after delays"];
const gigchainFlow = ["Client sends USDC", "Phone-linked wallet resolves", "Funds settle on-chain"];

const ProblemSection = () => {
  return (
    <section id="problem" className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.12),transparent_30%)]" />

      <div className="container relative z-10">
        <Reveal className="mb-12 lg:mb-16">
          <SectionIntro
            eyebrow="The problem"
            invert
            title={
              <>
                The old way is <span className="text-cyan-200">costing you speed, margin, and control.</span>
              </>
            }
            description="Expensive rails, slow settlement, and too many hands between the client and the payout."
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
          <div className="grid gap-4">
            {painPoints.map(({ icon: Icon, title, description }, index) => (
              <Reveal
                key={title}
                delay={index * 90}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-white">{title}</h3>
                    <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="glass-panel rounded-[2rem] p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-rose-300/15 bg-rose-300/8 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-300/14 text-rose-200">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-rose-100/60">Legacy payout chain</p>
                    <p className="mt-1 text-lg font-semibold text-white">Too many hands in the path</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {legacyFlow.map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose-200/20 bg-rose-200/10 text-sm font-semibold text-rose-100">
                        {index + 1}
                      </div>
                      <div className="flex-1 rounded-2xl border border-white/8 bg-slate-950/45 px-4 py-3 text-sm text-slate-200">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/8 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/14 text-cyan-100">
                    <MoveRight className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">GigChain Pay flow</p>
                    <p className="mt-1 text-lg font-semibold text-white">Fewer steps, clearer control</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {gigchainFlow.map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/10 text-sm font-semibold text-cyan-100">
                        {index + 1}
                      </div>
                      <div className="flex-1 rounded-2xl border border-white/8 bg-slate-950/45 px-4 py-3 text-sm text-slate-100">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
