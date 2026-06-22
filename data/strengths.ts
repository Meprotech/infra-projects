import {
  Layers,
  ShieldCheck,
  Award,
  Lightbulb,
  Users,
  Timer,
  type LucideIcon,
} from "lucide-react";

export interface Strength {
  title: string;
  icon: LucideIcon;
  description: string;
}

export const STRENGTHS: Strength[] = [
  {
    title: "Full-Sector Coverage",
    icon: Layers,
    description:
      "Water, sewerage, drainage, irrigation and environment delivered under one accountable team — fewer interfaces, tighter outcomes.",
  },
  {
    title: "Quality, Audited",
    icon: ShieldCheck,
    description:
      "Material testing, stage inspections and documented QA/QC at every milestone, built to government specifications.",
  },
  {
    title: "Proven Track Record",
    icon: Award,
    description:
      "A portfolio of completed public-infrastructure works trusted by state departments and municipal bodies.",
  },
  {
    title: "Engineered Innovation",
    icon: Lightbulb,
    description:
      "Modern methods, mechanised execution and smart monitoring that cut time and lifecycle cost.",
  },
  {
    title: "Collaborative Delivery",
    icon: Users,
    description:
      "Transparent coordination with authorities, consultants and communities from groundbreaking to handover.",
  },
  {
    title: "On-Time, On-Spec",
    icon: Timer,
    description:
      "Disciplined planning and resourcing that keep critical public works on schedule and within scope.",
  },
];
