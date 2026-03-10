import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Why GigChain", href: "#problem" },
  { label: "Product", href: "#solution" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "School", href: "/gigchain-school", isRoute: true },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const { openAuthModal } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4">
      <div className="container">
        <div
          className={`transition-all duration-300 ${
            scrolled 
              ? "border-white/15 bg-slate-950/95 shadow-2xl shadow-slate-950/30" 
              : "border-white/12 bg-slate-950/90"
          } rounded-[1.5rem] border backdrop-blur-xl`}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <a href="#hero" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
                <img src="/gigpay-logo.png" alt="GigChain Pay Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">GigChain Pay</p>
                <p className="hidden text-xs uppercase tracking-[0.28em] text-slate-400 sm:block">Kenya-first global payouts</p>
              </div>
            </a>

            <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#waitlist">Join Waitlist</a>
              </Button>
              <Button size="sm" className="rounded-xl bg-cyan-300 text-slate-950 hover:bg-cyan-200" onClick={openAuthModal}>
                Get Started
              </Button>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
              onClick={() => setMobileOpen((current) => !current)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileOpen ? (
            <div className="border-t border-white/10 px-4 py-4 md:hidden">
              <nav className="grid gap-2">
                {navLinks.map((link) =>
                  link.isRoute ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </nav>

              <div className="mt-4 grid gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="#waitlist" onClick={() => setMobileOpen(false)}>
                    Join Waitlist
                  </a>
                </Button>
                <Button
                  className="rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal();
                  }}
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
