import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { BadgeDollarSign, LucideIcon, MoveRight, Smartphone, WalletCards } from "lucide-react";

import { cn } from "@/lib/utils";

const floatingCards = [
  {
    icon: WalletCards,
    title: "Virtual accounts",
    detail: "Dedicated receiving routes for global clients.",
    className: "md:left-0 md:top-6",
  },
  {
    icon: BadgeDollarSign,
    title: "Multi-currency",
    detail: "USDC-led settlement with cleaner payout logic.",
    className: "md:-left-6 md:top-[52%]",
  },
  {
    icon: Smartphone,
    title: "Mobile money",
    detail: "Built for M-Pesa-ready regional cash-out flows.",
    className: "md:right-0 md:top-[24%]",
  },
  {
    icon: MoveRight,
    title: "Fast transfers",
    detail: "Designed for seconds, not multi-day payout queues.",
    className: "md:right-2 md:bottom-10",
  },
];

const globeMarkers = [
  { location: [40.7128, -74.006], size: 0.08 },
  { location: [51.5072, -0.1276], size: 0.07 },
  { location: [52.52, 13.405], size: 0.065 },
  { location: [-1.2864, 36.8172], size: 0.11 },
  { location: [19.076, 72.8777], size: 0.07 },
  { location: [1.3521, 103.8198], size: 0.065 },
  { location: [-23.5505, -46.6333], size: 0.07 },
];

const GlobeCard = ({
  title,
  detail,
  icon: Icon,
  className,
}: {
  title: string;
  detail: string;
  icon: LucideIcon;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-[1.3rem] border border-white/14 bg-white/90 p-3 text-slate-950 shadow-lg shadow-slate-950/10 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-950">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
        </div>
      </div>
    </div>
  );
};

const GlobalTransferGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setSize(Math.min(entry.contentRect.width, 460));
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || size === 0) {
      return;
    }

    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.32,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 18000,
      mapBrightness: 7,
      baseColor: [0.47, 0.54, 0.68],
      markerColor: [0.12, 0.88, 0.76],
      glowColor: [0.06, 0.16, 0.28],
      opacity: 0.96,
      markers: globeMarkers,
      onRender: (state) => {
        state.phi = phi;
        state.width = size * 2;
        state.height = size * 2;
        phi += 0.0032;
      },
    });

    return () => globe.destroy();
  }, [size]);

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <span className="eyebrow border-cyan-200 bg-cyan-50 text-cyan-900">Global network</span>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          A cleaner cross-border view for the product story.
        </h3>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Show the product as a connected global settlement layer, then bring the payout back to a local mobile-first
          experience.
        </p>
      </div>

      <div className="relative">
        {/* Floating cards for mobile */}
        <div className="grid gap-3 pb-6 md:hidden">
          {floatingCards.map((card) => (
            <GlobeCard key={card.title} title={card.title} detail={card.detail} icon={card.icon} />
          ))}
        </div>

        {/* Globe container */}
        <div ref={wrapperRef} className="relative mx-auto w-full max-w-[40rem] md:min-h-[36rem]">
          {/* Floating cards for desktop */}
          {floatingCards.map((card) => (
            <div key={card.title} className={cn("absolute z-20 hidden w-[13rem] md:block", card.className)}>
              <GlobeCard title={card.title} detail={card.detail} icon={card.icon} />
            </div>
          ))}

          {/* Simplified globe display */}
          <div className="relative mx-auto aspect-square w-full max-w-[32rem]">
            {/* Soft glow background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 opacity-40 blur-3xl" />
            
            {/* Main globe container */}
            <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-slate-50 to-white shadow-2xl">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full rounded-full"
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Live route indicator */}
            <div className="absolute bottom-[10%] left-1/2 z-20 w-[70%] max-w-md -translate-x-1/2 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">Live route</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{"US -> EU -> Kenya payout flow"}</p>
                </div>
                <div className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Seconds
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Settlement", value: "USDC" },
            { label: "Reach", value: "Global" },
            { label: "Payout UX", value: "Mobile-first" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">{item.label}</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalTransferGlobe;
