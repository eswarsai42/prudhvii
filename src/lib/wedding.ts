export const COUPLE = {
  groom: "Tallam Prudhvi",
  bride: "Padmanabhuni Harshitha",
  initials: ["P", "H"] as const,
};

export const WEDDING_DATE_LABEL = "February 20, 2027";
/** Countdown target: The Grand Wedding, 10:00 PM India Standard Time. Edit if the muhurtham changes. */
export const WEDDING_TARGET_ISO = "2027-02-20T22:00:00+05:30";
export const TIME_ZONE = "Asia/Kolkata";

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
  musicUrl: process.env.NEXT_PUBLIC_MUSIC_URL ?? "",
};

export const VEERLABS = {
  name: "VEERLABS",
  url: "https://veerlabs.vercel.app",
  tagline: "Building Brands That Stand Out Online.",
};

export const STORY = {
  heading: "Every Love Story Has Its Own Magic.",
  subheading: "A Beautiful Beginning",
  paragraphs: [
    "It began with our families bringing us together, expecting a simple first meeting. But what started as a formal introduction soon turned into endless conversations, shared laughter, and a beautiful connection neither of us expected.",
    "Somewhere between those conversations, we discovered something special, a comfort that felt familiar, a bond that felt natural and happiness that came effortlessly.",
    "Began with two families slowly became two hearts choosing each other.",
  ],
  closing: "Two families. Two hearts. One beautiful forever.",
  invite: "And we'd love to have you by our side as we begin this journey together.",
};

/** Guest information. Left empty on purpose: add real details only when the families confirm them. */
export const GUEST_INFO = {
  hotels: [] as { name: string; city: "Guntur" | "Vizag"; note?: string; url?: string }[],
  travel: [] as { city: "Guntur" | "Vizag"; text: string }[],
  contacts: [] as { name: string; role?: string; phone: string }[],
};

export const NAV = [
  { id: "home", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "celebrations", label: "Celebrations" },
  { id: "gallery", label: "Gallery" },
  { id: "venues", label: "Venues" },
  { id: "rsvp", label: "RSVP" },
];
