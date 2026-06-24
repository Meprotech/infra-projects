// Office locations plotted onto the India SVG map.
// x/y are in the map's coordinate space (viewBox "0 0 612 696" — see india-geo.ts).
// Coordinates derived from the actual state geometry (bounding boxes) so each
// pin lands inside the correct state at roughly the right city position.

export type OfficeType =
  | "Head Office"
  | "Regional Execution Office"
  | "Site Office";

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
  {
    id: "l2",
    city: "Dewas",
    state: "Madhya Pradesh",
    type: "Regional Execution Office",
    x: 179,
    y: 359,
  },
];
