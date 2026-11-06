# The Royal Wedding Experience — Tallam Prudhvi & Padmanabhuni Harshitha
Designed & developed by VEERLABS (https://veerlabs.vercel.app)

## Run
    npm install
    cp .env.example .env.local   # fill in values
    npm run dev                  # http://localhost:3000

## Wedding Time Capsule (blessings by email)
Follow `emailjs/SETUP.md`: create an EmailJS service + template (HTML in `emailjs/blessing-template.html`, recipient fixed in the template) and set the three `NEXT_PUBLIC_EMAILJS_*` variables.

## Public guestbook wall (optional, Supabase)
The older "Leave your blessings" wall still uses Supabase. Run `supabase/schema.sql`, set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`; moderate at `/admin`. Skip it and the wall simply shows a friendly "not available" note.

## Music
Put your mp3 in `public/audio/` and set `NEXT_PUBLIC_MUSIC_URL=/audio/your-file.mp3`. Without it a soft generated pad plays.

## Where to edit
- `src/lib/events.ts` — all 11 events. Set `year` once confirmed (null = no year shown, no countdown/"Completed" badge). Feb 20 events are 2027; Engagement is 2026.
- `src/lib/wedding.ts` — names, countdown target (Grand Wedding 10:00 PM IST), story copy, hotels / travel / contacts (empty until confirmed).
- `src/lib/timeline.ts` — photo beside each event card (files in `public/images/timeline/`).
- `src/lib/gallery.ts` — photos per collection. Five supplied photos are low-res (flagged `lowRes`).
- `public/veerlabs-logo.svg` — placeholder mark; replace with the real VeerLabs logo.

## Deploy
Push to GitHub, import in Vercel, add the env vars. Fonts load from Google Fonts at runtime.
