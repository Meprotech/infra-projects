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
  { label: "Founded", value: 2016, display: "2016" },
  { label: "Years of Experience", value: 10, suffix: "+" },
  { label: "Employees", value: 80, suffix: "+" }, // [EMPLOYEE COUNT]
  { label: "States Covered", value: 4, suffix: "+" }, // [STATES COVERED]
];
