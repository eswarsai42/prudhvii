import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getAdminClient, notConfigured, rateLimited } from "@/lib/server";

export const dynamic = "force-dynamic";

function authorised(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const given = req.headers.get("x-admin-password") ?? "";
  if (!expected || !given) return false;
  const a = Buffer.from(given), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (rateLimited(req, "admin", 30)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  if (!authorised(req)) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  const db = getAdminClient(); if (!db) return notConfigured();
  const { data, error } = await db.from("wishes").select("*").order("approved", { ascending: true }).order("created_at", { ascending: false }).limit(300);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ wishes: data });
}

export async function POST(req: Request) {
  if (rateLimited(req, "admin", 60)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  if (!authorised(req)) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  const db = getAdminClient(); if (!db) return notConfigured();
  const { id, action } = (await req.json().catch(() => ({}))) as { id?: string; action?: string };
  if (!id || !["approve", "unpublish", "delete"].includes(action ?? "")) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const q = action === "delete" ? db.from("wishes").delete().eq("id", id) : db.from("wishes").update({ approved: action === "approve" }).eq("id", id);
  const { error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
