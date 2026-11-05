# The Royal Wedding Experience — Tallam Prudhvi & Padmanabhuni Harshitha
Designed & developed by VEERLABS (https://veerlabs.vercel.app)

## Run
    npm install
    cp .env.example .env.local   # fill in values
    npm run dev                  # http://localhost:3000

## Supabase (RSVP + guestbook)
1. Create a project, run `supabase/schema.sql` in the SQL editor (RLS on, no public policies).
2. Put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` / Vercel env vars. They are only read in `/api/*` routes, never sent to the browser.
3. Set `ADMIN_PASSWORD`, then open `/admin` to approve, unpublish or delete guestbook wishes. RSVPs appear in the `rsvps` table.

## Where to edit
- `src/lib/events.ts` — all 11 events. Set `year` once confirmed (null = no year shown, no countdown/"Completed" badge). Feb 20 events are 2027; Engagement is 2026.
- `src/lib/wedding.ts` — names, countdown target (Grand Wedding 10:00 PM IST), story copy, hotels / travel / contacts (empty until confirmed).
- `src/lib/gallery.ts` — photos per collection. Five supplied photos are low-res (flagged `lowRes`).
- `public/veerlabs-logo.svg` — placeholder mark; replace with the real VeerLabs logo.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` enables WhatsApp confirmation; `NEXT_PUBLIC_MUSIC_URL` swaps the generated ambient music for an mp3.

## Deploy
Push to GitHub, import in Vercel, add the env vars. Fonts load from Google Fonts at runtime.
