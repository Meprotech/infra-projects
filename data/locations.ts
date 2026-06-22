// Office locations plotted onto the India SVG map.
// x/y are in the map's coordinate space (viewBox "0 0 612 696" — see india-geo.ts).
// Positions are approximate, tuned for a stylized presence map, not survey-grade.

export type OfficeType = "Head Office" | "Regional Office" | "Site Office";

export interface OfficeLocation {
  id: string;
  city: string;
  state: string;
  type: OfficeType;
  x: number;
  y: number;
}

export const LOCATIONS: OfficeLocation[] = [
  { id: "l1", city: "Gandhinagar", state: "Gujarat", type: "Head Office", x: 129, y: 340 },
  { id: "l2", city: "Vadodara", state: "Gujarat", type: "Regional Office", x: 142, y: 356 },
  { id: "l3", city: "Surat", state: "Gujarat", type: "Site Office", x: 134, y: 380 },
  { id: "l4", city: "Jaipur", state: "Rajasthan", type: "Regional Office", x: 190, y: 256 },
  { id: "l5", city: "Lucknow", state: "Uttar Pradesh", type: "Site Office", x: 289, y: 258 },
  { id: "l6", city: "Patna", state: "Bihar", type: "Site Office", x: 372, y: 284 },
];
