import { NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validation";
import { getAdminClient, notConfigured, rateLimited } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (rateLimited(req, "rsvp")) return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid RSVP" }, { status: 400 });
  // Honeypot filled in: pretend success so bots learn nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const db = getAdminClient();
  if (!db) return notConfigured();
  const { name, phone, guests, events, message } = parsed.data;
  const { error } = await db.from("rsvps").insert({ name, phone, guests, events, message: message || null });
  if (error) {
    console.error("RSVP insert failed", error.message);
    return NextResponse.json({ error: "We couldn't save your RSVP. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
