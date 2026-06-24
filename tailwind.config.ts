import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Concrete / industrial base palette — LIGHT theme.
        // The scale is used monotonically across the app: high numbers are
        // surfaces (now light), low numbers are text (now dark). Flipping the
        // ramp here re-skins the whole site light without touching components.
        concrete: {
          950: "#f4f3ee", // page background — normal warm off-white
          900: "#fbfaf7", // elevated surfaces (footer, cards) — near white
          800: "#eae7e0", // subtle surfaces / icon chips / hover bg
          700: "#ddd9d0", // borders
          600: "#cac5ba", // stronger borders / default border / scrollbar
          500: "#a39d90", // faint dividers
          400: "#6a665d", // muted text
          300: "#48453e", // secondary text
          200: "#282621", // primary body text
          100: "#191814",
          50: "#100f0d", // headings (near-black)
        },
        // Text that sits on the (now near-black) accent — white for contrast.
        ink: "#ffffff",
        // Accent — "safety amber". Swap these values (or --accent in globals)
        // to retheme to steel-blue, etc.
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
        },
        steel: {
          DEFAULT: "rgb(var(--steel) / <alpha-value>)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse at center, rgb(var(--accent) / 0.12), transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--accent) / 0.25), 0 12px 40px -12px rgb(var(--accent) / 0.35)",
        lift: "0 18px 50px -24px rgba(15,18,22,0.25)",
      },
      keyframes: {
        "scroll-x": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "70%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "scroll-x": "scroll-x var(--marquee-duration, 40s) linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
