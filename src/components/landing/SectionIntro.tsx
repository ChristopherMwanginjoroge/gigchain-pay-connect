import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionIntroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
};

const SectionIntro = ({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  className,
}: SectionIntroProps) => {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" && "mx-auto text-center",
        invert ? "text-white" : "text-slate-950",
        className,
      )}
    >
      <span
        className={cn(
          "eyebrow",
          invert
            ? "border-white/15 bg-white/10 text-cyan-100"
            : "border-cyan-200 bg-cyan-50 text-cyan-900",
        )}
      >
        {eyebrow}
      </span>
      <div className="space-y-3">
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[3.2rem]">
          {title}
        </h2>
        <p className={cn("max-w-xl text-sm leading-7 sm:text-base", invert ? "text-slate-300" : "text-slate-600", align === "center" && "mx-auto")}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default SectionIntro;
