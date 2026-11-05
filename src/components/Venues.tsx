"use client";
import { useState } from "react";
import { Navigation, MapPin, Hotel, Plane, Phone } from "lucide-react";
import { GoldDivider } from "./Ornament";
import { EVENTS, dateLabel, type City } from "@/lib/events";
import { GUEST_INFO } from "@/lib/wedding";
import { cn } from "@/lib/utils";

interface Venue { url: string; city: City; events: typeof EVENTS }
function buildVenues(): Venue[] {
  const map = new Map<string, Venue>();
  for (const e of EVENTS) for (const m of e.maps) {
    const city = (m.label as City);
    const v = map.get(m.url) ?? { url: m.url, city, events: [] };
    v.events.push(e); map.set(m.url, v);
  }
  return [...map.values()];
}
const VENUES = buildVenues();
const CITIES: City[] = ["Vizag", "Guntur"];

export function Venues() {
  const [city, setCity] = useState<City>("Vizag");
  const venues = VENUES.filter((v) => v.city === city);
  const hotels = GUEST_INFO.hotels.filter((h) => h.city === city);
  const travel = GUEST_INFO.travel.filter((t) => t.city === city);

  return (
    <section id="venues" className="bg-emerald px-5 py-24 text-ivory sm:py-36">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <p className="font-script text-5xl text-champagne sm:text-6xl">Join Us</p>
          <h2 className="mt-2 font-display text-4xl font-light sm:text-6xl">Venues &amp; Travel</h2>
          <GoldDivider className="my-7" />
        </header>

        <div role="tablist" aria-label="City" className="mx-auto flex w-fit gap-1 rounded-full border border-champagne/40 p-1">
          {CITIES.map((c) => (
            <button key={c} role="tab" aria-selected={city === c} onClick={() => setCity(c)}
              className={cn("rounded-full px-8 py-2.5 text-xs tracking-[0.25em] transition", city === c ? "bg-champagne text-midnight" : "text-champagne hover:bg-champagne/10")}>{c.toUpperCase()}</button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2" role="tabpanel">
          {venues.map((v, i) => (
            <article key={v.url} className="relative border border-champagne/30 bg-black/15 p-7 transition hover:border-champagne/70 hover:bg-black/25 sm:p-9">
              <MapPin className="text-champagne" size={22} />
              <h3 className="mt-4 font-serif text-2xl">{v.city} · Location {i + 1}</h3>
              <p className="mt-1 text-sm text-ivory/60">Venue name and address to be announced by the families.</p>
              <ul className="mt-5 space-y-1.5 font-display text-lg">
                {v.events.map((e) => <li key={e.id} className="flex justify-between gap-4 border-b border-champagne/15 pb-1.5"><span>{e.title}</span><span className="shrink-0 text-ivory/65">{dateLabel(e)} · {e.time}</span></li>)}
              </ul>
              <a href={v.url} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-champagne px-7 py-3 text-xs tracking-[0.2em] text-midnight transition hover:bg-ivory">
                <Navigation size={14} />GET DIRECTIONS<span className="sr-only"> to {v.city} location {i + 1} (opens Google Maps)</span>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <InfoCard icon={<Hotel size={22} />} title="Nearby hotels" empty={`Hotel suggestions for ${city} will be shared by the families.`}
            items={hotels.map((h) => ({ key: h.name, node: h.url ? <a className="underline decoration-champagne/50 underline-offset-4 hover:text-champagne" href={h.url} target="_blank" rel="noopener noreferrer">{h.name}</a> : h.name, note: h.note }))} />
          <InfoCard icon={<Plane size={22} />} title="Travel" empty={`Travel details for ${city} will be shared by the families.`}
            items={travel.map((t) => ({ key: t.text, node: t.text }))} />
          <InfoCard icon={<Phone size={22} />} title="Contact" empty="Contact numbers will be shared by the families."
            items={GUEST_INFO.contacts.map((c) => ({ key: c.phone, node: <><span>{c.name}</span> <a className="text-champagne underline underline-offset-4" href={`tel:${c.phone}`}>{c.phone}</a></>, note: c.role }))} />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, items, empty }: { icon: React.ReactNode; title: string; items: { key: string; node: React.ReactNode; note?: string }[]; empty: string }) {
  return (
    <div className="border border-champagne/20 p-7">
      <div className="text-champagne">{icon}</div>
      <h3 className="mt-3 font-serif text-xl">{title}</h3>
      {items.length === 0 ? <p className="mt-2 font-display text-lg italic text-ivory/60">{empty}</p> : (
        <ul className="mt-3 space-y-2 font-display text-lg">{items.map((i) => <li key={i.key}>{i.node}{i.note && <span className="block text-sm text-ivory/60">{i.note}</span>}</li>)}</ul>
      )}
    </div>
  );
}
