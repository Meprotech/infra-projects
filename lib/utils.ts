// Tiny classNames joiner (no clsx dependency — keeps the tree lean).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
