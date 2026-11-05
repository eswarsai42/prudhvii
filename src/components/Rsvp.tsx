"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Minus, Plus } from "lucide-react";
import { GoldDivider } from "./Ornament";
import { EVENTS, dateLabel } from "@/lib/events";
import { rsvpSchema } from "@/lib/validation";
import { COUPLE, SITE } from "@/lib/wedding";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "phone" | "guests" | "events" | "message" | "form", string>>;
const field = "w-full border-b border-champagne/40 bg-transparent px-1 py-3 font-display text-xl text-ivory placeholder:text-ivory/35 outline-none transition focus:border-champagne";

export function Rsvp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [events, setEvents] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const allSelected = events.length === EVENTS.length;
  const toggle = (id: string) => setEvents((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = rsvpSchema.safeParse({ name, phone, guests, events, message, website });
    if (!parsed.success) {
      const next: Errors = {};
      for (const i of parsed.error.issues) { const k = String(i.path[0]) as keyof Errors; next[k] ??= i.message; }
      setErrors(next);
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setErrors({}); setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErrors({ form: data.error ?? "Something went wrong. Please try again." }); setStatus("idle"); return; }
      setStatus("done");
    } catch { setErrors({ form: "We couldn't reach the server. Check your connection and try again." }); setStatus("idle"); }
  }

  const waText = encodeURIComponent(`Hello! This is ${name}. I have confirmed my RSVP for ${COUPLE.groom} & ${COUPLE.bride}'s wedding celebrations (${guests} ${guests === 1 ? "guest" : "guests"}).`);

  return (
    <section id="rsvp" className="relative overflow-hidden bg-burgundy px-5 py-24 text-ivory sm:py-36">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <p className="font-script text-5xl text-champagne sm:text-6xl">RSVP</p>
          <h2 className="mt-2 font-display text-4xl font-light leading-tight sm:text-6xl">WE WOULD LOVE TO CELEBRATE WITH YOU</h2>
          <GoldDivider className="my-7" />
        </header>

        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center" role="status">
              <svg width="96" height="96" viewBox="0 0 96 96" className="mx-auto" aria-hidden>
                <motion.circle cx="48" cy="48" r="44" fill="none" stroke="#D6B46A" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
                <motion.path d="M28 50 L43 64 L69 34" fill="none" stroke="#D6B46A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.8 }} />
              </svg>
              <h3 className="mt-6 font-serif text-3xl">Thank you, {name.split(" ")[0]}.</h3>
              <p className="mx-auto mt-3 max-w-md font-display text-xl text-ivory/80">Your RSVP is confirmed for {guests} {guests === 1 ? "guest" : "guests"} across {events.length} {events.length === 1 ? "celebration" : "celebrations"}. We can&apos;t wait to see you.</p>
              {SITE.whatsapp && (
                <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full bg-champagne px-8 py-3.5 text-xs tracking-[0.22em] text-midnight transition hover:bg-ivory">CONFIRM ON WHATSAPP</a>
              )}
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate className="space-y-9" exit={{ opacity: 0 }}>
              <div className="grid gap-9 sm:grid-cols-2">
                <div>
                  <label htmlFor="rsvp-name" className="text-[11px] tracking-[0.25em] text-champagne">GUEST NAME</label>
                  <input id="rsvp-name" className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby="e-name" placeholder="Your full name" />
                  <p id="e-name" className="mt-1 min-h-5 text-sm text-[#f3b3b3]">{errors.name}</p>
                </div>
                <div>
                  <label htmlFor="rsvp-phone" className="text-[11px] tracking-[0.25em] text-champagne">PHONE NUMBER</label>
                  <input id="rsvp-phone" className={field} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby="e-phone" placeholder="+91 98765 43210" />
                  <p id="e-phone" className="mt-1 min-h-5 text-sm text-[#f3b3b3]">{errors.phone}</p>
                </div>
              </div>

              <div>
                <span id="guests-label" className="text-[11px] tracking-[0.25em] text-champagne">NUMBER OF GUESTS</span>
                <div className="mt-3 flex items-center gap-6" role="group" aria-labelledby="guests-label">
                  <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests" className="rounded-full border border-champagne/50 p-3 text-champagne hover:bg-champagne/10"><Minus size={16} /></button>
                  <output className="w-12 text-center font-display text-4xl" aria-live="polite">{guests}</output>
                  <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))} aria-label="More guests" className="rounded-full border border-champagne/50 p-3 text-champagne hover:bg-champagne/10"><Plus size={16} /></button>
                </div>
                <p className="mt-1 min-h-5 text-sm text-[#f3b3b3]">{errors.guests}</p>
              </div>

              <fieldset aria-describedby="e-events">
                <legend className="text-[11px] tracking-[0.25em] text-champagne">EVENTS ATTENDING</legend>
                <button type="button" onClick={() => setEvents(allSelected ? [] : EVENTS.map((e) => e.id))} className="mt-3 rounded-full border border-champagne/50 px-4 py-1.5 text-xs tracking-[0.18em] text-champagne hover:bg-champagne/10">{allSelected ? "CLEAR ALL" : "ALL CELEBRATIONS"}</button>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {EVENTS.map((e) => {
                    const on = events.includes(e.id);
                    return (
                      <label key={e.id} className={cn("flex cursor-pointer items-center gap-3 border px-4 py-3 transition focus-within:outline focus-within:outline-2 focus-within:outline-champagne", on ? "border-champagne bg-champagne/10" : "border-champagne/25 hover:border-champagne/60")}>
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(e.id)} />
                        <span aria-hidden className={cn("flex h-4 w-4 shrink-0 items-center justify-center border", on ? "border-champagne bg-champagne text-midnight" : "border-champagne/60")}>{on && <svg viewBox="0 0 12 12" width="10" height="10"><path d="M2 6.5 5 9.5 10 3" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>}</span>
                        <span className="font-display text-lg leading-tight">{e.title}<span className="block text-sm text-ivory/60">{dateLabel(e)} · {e.location}</span></span>
                      </label>
                    );
                  })}
                </div>
                <p id="e-events" className="mt-2 min-h-5 text-sm text-[#f3b3b3]">{errors.events}</p>
              </fieldset>

              <div>
                <label htmlFor="rsvp-msg" className="text-[11px] tracking-[0.25em] text-champagne">SPECIAL MESSAGE <span className="opacity-60">(OPTIONAL)</span></label>
                <textarea id="rsvp-msg" rows={3} className={cn(field, "resize-none")} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={600} placeholder="Dietary needs, travel plans, or a note for the family" />
                <p className="mt-1 min-h-5 text-sm text-[#f3b3b3]">{errors.message}</p>
              </div>

              <div aria-hidden className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label></div>

              {errors.form && <p role="alert" className="border border-[#f3b3b3]/50 bg-black/20 px-4 py-3 text-[#f3b3b3]">{errors.form}</p>}
              <div className="text-center">
                <button disabled={status === "sending"} className="inline-flex min-w-[15rem] items-center justify-center gap-3 rounded-full bg-champagne px-10 py-4 text-xs tracking-[0.25em] text-midnight transition hover:bg-ivory disabled:opacity-60">
                  {status === "sending" ? <><Loader2 size={16} className="animate-spin" />SENDING</> : "SEND MY RSVP"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
