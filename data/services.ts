import {
  Droplets,
  Waves,
  Sprout,
  Leaf,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  points: string[];
}

export const SERVICES: Service[] = [
  {
    id: "water-supply",
    title: "Water Supply",
    icon: Droplets,
    summary:
      "End-to-end potable water networks — from intake and treatment to the last household connection.",
    points: [
      "Rising & distribution mains",
      "House service connections",
      "Overhead & underground reservoirs",
      "Pumping stations & SCADA",
    ],
  },
  {
    id: "sewerage-drainage",
    title: "Sewerage & Drainage",
    icon: Waves,
    summary:
      "Underground sewerage and stormwater systems engineered for capacity, longevity and easy maintenance.",
    points: [
      "Sewer collecting systems",
      "Jetting machinery & desilting",
      "Stormwater drainage networks",
      "Manholes & pumping mains",
    ],
  },
  {
    id: "irrigation",
    title: "Irrigation",
    icon: Sprout,
    summary:
      "Canal, lift and micro-irrigation infrastructure that moves water efficiently to where it grows value.",
    points: [
      "Canal lining & distributaries",
      "Lift irrigation schemes",
      "Pipeline irrigation networks",
      "Check dams & control structures",
    ],
  },
  {
    id: "environment",
    title: "Environment & Sanitation",
    icon: Leaf,
    summary:
      "Treatment and sanitation works that keep communities healthy and ecosystems intact.",
    points: [
      "Sewage & effluent treatment plants",
      "Operation & maintenance contracts",
      "Solid & liquid waste management",
      "Public sanitation facilities",
    ],
  },
];
