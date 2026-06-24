export const SITE = {
  name: "Kalathiya Infrastructure",
  shortName: "Kalathiya",
  logo: {
    mark: "/kalathiya-logo-mark.webp",
    full: "/kalathiya-logo-full.png",
  },
  taglineOptions: [
    "Engineering the Networks a Nation Runs On.",
    "Building the Infrastructure Beneath Progress.",
    "Building Infrastructure for Future.",
  ],
  tagline: "Building Infrastructure for Future.",
  description:
    "Kalathiya Infrastructure delivers water supply, sewerage, drainage, stormwater, irrigation and environmental infrastructure projects across India.",
  foundingYear: "2016",
  contact: {
    addresses: [
      {
        label: "Head Office",
        value:
          "412, Avalon Business Hub, Katargam, Surat - 395004, Gujarat",
      },
      {
        label: "Regional Execution Office",
        value:
          "House No. 25, Near Hanuman Temple, MR-3, Gautam Nagar, Balgrah Road, Dewas - 455001, Madhya Pradesh",
      },
    ],
    phones: [
      { label: "+91 99044 32736", href: "+919904432736" },
      { label: "+91 99044 32366", href: "+919904432366" },
    ],
    email: "kalathiya.infra@gmail.com",
  },
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
  nav: [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Competencies", href: "/#services" },
    { label: "Projects", href: "/#projects" },
    { label: "Presence", href: "/#presence" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
