import { Smartphone, Share2, Wallet, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Verify Your Phone",
    description: "Start by verifying your phone number. No long forms, no bank codes—just your phone number.",
    highlight: "Your ID for global money."
  },
  {
    number: "02",
    icon: Share2,
    title: "Share Your Number",
    description: "Tell your client to pay your phone number. We handle the complex stuff in the background.",
    highlight: "Works with any country."
  },
  {
    number: "03",
    icon: Wallet,
    title: "Get Paid Instantly",
    description: "The money arrives in seconds. You can keep it, spend it, or send it whenever you want.",
    highlight: "Seconds, not days."
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-24 animate-fade-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider mb-5 border border-white/10">
            Three Simple Steps
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            How It <span className="text-accent italic">Works.</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            We removed the complexity. No more banking jargon, just simple steps to get your hard-earned money.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[2.75rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative flex flex-col items-center text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step Icon & Number */}
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 relative z-10">
                  <step.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary border-2 border-white/20 flex items-center justify-center z-20">
                  <span className="text-white text-xs font-black tracking-tighter">{step.number}</span>
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Step Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-white/50 text-base font-medium leading-[1.6]">
                  {step.description}
                </p>
                <div className="inline-flex items-center gap-2 py-1 px-3 bg-white/5 rounded-full border border-white/5 group-hover:bg-white/10 transition-colors">
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <span className="text-accent text-[10px] font-bold uppercase tracking-widest">{step.highlight}</span>
                </div>
              </div>

              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <div className="lg:hidden mt-8 mb-4">
                  <ArrowRight className="w-6 h-6 text-white/20 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA area */}
        <div className="mt-24 pt-12 border-t border-white/5 text-center animate-fade-up">
          <p className="text-white/40 text-sm font-medium mb-8">
            Used by freelancers globally to skip the 15% banking tax.
          </p>
          <div className="inline-flex p-1 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
            <div className="bg-primary px-8 py-4 rounded-[1.5rem] flex items-center justify-between gap-12 group hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-white font-bold text-sm tracking-tight italic">Ready for independence?</span>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
