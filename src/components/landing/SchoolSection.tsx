import { ArrowRight, BookOpenText, Coins, Trophy } from "lucide-react";

import Reveal from "@/components/landing/Reveal";
import SectionIntro from "@/components/landing/SectionIntro";
import { Button } from "@/components/ui/button";

const SchoolSection = () => {
  return (
    <section id="school" className="bg-[linear-gradient(180deg,#f8fcff_0%,#eef9f6_100%)] py-20 text-slate-950 sm:py-24 lg:py-28">
      <div className="container">
        <Reveal className="mb-8">
          <SectionIntro
            eyebrow="GigChain School"
            title={
              <>
                Education, rewards, and <span className="text-cyan-900">the next generation of digital earners.</span>
              </>
            }
            description="A lighter teaser for the roadmap: learn, earn micro-USDC, and build toward real digital work opportunities."
          />
        </Reveal>

        <Reveal delay={120} className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,0.9fr)] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-100">
                Coming soon inside the app
              </div>
              <h3 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                A gamified learning layer that connects education to earning.
              </h3>
              <Button asChild size="xl" className="rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <a href="#waitlist">
                  Join Waitlist
                  <ArrowRight />
                </a>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: BookOpenText, title: "Learn", detail: "Digital money basics" },
                { icon: Trophy, title: "Progress", detail: "Streaks and milestones" },
                { icon: Coins, title: "Earn", detail: "Micro-USDC rewards" },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SchoolSection;
