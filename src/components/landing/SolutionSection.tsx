import { ArrowRight, Sparkles, Globe2, Zap, Shield } from "lucide-react";

import GlobalTransferGlobe from "@/components/landing/GlobalTransferGlobe";
import Reveal from "@/components/landing/Reveal";
import SectionIntro from "@/components/landing/SectionIntro";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { Button } from "@/components/ui/button";

const SolutionSection = () => {
  const { openAuthModal } = useAuthModal();

  return (
    <section id="solution" className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-emerald-200 to-teal-200 blur-3xl" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10">
        <Reveal className="mb-12 flex justify-center lg:mb-16">
          <SectionIntro
            eyebrow="The solution"
            title={
              <>
                GigChain Pay is <span className="bg-gradient-to-r from-cyan-900 to-emerald-900 bg-clip-text text-transparent">built around the Kenyan freelancer journey.</span>
              </>
            }
            description="Lower the friction between global clients and local freelance income without forcing users into a crypto-native learning curve."
          />
        </Reveal>

        {/* Dashboard Preview with enhanced animation */}
        <Reveal delay={100} className="mb-20">
          <div className="group relative mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-cyan-500/20">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <img 
              src="/dashboard.png" 
              alt="Illustration of the GigChain Pay solution journey" 
              className="mx-auto w-full rounded-2xl transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 rounded-2xl ring-2 ring-cyan-500/0 transition-all duration-500 group-hover:ring-cyan-500/30" />
          </div>
        </Reveal>

        {/* Enhanced Globe Section */}
        <Reveal delay={200} className="mx-auto max-w-6xl">
          <div className="group relative space-y-12 py-8">
            

            {/* Globe Component - No wrapper, direct display */}
            <div className="relative transform transition-transform duration-700 group-hover:scale-[1.02]">
              <GlobalTransferGlobe />
            </div>

            {/* CTA Section */}
            <div className="flex flex-col items-center gap-6 border-t border-slate-200 pt-12">
              <div className="text-center">
                <h4 className="mb-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  Ready to get started?
                </h4>
                <p className="text-sm text-slate-600 sm:text-base">
                  Join thousands of freelancers getting paid globally in seconds
                </p>
              </div>

              <Button
                size="xl"
                className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-10 py-6 text-lg font-semibold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:from-cyan-400 hover:to-emerald-400 hover:shadow-2xl hover:shadow-cyan-500/40"
                onClick={openAuthModal}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  Create Your Wallet Now
                  <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-2" />
                </span>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              </Button>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 sm:gap-8 sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                  <span>Secure & Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
                  <span>Instant Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                  <span>Low Fees</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SolutionSection;
