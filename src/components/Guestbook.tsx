"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { GoldDivider } from "./Ornament";
import { wishSchema } from "@/lib/validation";

interface Wish { id: string; name: string; wish: string; message: string | null; created_at: string }
const field = "w-full border-b border-antique/50 bg-transparent px-1 py-3 font-display text-xl text-midnight placeholder:text-midnight/35 outline-none transition focus:border-burgundy";

export function Guestbook() {
  const [wishes, setWishes] = useState<Wish[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState(""); const [wish, setWish] = useState(""); const [message, setMessage] = useState(""); const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/wishes", { cache: "no-store" });
      if (!r.ok) throw new Error();
      setWishes((await r.json()).wishes); setLoadError(false);
    } catch { setLoadError(true); setWishes([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = wishSchema.safeParse({ name, wish, message, website });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const i of parsed.error.issues) next[String(i.path[0])] ??= i.message;
      return setErrors(next);
    }
    setErrors({}); setStatus("sending");
    try {
      const r = await fetch("/api/wishes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErrors({ form: d.error ?? "Something went wrong. Please try again." }); setStatus("idle"); return; }
      setStatus("done"); setName(""); setWish(""); setMessage("");
    } catch { setErrors({ form: "We couldn't reach the server. Please try again." }); setStatus("idle"); }
  }

  return (
    <section id="blessings" className="bg-ivory px-5 py-24 text-midnight sm:py-32">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <p className="font-script text-5xl text-antique sm:text-6xl">Guestbook</p>
          <h2 className="mt-2 font-display text-4xl font-light text-burgundy sm:text-6xl">LEAVE YOUR BLESSINGS</h2>
          <GoldDivider className="my-7 text-antique" />
        </header>

        <div className="grid gap-14 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
          <div>
            {status === "done" ? (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} role="status" className="border border-antique/50 p-8 text-center">
                <p className="font-script text-5xl text-burgundy">Thank you</p>
                <p className="mt-3 font-display text-xl">Your blessings are with the family. They will appear on the wall once approved.</p>
                <button onClick={() => setStatus("idle")} className="mt-6 rounded-full border border-burgundy px-6 py-2.5 text-xs tracking-[0.2em] text-burgundy hover:bg-burgundy hover:text-champagne">WRITE ANOTHER</button>
              </motion.div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <div>
                  <label htmlFor="g-name" className="text-[11px] tracking-[0.25em] text-burgundy">YOUR NAME</label>
                  <input id="g-name" className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
                  <p className="min-h-5 text-sm text-red-800">{errors.name}</p>
                </div>
                <div>
                  <label htmlFor="g-wish" className="text-[11px] tracking-[0.25em] text-burgundy">YOUR WEDDING WISH</label>
                  <input id="g-wish" className={field} value={wish} onChange={(e) => setWish(e.target.value)} maxLength={160} placeholder="A line for the couple" aria-invalid={!!errors.wish} />
                  <p className="min-h-5 text-sm text-red-800">{errors.wish}</p>
                </div>
                <div>
                  <label htmlFor="g-msg" className="text-[11px] tracking-[0.25em] text-burgundy">PERSONAL MESSAGE <span className="opacity-60">(OPTIONAL)</span></label>
                  <textarea id="g-msg" rows={4} className={`${field} resize-none`} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={600} />
                  <p className="min-h-5 text-sm text-red-800">{errors.message}</p>
                </div>
                <div aria-hidden className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label></div>
                {errors.form && <p role="alert" className="border border-red-800/40 bg-red-50 px-4 py-3 text-red-900">{errors.form}</p>}
                <button disabled={status === "sending"} className="inline-flex items-center gap-3 rounded-full bg-burgundy px-9 py-3.5 text-xs tracking-[0.25em] text-champagne transition hover:bg-[#5d1730] disabled:opacity-60">
                  {status === "sending" ? <><Loader2 size={15} className="animate-spin" />SENDING</> : "SEND BLESSINGS"}
                </button>
                <p className="text-sm text-midnight/55">Messages are shown on the wall after the family approves them.</p>
              </form>
            )}
          </div>

          <div aria-live="polite">
            {wishes === null ? <div className="flex justify-center py-20 text-antique"><Loader2 className="animate-spin" /></div>
              : loadError ? <p className="py-16 text-center font-display text-xl italic text-midnight/60">The blessings wall isn&apos;t available right now. Please check back soon.</p>
              : wishes.length === 0 ? <p className="py-16 text-center font-display text-xl italic text-midnight/60">Be the first to leave a blessing.</p>
              : (
                <div className="columns-1 gap-5 sm:columns-2">
                  <AnimatePresence>
                    {wishes.map((w, i) => (
                      <motion.article key={w.id} initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1 : -1 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8, delay: (i % 4) * 0.08 }}
                        className="relative mb-5 break-inside-avoid border border-antique/40 bg-white/60 p-6 shadow-sm">
                        <div className="pointer-events-none absolute inset-1.5 border border-antique/20" />
                        <p className="font-script text-4xl leading-[1] text-burgundy">{w.wish}</p>
                        {w.message && <p className="mt-3 font-display text-lg leading-snug text-midnight/80">{w.message}</p>}
                        <p className="mt-4 text-[11px] tracking-[0.22em] text-antique">— {w.name.toUpperCase()}</p>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
