import { Star } from "lucide-react";

import Reveal from "@/components/landing/Reveal";
import SectionIntro from "@/components/landing/SectionIntro";

const testimonials = [
  {
    quote: "GigChain Pay feels closer to the payout experience freelancers actually want: faster, clearer, and easier to trust on mobile.",
    name: "Mercy N.",
    role: "Product designer, Nairobi",
  },
  {
    quote: "The strongest part is the positioning. It explains cross-border payments without sounding like a crypto product first.",
    name: "Allan K.",
    role: "Frontend engineer, Mombasa",
  },
  {
    quote: "The wallet and payout story finally feels modern. It reads like a fintech product, not a blockchain experiment.",
    name: "Brenda W.",
    role: "Freelance marketer, Kisumu",
  },
];

const TrustSection = () => {
  return (
    <section id="testimonials" className="bg-white py-20 text-slate-950 sm:py-24 lg:py-28">
      <div className="container">
        <Reveal className="mb-10 lg:mb-14">
          <SectionIntro
            eyebrow="Testimonials"
            title={
              <>
                Built for freelancers who want <span className="text-cyan-900">speed, clarity, and control.</span>
              </>
            }
            description="A lighter social-proof section, closer to the pacing of modern fintech landing pages."
          />
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.name}
              delay={index * 80}
              className="surface-card rounded-[1.6rem] p-6"
            >
              <div className="mb-5 flex gap-1 text-cyan-700">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-base leading-8 text-slate-700">"{testimonial.quote}"</p>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-950">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
