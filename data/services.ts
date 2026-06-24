import {
  Building2,
  Factory,
  MapPin,
  Network,
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
    id: "har-ghar-nal-jal",
    title: "Har Ghar Nal Jal Yojana",
    icon: MapPin,
    summary:
      "Complete turnkey execution of rural and urban distribution schemes, guaranteeing micro-level household tap connectivity.",
    points: [
      "Turnkey water distribution",
      "Rural and urban schemes",
      "Household tap connectivity",
      "Testing and commissioning",
    ],
  },
  {
    id: "water-treatment-plants",
    title: "Water Treatment Plants (WTP)",
    icon: Factory,
    summary:
      "Civil layout, intake construction and mechanical erection of filtration modules ensuring raw-to-potable water conversion.",
    points: [
      "Civil and hydraulic layout",
      "Intake construction",
      "Filtration module erection",
      "Raw-to-potable conversion",
    ],
  },
  {
    id: "pipeline-transmission",
    title: "Pipeline Transmission Networks",
    icon: Network,
    summary:
      "High-pressure trenching, alignment and hydraulic testing of cross-country pipelines including MS, DI and HDPE.",
    points: [
      "Cross-country pipelines",
      "Trenching and alignment",
      "Hydraulic pressure testing",
      "MS, DI and HDPE networks",
    ],
  },
  {
    id: "urban-drainage-stp",
    title: "Urban Drainage & STP",
    icon: Building2,
    summary:
      "Advanced civil underground sewerage networks and biological treatment facilities for long-term urban sanitation.",
    points: [
      "Underground sewerage networks",
      "Urban drainage systems",
      "Biological treatment facilities",
      "Long-term sanitation works",
    ],
  },
];
