"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { GoldenEnvelope } from "./GoldenEnvelope";
import { GoldBurst } from "./GoldBurst";
import { GoldDivider } from "./Ornament";
import { Particles } from "./Particles";
import { useReducedMotion } from "@/hooks/useMedia";
import { blessingSchema, FRIENDLY_ERROR, missingConfig, sendBlessing, throttleReason } from "@/lib/capsule";
import { scrollToId } from "@/lib/lenis";

type Stage = "envelope" | "opening" | "letter" | "success";
type Phase = "fold" | "insert" | "close" | "seal" | "burst" | "done";
type Errors = Partial<Record<"name" | "relationship" | "wish", string>>;

const line = "w-full border-0 border-b border-antique/50 bg-transparent px-1 pb-1 pt-0.5 font-display text-2xl italic text-burgundy outline-none transition-colors placeholder:text-burgundy/30 focus:border-burgundy";

export function TimeCapsule() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("envelope");
  const [phase, setPhase] = useState<Phase>("fold");
  const [name, setName] = useState(""); const [relationship, setRelationship] = useState(""); const [wish, setWish] = useState(""); const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  function openEnvelope() {
    if (reduced) return setStage("letter");
    setStage("opening");
    later(() => setStage("letter"), 1500);
  }

  useEffect(() => { if (stage === "letter") later(() => nameRef.current?.focus({ preventScroll: true }), reduced ? 0 : 900); }, [stage, reduced]);

  function playSuccess() {
    setStage("success");
    later(() => scrollToId("capsule-stage"), 120);
    if (reduced) return setPhase("done");
    setPhase("fold");
    later(() => setPhase("insert"), 1300);
    later(() => setPhase("close"), 2500);
    later(() => setPhase("seal"), 3500);
    later(() => setPhase("burst"), 4500);
    later(() => setPhase("done"), 5900);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sendingRef.current) return;         // blocks double clicks / double Enter
    if (trap) return;                        // honeypot: bots fill it, people never see it
    setFormError(null);
    const parsed = blessingSchema.safeParse({ name, relationship, wish });
    if (!parsed.success) {
      const next: Errors = {};
      for (const i of parsed.error.issues) { const k = i.path[0] as keyof Errors; next[k] ??= i.message; }
      setErrors(next);
      (document.querySelector("[data-invalid='true']") as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    const limited = throttleReason();
    if (limited) return setFormError(limited);
    sendingRef.current = true; setSending(true);
    try {
      await sendBlessing(parsed.data);       // resolves only on a confirmed 200 from EmailJS
      setSending(false);
      playSuccess();
    } catch (err) {
      console.error("[Time Capsule] send failed", err);
      setSending(false);
      setFormError(FRIENDLY_ERROR);          // fields are kept so nothing needs retyping
    } finally { sendingRef.current = false; }
  }

  function backToCelebration() {
    scrollToId("celebrations");
    later(() => { setName(""); setRelationship(""); setWish(""); setStage("envelope"); }, 1200);
  }

  const devMissing = process.env.NODE_ENV !== "production" ? missingConfig() : [];

  return (
    <section id="time-capsule" aria-labelledby="capsule-title" className="relative overflow-hidden bg-burgundy px-5 py-24 text-ivory sm:py-36">
      <Particles density={0.9} />
      <div aria-hidden className="pointer-events-none absolute inset-4 border border-champagne/25 sm:inset-8" />
      <div aria-hidden className="pointer-events-none absolute inset-6 border border-champagne/10 sm:inset-10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,180,106,.10),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-script text-5xl text-champagne sm:text-6xl">The Wedding Time Capsule</p>
        <h2 id="capsule-title" className="mt-3 font-display text-4xl font-light leading-tight text-ivory sm:text-6xl">A LITTLE LOVE, A FOREVER MEMORY.</h2>
        <GoldDivider className="my-7" />
        <p className="mx-auto max-w-xl font-display text-xl leading-relaxed text-ivory/80 sm:text-2xl">Your presence makes our celebration special. Leave us a blessing that we can cherish forever.</p>

        <div id="capsule-stage" className={`relative mt-14 ${stage === "success" ? "min-h-[44rem]" : "min-h-[26rem]"}`} aria-live="polite">
          <AnimatePresence mode="wait">
            {(stage === "envelope" || stage === "opening") && (
              <motion.div key="env" exit={{ opacity: 0, y: -20, scale: 0.97 }} transition={{ duration: 0.5 }}>
                <motion.div animate={reduced ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <GoldenEnvelope open={stage === "opening"} letterY={stage === "opening" ? -34 : 0} reduced={reduced} />
                </motion.div>
                <button onClick={openEnvelope} disabled={stage === "opening"} className="mt-12 rounded-full bg-champagne px-10 py-4 text-xs tracking-[0.3em] text-midnight shadow-[0_0_35px_rgba(214,180,106,.35)] transition hover:bg-ivory disabled:opacity-60">LEAVE A BLESSING</button>
              </motion.div>
            )}

            {stage === "letter" && (
              <motion.form key="letter" onSubmit={submit} noValidate initial={{ opacity: 0, y: 40, rotateX: -18 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-xl text-left [transform-style:preserve-3d]" aria-label="Write your blessing">
                <div className="relative rounded-[3px] bg-ivory px-6 pb-9 pt-10 text-burgundy shadow-[0_40px_90px_-25px_rgba(0,0,0,.75)] sm:px-12">
                  <div aria-hidden className="pointer-events-none absolute inset-2.5 border border-antique/60" />
                  <div aria-hidden className="pointer-events-none absolute inset-4 border border-antique/20" />
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="font-script text-5xl leading-none text-antique sm:text-6xl">Dear Prudhvi &amp; Harshitha,</motion.p>

                  <div className="relative mt-7 space-y-6">
                    <Field delay={0.7} id="cap-name" label="With love, from" error={errors.name}>
                      <input ref={nameRef} id="cap-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" className={line} placeholder="Your name"
                        aria-invalid={!!errors.name} data-invalid={!!errors.name} aria-describedby={errors.name ? "cap-name-e" : undefined} />
                    </Field>
                    <Field delay={0.85} id="cap-rel" label="I am your" error={errors.relationship}>
                      <input id="cap-rel" value={relationship} onChange={(e) => setRelationship(e.target.value)} maxLength={80} list="cap-rel-list" className={line} placeholder="friend, cousin, colleague…"
                        aria-invalid={!!errors.relationship} data-invalid={!!errors.relationship} aria-describedby={errors.relationship ? "cap-rel-e" : undefined} />
                      <datalist id="cap-rel-list">{["Family", "Friend", "Cousin", "Colleague", "Neighbour", "Well-wisher"].map((o) => <option key={o} value={o} />)}</datalist>
                    </Field>
                    <Field delay={1} id="cap-wish" label="My wish for you" error={errors.wish}>
                      <textarea id="cap-wish" value={wish} onChange={(e) => setWish(e.target.value)} rows={6} maxLength={1200}
                        className={`${line} letter-lines resize-none leading-[2.45rem]`} placeholder="Write a few words from the heart…"
                        aria-invalid={!!errors.wish} data-invalid={!!errors.wish} aria-describedby={errors.wish ? "cap-wish-e" : undefined} />
                      <span className="mt-1 block text-right text-xs tracking-wider text-burgundy/45">{wish.length}/1200</span>
                    </Field>

                    <div aria-hidden className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>

                    {formError && (
                      <motion.p role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 border border-burgundy/30 bg-burgundy/5 px-4 py-3 font-display text-lg italic text-burgundy">
                        <Heart size={16} className="mt-1.5 shrink-0" />{formError}
                      </motion.p>
                    )}
                    {devMissing.length > 0 && <p className="text-xs text-burgundy/60">Dev note: EmailJS isn&apos;t configured yet (missing {devMissing.join(", ")}). Sending will fail until it is.</p>}

                    <div className="pt-2 text-center">
                      <button type="submit" disabled={sending} className="inline-flex min-w-[16rem] items-center justify-center gap-3 rounded-full bg-burgundy px-10 py-4 text-xs tracking-[0.28em] text-champagne shadow-lg transition hover:bg-[#5d1730] disabled:cursor-wait disabled:opacity-90">
                        SEAL YOUR BLESSING
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {sending && (
                      <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-ivory/90 backdrop-blur-[2px]" role="status">
                        <div className="relative h-16 w-16">
                          {Array.from({ length: 8 }, (_, i) => (
                            <motion.span key={i} className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -ml-[5px] -mt-[5px] rounded-full bg-gradient-to-br from-[#F2D58D] to-[#AA8750]" style={{ transform: `rotate(${i * 45}deg) translateY(-26px)` }}
                              animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.2, 0.7] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
                          ))}
                        </div>
                        <p className="font-script text-4xl text-burgundy">Sealing your blessing…</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.form>
            )}

            {stage === "success" && (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                {phase !== "done" && (
                  <div className="relative mx-auto max-w-[380px] pt-24">
                    <motion.div animate={phase === "burst" ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}>
                      <GoldenEnvelope
                        reduced={reduced}
                        open={phase === "fold" || phase === "insert"}
                        sealed={phase === "seal" || phase === "burst"}
                        letterY={phase === "fold" ? -42 : -4}
                        letterScaleY={phase === "fold" ? 1 : 0.55}
                        letter={<MiniLetter folded={phase !== "fold"} />}
                      />
                    </motion.div>
                    {phase === "burst" && <div className="pointer-events-none absolute inset-x-[-40%] inset-y-0"><GoldBurst /></div>}
                  </div>
                )}
                {phase === "done" && (
                  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mx-auto max-w-xl py-6" role="status">
                    <motion.svg width="70" height="70" viewBox="0 0 70 70" className="mx-auto" aria-hidden>
                      <motion.path d="M35 60 C10 42 6 28 16 18 C24 11 32 16 35 23 C38 16 46 11 54 18 C64 28 60 42 35 60Z" fill="none" stroke="#D6B46A" strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6 }} />
                    </motion.svg>
                    <h3 className="mt-6 font-display text-3xl font-light leading-snug tracking-[0.06em] sm:text-4xl">YOUR LOVE HAS BECOME PART OF OUR STORY.</h3>
                    <p className="mx-auto mt-5 max-w-md font-display text-xl text-ivory/80">Your beautiful blessing has been delivered to Prudhvi &amp; Harshitha. Thank you for being part of their forever.</p>
                    <button onClick={backToCelebration} className="mt-10 rounded-full bg-champagne px-10 py-4 text-xs tracking-[0.3em] text-midnight transition hover:bg-ivory">BACK TO THE CELEBRATION</button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, error, delay, children }: { id: string; label: string; error?: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.7 }}>
      <label htmlFor={id} className="block font-script text-3xl leading-none text-antique">{label}</label>
      <div className="mt-1">{children}</div>
      <p id={`${id}-e`} className="mt-1 min-h-5 text-sm text-[#9b2c2c]">{error}</p>
    </motion.div>
  );
}

function MiniLetter({ folded }: { folded: boolean }) {
  return (
    <div className="relative h-full w-full bg-ivory shadow-md">
      <div className="absolute inset-2 border border-antique/50" />
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="font-script text-2xl leading-none text-antique">Dear Prudhvi &amp; Harshitha,</p>
        {[80, 90, 70, 60].map((w, i) => <span key={i} className="h-px bg-antique/50" style={{ width: `${w}%` }} />)}
      </div>
      {folded && <div className="absolute inset-x-0 top-1/3 h-px bg-antique/50" />}
      {folded && <div className="absolute inset-x-0 top-2/3 h-px bg-antique/40" />}
    </div>
  );
}
