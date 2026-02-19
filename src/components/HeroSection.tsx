import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ShieldCheck, Zap } from "lucide-react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const HeroSection = () => {
  const { openAuthModal } = useAuthModal();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4500);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <section className="relative h-screen min-h-[650px] flex items-center bg-background overflow-hidden selection:bg-accent/20 -mb-px">
      {/* Background decorative elements - polished */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/2 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="container relative z-10 py-6 md:py-8 px-4 md:px-6 lg:px-24 flex flex-col justify-between h-full max-w-[1400px] mx-auto">

        {/* Top: Centered Content */}
        <div className="w-full mt-6 md:mt-8 lg:mt-12 animate-fade-up text-center px-2 md:px-4 lg:px-12">
          <h1 className="text-[24px] sm:text-[28px] md:text-[46px] lg:text-[70px] font-black text-primary leading-[1.1] mb-3 md:mb-4 tracking-tighter">
            Fast Global Payments.
          </h1>
          <h2 className="text-accent italic text-[18px] sm:text-[22px] md:text-[34px] lg:text-[46px] mb-6 md:mb-8 tracking-tighter">
            Near zero costs. Real independence.
          </h2>
          
          <p className="text-primary/60 text-[13px] md:text-[14px] lg:text-[16px] max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Send and receive money globally in seconds. Near zero costs, instant settlement, no delays.
          </p>
        </div>

        {/* Bottom Section: Right-Shifted Grouped Interactive Section */}
        <div className="w-full max-w-[1100px] mx-auto grid lg:grid-cols-5 gap-6 md:gap-10 items-center mb-8 md:mb-10 lg:mb-12">

          {/* Left Columns (3/5): Right-Shifted CTAs */}
          <div className="lg:col-span-3 animate-fade-up space-y-4 md:space-y-6 flex flex-col items-center lg:items-end lg:pr-12" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-center lg:justify-end w-full">
              <Button onClick={openAuthModal} className="rounded-xl md:rounded-2xl px-6 md:px-10 py-5 md:py-7 text-[12px] md:text-[14px] font-bold shadow-2xl shadow-primary/10 transition-all hover:-translate-y-1 whitespace-nowrap">
                Getting Started
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1.5 md:ml-2" />
              </Button>
              <Button variant="outline" className="rounded-xl md:rounded-2xl px-6 md:px-10 py-5 md:py-7 text-[12px] md:text-[14px] font-bold bg-white/50 backdrop-blur-sm border-primary/10 transition-all hover:-translate-y-1 whitespace-nowrap">
                Download App
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-end w-full">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-accent/10 rounded-full border border-accent/20">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-primary uppercase tracking-wider">You Own Your Keys</span>
              </div>
              <p className="text-[8px] text-primary/30 leading-relaxed font-black uppercase tracking-[0.4em]">
                Non-Custodial • Phone-Based • Global
              </p>
            </div>
          </div>

          {/* Right Columns (2/5): Mature & Rounded Carousel */}
          <div className="lg:col-span-2 flex justify-center lg:justify-start animate-fade-up blur-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative group/carousel w-full max-w-[320px]">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  <CarouselItem className="basis-full pl-4">
                    <div className="p-8 h-full bg-primary/5 rounded-[2.25rem] border border-primary/10 shadow-sm transition-all hover:bg-primary/10 group flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[200px]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-[18px] font-black text-primary tracking-tighter mb-1.5 group-hover:text-accent transition-colors">You Own It</p>
                      <p className="text-primary/40 text-[6px] font-black uppercase tracking-[0.3em]">Private keys stored on your device</p>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="basis-full pl-4">
                    <div className="p-8 h-full bg-primary rounded-[2.25rem] border border-white/10 shadow-lg transition-all hover:bg-primary/95 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[200px]">
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-[18px] font-black text-white tracking-tighter mb-1.5">Near Zero Fees</p>
                      <p className="text-white/40 text-[6px] font-black uppercase tracking-[0.3em]">$0.0001-$0.001 per transaction</p>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="basis-full pl-4">
                    <div className="p-8 h-full bg-accent/5 rounded-[2.25rem] border border-accent/20 shadow-sm transition-all hover:bg-accent/10 group flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[200px]">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2" />
                      <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-[18px] font-black text-primary tracking-tighter mb-1.5 group-hover:text-accent transition-colors">Earn Yield</p>
                      <p className="text-primary/40 text-[6px] font-black uppercase tracking-[0.3em]">4-8% APY on USDC</p>
                    </div>
                  </CarouselItem>
                </CarouselContent>

                {/* Refined Rounded Indicator Tabs */}
                <div className="flex justify-center lg:justify-start gap-3 mt-8 lg:pl-6">
                  {Array.from({ length: count }).map((_, i) => (
                    <button
                      key={i}
                      className={`h-2 transition-all duration-700 rounded-full border border-primary/10 shadow-sm ${current === i
                          ? "w-10 bg-accent border-accent shadow-[0_0_12px_-2px_rgba(16,185,129,0.4)]"
                          : "w-2 bg-primary/5 hover:bg-primary/20 hover:border-primary/20"
                        }`}
                      onClick={() => api?.scrollTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
