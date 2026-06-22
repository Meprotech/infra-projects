// Central site / brand config. Everything bracketed is a placeholder meant to be
// find-and-replaced once real brand content is ready.

export const SITE = {
  name: "[COMPANY NAME]",
  // Three original tagline options — pick one and delete the rest.
  taglineOptions: [
    "Engineering the Networks a Nation Runs On.",
    "Building the Infrastructure Beneath Progress.",
    "From Source to Service — Water, Sewerage, Sustained.",
  ],
  tagline: "Engineering the Networks a Nation Runs On.",
  description:
    "A government-approved infrastructure construction company delivering water supply, sewerage, drainage, stormwater, irrigation and environmental projects across India.",
  foundingYear: "[FOUNDING YEAR]",
  contact: {
    address: "[OFFICE ADDRESS], Gujarat, India",
    email: "[EMAIL]",
    phone: "[PHONE]",
  },
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
  nav: [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/#projects" },
    { label: "Presence", href: "/#presence" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
