// Placeholder client slots. We deliberately do NOT invent real-looking
// government body names or logos. Each renders as a labelled monogram tile.

export interface Client {
  id: string;
  // Generic descriptor only — replace with a real client name + logo asset later.
  label: string;
  monogram: string;
}

export const CLIENTS: Client[] = [
  { id: "c1", label: "[CLIENT LOGO 1]", monogram: "GOV" },
  { id: "c2", label: "[CLIENT LOGO 2]", monogram: "PWD" },
  { id: "c3", label: "[CLIENT LOGO 3]", monogram: "WSM" },
  { id: "c4", label: "[CLIENT LOGO 4]", monogram: "MUN" },
  { id: "c5", label: "[CLIENT LOGO 5]", monogram: "UDA" },
  { id: "c6", label: "[CLIENT LOGO 6]", monogram: "JJM" },
  { id: "c7", label: "[CLIENT LOGO 7]", monogram: "PCB" },
  { id: "c8", label: "[CLIENT LOGO 8]", monogram: "IRR" },
];
