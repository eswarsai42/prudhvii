import { TIME_ZONE } from "./wedding";

export type City = "Vizag" | "Guntur";
export type Ornament = "sparkle" | "marigold" | "moon" | "lotus" | "temple" | "sun";

export interface MapLink { label: string; url: string }
export interface WeddingEvent {
  id: string;
  title: string;
  month: number; // 1-12
  day: number;
  /**
   * EDIT HERE: only set `year` once the family confirms it. Events with `year: null`
   * show their day and month without a year and without a countdown or "completed" badge.
   */
  year: number | null;
  time: string; // display, e.g. "10:30 AM"
  hour: number; // 24h IST
  minute: number;
  location: string; // display text
  cities: City[];
  session?: "Morning" | "Night";
  maps: MapLink[];
  tagline: string;
  description: string; // placeholder copy, replace with real details
  /** Optional background photograph (path in /public). */
  image?: string;
  theme: {
    name: string;
    from: string;
    to: string;
    ink: string; // text colour on the card
    accent: string;
    ornament: Ornament;
  };
}

const G = {
  guntur: "https://maps.app.goo.gl/dWaRnWtcMw6PaEMy8?g_st=ic",
  gunturReception: "https://maps.app.goo.gl/7wLMxHW34khyF3cYA?g_st=ic",
  vizagPasupu: "https://maps.app.goo.gl/4jNWSRocjuBQdNV56?g_st=ic",
  engagement: "https://maps.app.goo.gl/D9DHhyCttK6D4fHa8?g_st=ic",
  sundowner: "https://maps.app.goo.gl/hNVEetddd1DA5cXW7?g_st=ic",
  wedding: "https://maps.app.goo.gl/PfStpAe8ZEd6dj8SA?g_st=ic",
};

const PLACEHOLDER = "Event details will be shared by the families.";

export const EVENTS: WeddingEvent[] = [
  {
    id: "engagement", title: "Engagement", month: 11, day: 1, year: 2026, time: "10:30 AM", hour: 10, minute: 30,
    location: "Vizag", cities: ["Vizag"], session: "Morning", maps: [{ label: "Vizag", url: G.engagement }],
    tagline: "A promise, wrapped in gold.", description: PLACEHOLDER, image: "/images/ring.jpg",
    theme: { name: "Champagne & ivory", from: "#FFF9EF", to: "#E9D6A7", ink: "#3A2A12", accent: "#AA8750", ornament: "sparkle" },
  },
  {
    id: "pasupu", title: "Pasupu Ceremony", month: 11, day: 10, year: null, time: "10:00 AM", hour: 10, minute: 0,
    location: "Guntur & Vizag", cities: ["Guntur", "Vizag"], session: "Morning",
    maps: [{ label: "Guntur", url: G.guntur }, { label: "Vizag", url: G.vizagPasupu }],
    tagline: "Turmeric, marigolds and blessings.", description: PLACEHOLDER,
    theme: { name: "Turmeric & marigold", from: "#F6C445", to: "#E58A1F", ink: "#3B1F05", accent: "#7A3E00", ornament: "marigold" },
  },
  {
    id: "groom-haldi", title: "Groom Haldi", month: 2, day: 15, year: null, time: "10:00 AM", hour: 10, minute: 0,
    location: "Guntur", cities: ["Guntur"], session: "Morning", maps: [{ label: "Guntur", url: G.guntur }],
    tagline: "Golden hands, brighter laughter.", description: PLACEHOLDER,
    theme: { name: "Yellow & orange", from: "#F9D342", to: "#F08A24", ink: "#3B1F05", accent: "#8A3F00", ornament: "marigold" },
  },
  {
    id: "bride-haldi", title: "Bride Haldi", month: 2, day: 19, year: null, time: "10:00 AM", hour: 10, minute: 0,
    location: "Vizag", cities: ["Vizag"], session: "Morning", maps: [{ label: "Vizag", url: G.vizagPasupu }],
    tagline: "Petals, turmeric and joy.", description: PLACEHOLDER,
    theme: { name: "Vibrant yellow & floral", from: "#FBE05A", to: "#F3A03A", ink: "#3B1F05", accent: "#9A4A00", ornament: "lotus" },
  },
  {
    id: "sundowner", title: "Sundowner Celebration", month: 2, day: 19, year: null, time: "4:00 PM", hour: 16, minute: 0,
    location: "Vizag", cities: ["Vizag"], maps: [{ label: "Vizag", url: G.sundowner }],
    tagline: "Golden hour, glasses raised.", description: PLACEHOLDER,
    theme: { name: "Sunset orange & gold", from: "#F2894A", to: "#9A3B2A", ink: "#FFF4E2", accent: "#F4D58D", ornament: "sun" },
  },
  {
    id: "sangeeth", title: "Sangeeth Night", month: 2, day: 19, year: null, time: "7:30 PM", hour: 19, minute: 30,
    location: "Vizag", cities: ["Vizag"], maps: [{ label: "Vizag", url: G.sundowner }],
    tagline: "An evening of music and light.", description: PLACEHOLDER,
    theme: { name: "Midnight & royal purple", from: "#1B1840", to: "#4B2A7B", ink: "#F4E8C8", accent: "#D6B46A", ornament: "moon" },
  },
  {
    id: "kaasi-yatra", title: "Kaasi Yatra", month: 2, day: 20, year: 2027, time: "10:00 AM", hour: 10, minute: 0,
    location: "Vizag", cities: ["Vizag"], maps: [{ label: "Vizag", url: G.wedding }],
    tagline: "A tradition that carries the journey forward.", description: PLACEHOLDER,
    theme: { name: "Telugu heritage", from: "#7A2E1B", to: "#C98A2C", ink: "#FFF4E2", accent: "#F4D58D", ornament: "temple" },
  },
  {
    id: "reception-vizag", title: "Wedding Reception", month: 2, day: 20, year: 2027, time: "7:00 PM", hour: 19, minute: 0,
    location: "Vizag", cities: ["Vizag"], maps: [{ label: "Vizag", url: G.wedding }],
    tagline: "Burgundy, gold and an evening of welcome.", description: PLACEHOLDER,
    theme: { name: "Royal burgundy & gold", from: "#4A1025", to: "#7B2340", ink: "#F4E8C8", accent: "#D6B46A", ornament: "sparkle" },
  },
  {
    id: "grand-wedding", title: "The Grand Wedding", month: 2, day: 20, year: 2027, time: "10:00 PM", hour: 22, minute: 0,
    location: "Vizag", cities: ["Vizag"], maps: [{ label: "Vizag", url: G.wedding }],
    tagline: "Beneath the mandap, two families become one.", description: PLACEHOLDER, image: "/images/hero-garlands.jpg",
    theme: { name: "Royal mandap & temple gold", from: "#2A1608", to: "#8A5A16", ink: "#FFF4E2", accent: "#F2C96B", ornament: "temple" },
  },
  {
    id: "reception-guntur", title: "Wedding Reception", month: 2, day: 21, year: null, time: "8:00 PM", hour: 20, minute: 0,
    location: "Guntur", cities: ["Guntur"], session: "Night", maps: [{ label: "Guntur", url: G.gunturReception }],
    tagline: "Ivory, gold and warm welcomes.", description: PLACEHOLDER,
    theme: { name: "Ivory & gold", from: "#FFF9EF", to: "#E8D3A0", ink: "#3A2A12", accent: "#AA8750", ornament: "sparkle" },
  },
  {
    id: "vratham", title: "Vratham", month: 2, day: 22, year: null, time: "9:00 AM", hour: 9, minute: 0,
    location: "Guntur", cities: ["Guntur"], maps: [{ label: "Guntur", url: G.gunturReception }],
    tagline: "Rituals, flowers and a quiet blessing.", description: PLACEHOLDER,
    theme: { name: "Temple rituals", from: "#123B32", to: "#2E6B55", ink: "#F4E8C8", accent: "#D6B46A", ornament: "lotus" },
  },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const dateLabel = (e: WeddingEvent) => `${MONTHS[e.month - 1]} ${e.day}`;
export const dateLabelFull = (e: WeddingEvent) => (e.year ? `${dateLabel(e)}, ${e.year}` : dateLabel(e));

const pad = (n: number) => String(n).padStart(2, "0");
/** Start instant in India Standard Time, or null while the year is unconfirmed. */
export function eventStart(e: WeddingEvent): Date | null {
  if (!e.year) return null;
  return new Date(`${e.year}-${pad(e.month)}-${pad(e.day)}T${pad(e.hour)}:${pad(e.minute)}:00+05:30`);
}

export type EventStatus =
  | { kind: "tbc" }
  | { kind: "completed" }
  | { kind: "live" }
  | { kind: "upcoming"; ms: number };

const EVENT_LENGTH_MS = 5 * 60 * 60 * 1000;
export function eventStatus(e: WeddingEvent, now: number): EventStatus {
  const start = eventStart(e);
  if (!start) return { kind: "tbc" };
  const t = start.getTime();
  if (now > t + EVENT_LENGTH_MS) return { kind: "completed" };
  if (now >= t) return { kind: "live" };
  return { kind: "upcoming", ms: t - now };
}

export function shortCountdown(ms: number) {
  const m = Math.floor(ms / 60000);
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
  if (d > 0) return `${d}d ${h}h to go`;
  if (h > 0) return `${h}h ${mm}m to go`;
  return `${mm}m to go`;
}

export const eventsByDay = EVENTS;
export { TIME_ZONE };
