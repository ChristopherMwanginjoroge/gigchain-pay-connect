import { BadgeCheck, CreditCard, Phone, ShieldCheck } from "lucide-react";

import Reveal from "@/components/landing/Reveal";
import SectionIntro from "@/components/landing/SectionIntro";

const steps = [
  {
    icon: Phone,
    title: "Sign up with phone or email",
    description: "Start with the identity method that already fits mobile use.",
  },
  {
    icon: ShieldCheck,
    title: "Complete KYC once",
    description: "Verify once, then reuse the account.",
  },
  {
    icon: BadgeCheck,
    title: "Receive global client payouts",
    description: "Clients pay into a stablecoin wallet that settles fast.",
  },
  {
    icon: CreditCard,
    title: "Hold, spend, or route to local rails",
    description: "Keep value in USDC or move into local payout routes.",
  },
];

const flowStates = ["Phone signup", "KYC", "USDC wallet", "Global payout", "Local payout"];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-white py-20 text-slate-950 sm:py-24 lg:py-28">
      <div className="container">
        <Reveal className="mb-12 lg:mb-16">
          <SectionIntro
            eyebrow="How it works"
            title={
              <>
                A simple flow for users, <span className="text-cyan-900">a stronger settlement path underneath.</span>
              </>
            }
            description="Simple enough for new users, strong enough for global freelance payouts."
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
          <div className="grid gap-4">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <Reveal
                key={title}
                delay={index * 80}
                className="relative rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950 text-cyan-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    {index < steps.length - 1 ? <div className="mt-3 h-full w-px bg-gradient-to-b from-cyan-900/40 to-transparent" /> : null}
                  </div>

                  <div className="flex-1 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-800">Step {index + 1}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
            <div className="pointer-events-none absolute -right-24 top-0 h-48 w-48 rounded-full bg-cyan-300/14 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-10 h-40 w-40 rounded-full bg-emerald-300/12 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="space-y-3">
                <span className="eyebrow border-white/10 bg-white/10 text-cyan-100">Flow snapshot</span>
                <h3 className="font-display text-3xl font-semibold tracking-tight text-white">A faster path from client payment to local access.</h3>
              </div>

              <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                {flowStates.map((state, index) => (
                  <div key={state} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/10 text-sm font-semibold text-cyan-100">
                      {index + 1}
                    </div>
                    <div className="flex-1 rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-white">
                      {state}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "1x", label: "One-time KYC flow" },
                  { value: "Fast", label: "Payment visibility" },
                  { value: "Clear", label: "Next-step guidance" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-center">
                    <p className="font-display text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
