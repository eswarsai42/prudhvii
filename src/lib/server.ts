import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

let client: SupabaseClient | null = null;
/** Server-only. Returns null when Supabase is not configured. */
export function getAdminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}

const hits = new Map<string, number[]>();
/** Small in-memory limiter (per server instance). Enough to slow down casual abuse. */
export function rateLimited(req: Request, bucket: string, max = 5, windowMs = 10 * 60 * 1000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export const notConfigured = () =>
  NextResponse.json({ error: "The guest list is not connected yet. Please try again soon." }, { status: 503 });
