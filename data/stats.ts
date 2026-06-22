// Stat counters for the About section. `value` is the number animated up to;
// `prefix`/`suffix` decorate it. Replace the bracketed labels/values with reals.

export interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  // Optional override shown verbatim instead of the animated number
  // (e.g. a founding year that shouldn't read as a count-up of "2,017").
  display?: string;
}

export const STATS: Stat[] = [
  { label: "Founded", value: 2017, display: "[FOUNDING YEAR]" },
  { label: "Years of Experience", value: 8, suffix: "+" }, // [YEARS OF EXPERIENCE]
  { label: "Projects Completed", value: 120, suffix: "+" }, // [PROJECT COUNT]
  { label: "States Covered", value: 4, suffix: "+" }, // [STATES COVERED]
];
