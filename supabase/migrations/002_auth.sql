-- StyleBy — require login, scope closet data per account
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query),
-- AFTER supabase/schema.sql has already been run once.

-- Each row now belongs to the account that created it. DEFAULT auth.uid()
-- means the frontend doesn't need to set this explicitly on insert — it's
-- filled in automatically from the logged-in session making the request.
alter table closet_items add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table outfits add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();

-- Replace the old "anyone with the anon key" policies with per-owner ones.
drop policy if exists "closet_items: open access (pre-auth)" on closet_items;
drop policy if exists "outfits: open access (pre-auth)" on outfits;

create policy "closet_items: owner access" on closet_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "outfits: owner access" on outfits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Note: any closet_items/outfits rows created before this migration have no
-- user_id and become invisible under the new policies (no owner to match).
-- That's expected for pre-auth test data — nothing to migrate them to.
