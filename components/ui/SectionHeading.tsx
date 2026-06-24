"use client";

import { Reveal } from "@/components/ui/Reveal";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Reveal>
        <span className="eyebrow">
          {eyebrow}
        </span>
      </Reveal>
      <h2 className="mt-4 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-concrete-50 sm:text-4xl md:text-5xl">
        <AnimatedText text={title} inView className="text-gradient" />
      </h2>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-concrete-400 sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
