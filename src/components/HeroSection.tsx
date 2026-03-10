import { ArrowRight, CheckCircle2, Globe2, PhoneCall, Play, ShieldCheck, Wallet } from "lucide-react";

import heroImage from "@/assets/hero-image.jpg";
import Reveal from "@/components/landing/Reveal";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { Button } from "@/components/ui/button";

const trustSignals = [
  { icon: Globe2, label: "Hedera + Solana" },
  { icon: Wallet, label: "Non-custodial" },
  { icon: ShieldCheck, label: "KYC-ready" },
];

const heroStats = [
  { value: "~5 sec", label: "Settlement" },
  { value: "<1%", label: "Target fee" },
  { value: "Phone-first", label: "Local UX" },
];

const HeroSection = () => {
  const { openAuthModal } = useAuthModal();

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-landing-hero pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-300/10 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="container relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:gap-10">
          <Reveal className="space-y-8">
            <div className="space-y-5">
             

              <div className="space-y-5">
                <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl">
                  Instant Low-fee global payments for Kenyan freelancers.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg lg:text-xl">
                  Receive USDC from clients worldwide in seconds with a phone-first wallet.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="xl"
                className="group rounded-2xl bg-cyan-300 px-8 text-slate-950 hover:bg-cyan-200"
                onClick={openAuthModal}
              >
                Get Started Free
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#how-it-works">
                  <Play className="fill-current" />
                  See the 45-second flow
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
              {trustSignals.map(({ icon: Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  <Icon className="h-4 w-4 text-cyan-200" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <Reveal
                  key={stat.label}
                  delay={index * 100}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <p className="font-display text-2xl font-semibold text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{stat.label}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150} className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="float-slow absolute -left-10 top-10 hidden rounded-3xl border border-white/12 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-xl md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Incoming payout</p>
                  <p className="mt-1 text-sm font-semibold text-white">$480 USDC received in Nairobi</p>
                </div>
              </div>
            </div>

            <div className="float-slow float-delay absolute -right-4 bottom-14 hidden rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 shadow-2xl backdrop-blur-xl md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-100">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">Identity layer</p>
                  <p className="mt-1 text-sm font-semibold text-white">Phone number linked wallet</p>
                </div>
              </div>
            </div>

            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />
              <div className="grid gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)]">
                <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live payout path</p>
                    <p className="mt-2 text-xl font-semibold text-white">Client to wallet in seconds</p>
                  </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Early access
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Client sends USDC",
                      "Phone-linked wallet resolves the receiver",
                      "Funds stay liquid for local payout routes",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/5 p-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-200" />
                        <span className="text-sm leading-6 text-slate-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/60">
                  <img
                    src={heroImage}
                    alt="Kenyan freelancer receiving a global USDC payout through GigChain Pay"
                    className="h-full min-h-[320px] w-full object-cover sm:min-h-[380px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="rounded-[1.5rem] border border-white/12 bg-slate-950/70 p-4 backdrop-blur-xl">
                      <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">Designed for Kenyan teams</p>
                      <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                        Global clients pay in dollars. You keep control over the wallet and the timing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
