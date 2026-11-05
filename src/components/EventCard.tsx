"use client";
import { MapPin, Clock, Navigation, CheckCircle2 } from "lucide-react";
import { OrnamentArt } from "./Ornament";
import { dateLabel, eventStatus, shortCountdown, type WeddingEvent } from "@/lib/events";

export function StatusBadge({ event, now }: { event: WeddingEvent; now: number | null }) {
  if (now === null) return null;
  const s = eventStatus(event, now);
  if (s.kind === "tbc") return null;
  const base = "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] tracking-[0.14em]";
  const style = { borderColor: `${event.theme.accent}88`, color: event.theme.accent };
  if (s.kind === "completed") return <span className={base} style={style}><CheckCircle2 size={13} />Completed</span>;
  if (s.kind === "live") return <span className={base} style={style}>Happening now</span>;
  return <span className={base} style={style}>{shortCountdown(s.ms)}</span>;
}

interface Props { event: WeddingEvent; now: number | null; onOpen: (e: WeddingEvent, origin: { x: number; y: number }) => void }

export function EventCard({ event, now, onOpen }: Props) {
  const t = event.theme;
  return (
    <article
      className="event-card group relative overflow-hidden rounded-[4px] shadow-[0_24px_60px_-20px_rgba(0,0,0,.55)] transition-transform duration-500 hover:-translate-y-1"
      style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})`, color: t.ink }}
    >
      <OrnamentArt kind={t.ornament} color={t.accent} className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-40 transition-transform duration-[1500ms] group-hover:rotate-[24deg] sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute inset-2 rounded-[2px] border" style={{ borderColor: `${t.accent}66` }} />
      <div className="relative p-7 sm:p-9">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-5xl font-medium leading-none sm:text-6xl">{dateLabel(event).split(" ")[1]}<span className="ml-2 font-serif text-base font-normal italic tracking-wide sm:text-lg">{dateLabel(event).split(" ")[0]}</span></p>
          <StatusBadge event={event} now={now} />
        </div>
        <h3 className="mt-6 font-serif text-2xl leading-tight sm:text-[1.7rem]">{event.title}</h3>
        <p className="mt-1 font-display text-lg italic opacity-80">{event.tagline}</p>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex items-center gap-2.5"><Clock size={15} style={{ color: t.accent }} /><dt className="sr-only">Time</dt><dd>{event.time}{event.session ? ` · ${event.session}` : ""}</dd></div>
          <div className="flex items-center gap-2.5"><MapPin size={15} style={{ color: t.accent }} /><dt className="sr-only">Location</dt><dd>{event.location}</dd></div>
        </dl>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); onOpen(event, { x: r.left + r.width / 2, y: r.top + r.height / 2 }); }}
            className="rounded-full px-6 py-2.5 text-xs tracking-[0.2em] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: t.ink, color: t.from, outlineColor: t.accent }}
            aria-label={`View details for ${event.title}`}
          >VIEW DETAILS</button>
          {event.maps.map((m) => (
            <a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs tracking-[0.18em] transition hover:bg-black/10"
              style={{ borderColor: `${t.ink}66` }}>
              <Navigation size={13} />{event.maps.length > 1 ? m.label : "Directions"}
              <span className="sr-only"> to {event.title}, {m.label} (opens Google Maps)</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
