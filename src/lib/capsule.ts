import emailjs from "@emailjs/browser";
import { z } from "zod";

/** Config comes from the environment. Nothing is hard-coded; the recipient is fixed in the EmailJS template itself. */
const CFG = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
};
export const missingConfig = () => (Object.entries(CFG).filter(([, v]) => !v).map(([k]) => k));

/** Strips control characters and angle brackets, normalises whitespace. */
export function clean(input: string, multiline = false) {
  let s = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/[<>]/g, "");
  s = multiline ? s.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ") : s.replace(/\s+/g, " ");
  return s.trim();
}

export const blessingSchema = z.object({
  name: z.string().transform((v) => clean(v)).pipe(z.string().min(2, "Please write your name").max(80, "Please keep your name under 80 characters")),
  relationship: z.string().transform((v) => clean(v)).pipe(z.string().min(2, "Tell us how you know the couple").max(80, "Please keep this under 80 characters")),
  wish: z.string().transform((v) => clean(v, true)).pipe(z.string().min(5, "Your wish can't be empty. Write a few words from the heart").max(1200, "Please keep your wish under 1200 characters")),
});
export type Blessing = z.infer<typeof blessingSchema>;

/* ---- Light client-side throttling (the real quota guard is the EmailJS dashboard) ---- */
const LOG_KEY = "rw-capsule-log";
const MIN_GAP_MS = 20_000, WINDOW_MS = 60 * 60 * 1000, MAX_PER_WINDOW = 3;
function readLog(): number[] { try { return (JSON.parse(localStorage.getItem(LOG_KEY) ?? "[]") as number[]).filter((t) => Date.now() - t < WINDOW_MS); } catch { return []; } }
export function throttleReason(): string | null {
  const log = readLog(), last = log[log.length - 1];
  if (last && Date.now() - last < MIN_GAP_MS) return "Please wait a few seconds before sending another blessing.";
  if (log.length >= MAX_PER_WINDOW) return "You've sent a few blessings already. Please try again a little later.";
  return null;
}
const recordSend = () => { try { localStorage.setItem(LOG_KEY, JSON.stringify([...readLog(), Date.now()])); } catch {} };

export const FRIENDLY_ERROR = "Your blessing couldn't be delivered just yet. Please try again.";

/** Sends one blessing through EmailJS. Resolves only when EmailJS confirms success; otherwise throws. */
export async function sendBlessing(b: Blessing) {
  const missing = missingConfig();
  if (missing.length) { console.error("[Time Capsule] EmailJS is not configured. Missing:", missing.join(", ")); throw new Error("not-configured"); }
  const submission_date = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date()) + " IST";
  const res = await emailjs.send(CFG.serviceId, CFG.templateId, {
    guest_name: b.name, relationship: b.relationship, wedding_wish: b.wish, submission_date,
  }, { publicKey: CFG.publicKey });
  if (res.status !== 200) throw new Error(`EmailJS responded with ${res.status}`);
  recordSend();
}
