// Sample project records. Structured so a CMS could later supply the same shape
// without touching the components. All entries are placeholders.

export type Sector =
  | "Water Supply"
  | "Sewerage & Drainage"
  | "Irrigation"
  | "Environment";

export interface Project {
  id: string;
  name: string;
  client: string;
  state: string;
  sector: Sector;
  year: string;
  // Unsplash source URLs are intentionally generic placeholders.
  image: string;
  blurb: string;
}

// Deterministic placeholder imagery (infrastructure / construction themed).
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "[PROJECT NAME] — Bulk Water Supply Scheme",
    client: "[CLIENT — e.g. Water & Sanitation Mission]",
    state: "Gujarat",
    sector: "Water Supply",
    year: "2023",
    image: img("photo-1581094794329-c8112a89af12"),
    blurb:
      "Trunk mains, pumping stations and reservoirs delivering reliable potable water to a growing urban cluster.",
  },
  {
    id: "p2",
    name: "[PROJECT NAME] — Underground Sewerage Network",
    client: "[CLIENT — e.g. Municipal Corporation]",
    state: "Gujarat",
    sector: "Sewerage & Drainage",
    year: "2022",
    image: img("photo-1503387762-592deb58ef4e"),
    blurb:
      "City-scale sewer collecting system with pumping mains and a sewage treatment facility.",
  },
  {
    id: "p3",
    name: "[PROJECT NAME] — Lift Irrigation Scheme",
    client: "[CLIENT — e.g. State Irrigation Dept.]",
    state: "Rajasthan",
    sector: "Irrigation",
    year: "2023",
    image: img("photo-1500382017468-9049fed747ef"),
    blurb:
      "Multi-stage lift irrigation moving water across elevation to command a large agricultural area.",
  },
  {
    id: "p4",
    name: "[PROJECT NAME] — Stormwater Drainage Works",
    client: "[CLIENT — e.g. Urban Development Authority]",
    state: "Uttar Pradesh",
    sector: "Sewerage & Drainage",
    year: "2021",
    image: img("photo-1473341304170-971dccb5ac1e"),
    blurb:
      "Engineered stormwater drains and outfalls reducing urban flooding across low-lying wards.",
  },
  {
    id: "p5",
    name: "[PROJECT NAME] — Sewage Treatment Plant",
    client: "[CLIENT — e.g. State Pollution Control Board]",
    state: "Bihar",
    sector: "Environment",
    year: "2022",
    image: img("photo-1466611653911-95081537e5b7"),
    blurb:
      "Treatment plant with operation & maintenance, restoring water quality before river discharge.",
  },
  {
    id: "p6",
    name: "[PROJECT NAME] — Rural Water Grid",
    client: "[CLIENT — e.g. Rural Water Supply Mission]",
    state: "Gujarat",
    sector: "Water Supply",
    year: "2024",
    image: img("photo-1521618755572-156ae0cdd74d"),
    blurb:
      "Village-level distribution grid with house connections under a national tap-water programme.",
  },
];

export const PROJECT_FILTERS = [
  "All",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Bihar",
] as const;
