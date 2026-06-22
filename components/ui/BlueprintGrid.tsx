import { cn } from "@/lib/utils";

interface BlueprintGridProps {
  className?: string;
  /** add a slow horizontal pan animation */
  pan?: boolean;
  /** larger 96px grid instead of 48px */
  large?: boolean;
  /** fade the grid out toward the edges */
  fade?: boolean;
}

/**
 * Subtle engineering/blueprint grid texture used as a section backdrop.
 * Decorative only — aria-hidden, pointer-events off.
 */
export function BlueprintGrid({
  className,
  pan = false,
  large = false,
  fade = true,
}: BlueprintGridProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-blueprint-grid",
        large ? "bg-grid-lg" : "bg-grid",
        pan && "animate-grid-pan",
        fade &&
          "[mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]",
        className,
      )}
    />
  );
}
