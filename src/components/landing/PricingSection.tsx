import Reveal from "@/components/landing/Reveal";
import SectionIntro from "@/components/landing/SectionIntro";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does GigChain Pay work?",
    answer: "GigChain Pay is positioned as a faster cross-border payout experience for Kenyan freelancers, built around stablecoin settlement and a mobile-first wallet flow.",
  },
  {
    question: "Do I need a bank account to get started?",
    answer: "The landing page and current product direction focus on wallet-first onboarding, so the experience does not depend on a traditional bank account to explain the core value.",
  },
  {
    question: "Is the wallet custodial?",
    answer: "No. The product is positioned as non-custodial, with the user remaining at the center of wallet control.",
  },
  {
    question: "Can I move funds into local payout rails?",
    answer: "Yes, that is part of the core narrative: receive globally, hold in USDC, then move toward local mobile-first payout routes as support expands.",
  },
];

const PricingSection = () => {
  return (
    <section id="faq" className="bg-slate-50 py-20 text-slate-950 sm:py-24 lg:py-28">
      <div className="container">
        <Reveal className="mb-10 lg:mb-14">
          <SectionIntro
            eyebrow="FAQ"
            title={
              <>
                Questions users ask before they <span className="text-cyan-900">trust a new payout product.</span>
              </>
            }
            description="A clearer FAQ block in place of the heavier pricing section."
          />
        </Reveal>

        <Reveal delay={100} className="surface-card rounded-[1.8rem] p-5 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`} className="border-slate-200">
                <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold text-slate-950 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
};

export default PricingSection;
