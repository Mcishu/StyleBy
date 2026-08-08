-- StyleBy — closet items & outfits
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create extension if not exists "pgcrypto";

create table if not exists closet_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('top', 'bottom', 'outerwear', 'dress', 'footwear', 'accessory')),
  color text not null default '',
  pattern text not null default '',
  style_tags text[] not null default '{}',
  occasions text[] not null default '{}',
  warmth text[] not null default '{}',
  image_url text not null,
  original_image_url text,
  times_worn integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists outfits (
  id uuid primary key default gen_random_uuid(),
  item_ids uuid[] not null,
  occasion text not null,
  weather text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security is on by default for new Supabase projects. There's no
-- auth in StyleBy yet, so these policies leave both tables open to anyone
-- holding the anon key (i.e. anyone loading the app). That's fine for a
-- single-user prototype. Once you add Supabase Auth, replace these with
-- policies scoped to `auth.uid() = user_id` (and add a user_id column).
alter table closet_items enable row level security;
alter table outfits enable row level security;

create policy "closet_items: open access (pre-auth)" on closet_items
  for all using (true) with check (true);

create policy "outfits: open access (pre-auth)" on outfits
  for all using (true) with check (true);
