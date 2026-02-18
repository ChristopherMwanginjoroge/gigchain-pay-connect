import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Phone, ShieldCheck, Zap, Lock } from "lucide-react";
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
    <section className="relative h-screen min-h-[650px] flex items-center bg-background overflow-hidden selection:bg-accent/20">
      {/* Background decorative elements - polished */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/2 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="container relative z-10 py-8 px-6 lg:px-24 flex flex-col justify-between h-full max-w-[1400px] mx-auto">

        {/* Top: Centered Content */}
        <div className="w-full mt-12 lg:mt-20 animate-fade-up text-center px-4 lg:px-12">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-primary leading-[1.1] mb-4 tracking-tighter">
            Fast Global Payments.
          </h1>
          <h2 className="text-accent italic text-2xl md:text-4xl lg:text-5xl mb-6 tracking-tighter">
            Low fees. Real independence.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-primary/60 font-medium leading-[1.4] max-w-2xl mx-auto">
            Use your phone number as your global ID. Send and receive money instantly, without the delays or high fees of traditional banks.
          </p>
        </div>

        {/* Bottom Section: Right-Shifted Grouped Interactive Section */}
        <div className="w-full max-w-[1100px] mx-auto grid lg:grid-cols-5 gap-12 items-center mb-20 lg:mb-28">

          {/* Left Columns (3/5): Right-Shifted CTAs */}
          <div className="lg:col-span-3 animate-fade-up space-y-8 flex flex-col items-center lg:items-end lg:pr-12" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-end w-full">
              <Button onClick={openAuthModal} className="rounded-2xl px-10 py-7 text-base font-bold shadow-2xl shadow-primary/10 transition-all hover:-translate-y-1 whitespace-nowrap">
                Getting Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="rounded-2xl px-10 py-7 text-base font-bold bg-white/50 backdrop-blur-sm border-primary/10 transition-all hover:-translate-y-1 whitespace-nowrap">
                Download App
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-end w-full">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-accent/10 rounded-full border border-accent/20">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-xs font-black text-primary uppercase tracking-wider">Phone ID System</span>
              </div>
              <p className="text-[10px] text-primary/30 leading-relaxed font-black uppercase tracking-[0.4em]">
                Instant • Secure • Global
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
                    <div className="p-10 h-full bg-primary/5 rounded-[2.5rem] border border-primary/10 shadow-sm transition-all hover:bg-primary/10 group flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-xl font-black text-primary tracking-tighter mb-1.5 group-hover:text-accent transition-colors">Save More</p>
                      <p className="text-primary/40 text-[8px] font-black uppercase tracking-[0.3em]">Institutional Grade Fees</p>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="basis-full pl-4">
                    <div className="p-10 h-full bg-primary rounded-[2.5rem] border border-white/10 shadow-lg transition-all hover:bg-primary/95 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xl font-black text-white tracking-tighter mb-1.5">Instant Pay</p>
                      <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.3em]">Global Settlement</p>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="basis-full pl-4">
                    <div className="p-10 h-full bg-accent/5 rounded-[2.5rem] border border-accent/20 shadow-sm transition-all hover:bg-accent/10 group flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2" />
                      <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-xl font-black text-primary tracking-tighter mb-1.5 group-hover:text-accent transition-colors">Secured</p>
                      <p className="text-primary/40 text-[8px] font-black uppercase tracking-[0.3em]">End-to-End Encryption</p>
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
