import { FormEvent, useState } from "react";
import { ArrowRight, BadgeCheck, Send, Smartphone } from "lucide-react";

import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = [
  { label: "Home", href: "#hero" },
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "School", href: "#school" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
];

const Footer = () => {
  const { openAuthModal } = useAuthModal();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      return;
    }

    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer id="waitlist" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="container relative z-10 py-20 sm:py-24 lg:py-28">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,0.88fr)] lg:items-center">
            <div className="space-y-5">
              <span className="eyebrow border-white/10 bg-white/10 text-cyan-100">Final CTA</span>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Start receiving payments with a cleaner, faster wallet flow.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Create your wallet or join the waitlist for app and GigChain School updates.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="xl"
                  className="group rounded-2xl bg-cyan-300 px-8 text-slate-950 hover:bg-cyan-200"
                  onClick={openAuthModal}
                >
                  Create Free Wallet
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="#waitlist-form">
                    <Smartphone />
                    Join App Waitlist
                  </a>
                </Button>
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:flex-wrap">
                {[
                  "Early access",
                  "Non-custodial",
                  "School waitlist",
                ].map((signal) => (
                  <div key={signal} className="inline-flex items-center gap-2 text-sm text-slate-200">
                    <BadgeCheck className="h-4 w-4 text-cyan-200" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="waitlist-form" className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5 sm:p-6">
              <div className="mb-5 space-y-2">
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/65">Waitlist and updates</p>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white">Get launch updates and product access news.</h3>
              </div>

              {submitted ? (
                <div className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5 text-emerald-100">
                  <p className="text-sm uppercase tracking-[0.32em] text-emerald-200/75">You are on the list</p>
                  <p className="mt-3 text-lg font-semibold text-white">We will keep you posted on early access and GigChain School updates.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="h-12 border-0 bg-transparent px-2 text-base text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                  <Button type="submit" size="xl" className="w-full rounded-2xl bg-white text-slate-950 hover:bg-slate-100">
                    Notify Me
                    <Send />
                  </Button>
                </form>
              )}

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Community channels coming next: X, Telegram, and WhatsApp updates for the early cohort.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-lg font-semibold text-cyan-100">
                G
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-white">GigChain Pay</p>
                <p className="text-sm text-slate-400">Instant USDC payments for Kenyan freelancers.</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              Instant USDC payments for Kenyan freelancers, with a cleaner mobile-first experience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/65">Navigate</p>
              <div className="mt-4 grid gap-3">
                {footerLinks.map((link) => (
                  <a key={link.href} href={link.href} className="text-sm text-slate-300 transition-colors hover:text-white">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/65">Product</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <span>Global payouts</span>
                <span>Wallet onboarding</span>
                <span>KYC verification</span>
                <span>GigChain School roadmap</span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/65">Company</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <span>Nairobi, Kenya</span>
                <span>Security-first positioning</span>
                <span>Privacy and terms coming with production launch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
          © 2026 GigChain Pay Limited. Nairobi, Kenya.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
