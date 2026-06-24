import {
  Grid2X2,
  HardHat,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface Strength {
  title: string;
  icon: LucideIcon;
  description: string;
}

export const STRENGTHS: Strength[] = [
  {
    title: "Zero-Harm Commitment",
    icon: ShieldCheck,
    description:
      "Strict enforcement of PPE for all personnel and visitors across every site, without exception.",
  },
  {
    title: "Risk Analysis",
    icon: Grid2X2,
    description:
      "Comprehensive technical risk analysis and morning toolbox meetings before all heavy earthwork or high-pressure operations.",
  },
  {
    title: "Ecological Stewardship",
    icon: HardHat,
    description:
      "Focused dust mitigation, structured waste disposal and deep adherence to eco-friendly site restoration practices.",
  },
];
