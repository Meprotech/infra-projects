// Office locations plotted onto the India SVG map.
// x/y are in the map's coordinate space (viewBox "0 0 612 696" — see india-geo.ts).
// Coordinates derived from the actual state geometry (bounding boxes) so each
// pin lands inside the correct state at roughly the right city position.

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
  { id: "l1", city: "Surat", state: "Gujarat", type: "Head Office", x: 96, y: 381 },
  { id: "l2", city: "Gandhinagar", state: "Gujarat", type: "Regional Office", x: 93, y: 336 },
  { id: "l3", city: "Vadodara", state: "Gujarat", type: "Site Office", x: 104, y: 358 },
  { id: "l4", city: "Jaipur", state: "Rajasthan", type: "Regional Office", x: 160, y: 250 },
  { id: "l5", city: "Lucknow", state: "Uttar Pradesh", type: "Site Office", x: 268, y: 252 },
  { id: "l6", city: "Patna", state: "Bihar", type: "Site Office", x: 355, y: 280 },
];
