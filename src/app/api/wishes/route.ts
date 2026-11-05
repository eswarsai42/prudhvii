import { NextResponse } from "next/server";
import { wishSchema } from "@/lib/validation";
import { getAdminClient, notConfigured, rateLimited } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getAdminClient();
  if (!db) return notConfigured();
  const { data, error } = await db.from("wishes").select("id,name,wish,message,created_at").eq("approved", true).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: "Could not load blessings." }, { status: 500 });
  return NextResponse.json({ wishes: data });
}

export async function POST(req: Request) {
  if (rateLimited(req, "wish", 4)) return NextResponse.json({ error: "Too many messages. Please wait a few minutes and try again." }, { status: 429 });
  const parsed = wishSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid message" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  const db = getAdminClient();
  if (!db) return notConfigured();
  const { name, wish, message } = parsed.data;
  const { error } = await db.from("wishes").insert({ name, wish, message: message || null, approved: false });
  if (error) { console.error("Wish insert failed", error.message); return NextResponse.json({ error: "We couldn't save your message. Please try again." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
