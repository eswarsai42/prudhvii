-- Run in Supabase SQL editor.
create extension if not exists "pgcrypto";

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  wish text not null check (char_length(wish) between 2 and 160),
  message text check (char_length(message) <= 600),
  approved boolean not null default false
);

-- Lock both tables down: the browser never talks to Supabase directly.
-- Only the server routes (service role key) can read/write.
alter table public.wishes enable row level security;
-- (No policies on purpose: anon/authenticated roles get no access.)

create index if not exists wishes_approved_created on public.wishes (approved, created_at desc);
