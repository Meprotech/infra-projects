import { AnimatedText } from "@/components/ui/AnimatedText";
import { Reveal } from "@/components/ui/Reveal";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/** Reusable inner-page hero header (used by /projects and /contact). */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-concrete-800 bg-concrete-950 pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-radial-fade blur-2xl" />
      <div className="section-shell relative">
        <span className="eyebrow">
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-[1.05] tracking-tight text-concrete-50 sm:text-5xl md:text-6xl">
          <AnimatedText text={title} className="text-gradient" />
        </h1>
        {description && (
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-base text-concrete-400 sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
