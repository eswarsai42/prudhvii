"use client";
import { useState } from "react";

interface Wish { id: string; name: string; wish: string; message: string | null; approved: boolean; created_at: string }

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [wishes, setWishes] = useState<Wish[] | null>(null);
  const [err, setErr] = useState("");

  async function load(password = pw) {
    setErr("");
    const r = await fetch("/api/admin/wishes", { headers: { "x-admin-password": password }, cache: "no-store" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { setErr(d.error ?? "Could not load."); setWishes(null); return; }
    setWishes(d.wishes);
  }
  async function act(id: string, action: "approve" | "unpublish" | "delete") {
    const r = await fetch("/api/admin/wishes", { method: "POST", headers: { "x-admin-password": pw, "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    if (!r.ok) setErr("Action failed."); else load();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-16">
      <meta name="robots" content="noindex,nofollow" />
      <h1 className="font-display text-4xl text-champagne">Guestbook moderation</h1>
      {!wishes ? (
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="mt-8 flex gap-3">
          <label className="sr-only" htmlFor="pw">Admin password</label>
          <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Admin password" className="flex-1 border-b border-champagne/50 bg-transparent px-1 py-2 outline-none focus:border-champagne" />
          <button className="rounded-full bg-champagne px-6 py-2 text-xs tracking-[0.2em] text-midnight">OPEN</button>
        </form>
      ) : (
        <ul className="mt-8 space-y-4">
          {wishes.length === 0 && <li className="text-ivory/60">No messages yet.</li>}
          {wishes.map((w) => (
            <li key={w.id} className="border border-champagne/25 p-5">
              <p className="text-xs tracking-[0.2em] text-champagne">{w.approved ? "PUBLISHED" : "WAITING FOR APPROVAL"} · {new Date(w.created_at).toLocaleString("en-IN")}</p>
              <p className="mt-2 font-display text-2xl">{w.wish}</p>
              {w.message && <p className="mt-1 text-ivory/80">{w.message}</p>}
              <p className="mt-2 text-sm text-ivory/60">— {w.name}</p>
              <div className="mt-4 flex gap-3 text-xs tracking-[0.18em]">
                {w.approved ? <button onClick={() => act(w.id, "unpublish")} className="rounded-full border border-champagne/50 px-4 py-2 text-champagne">UNPUBLISH</button>
                  : <button onClick={() => act(w.id, "approve")} className="rounded-full bg-champagne px-4 py-2 text-midnight">APPROVE</button>}
                <button onClick={() => confirm("Delete this message?") && act(w.id, "delete")} className="rounded-full border border-red-300/50 px-4 py-2 text-red-200">DELETE</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {err && <p role="alert" className="mt-4 text-red-300">{err}</p>}
    </main>
  );
}
