# StyleBy

An AI-powered digital closet and outfit recommendation web app. Upload
clothing, footwear, and accessories; backgrounds are removed automatically
in the browser; each item is enriched with vision-derived metadata
(category, color, pattern, style, occasion, weather); and StyleBy assembles
polished 4-piece outfits based on weather, occasion, and your style
preferences.

## Structure

- `frontend/` — React + Vite + TypeScript + Tailwind CSS. The landing page
  is pixel-matched to the Figma template; the app screens (closet, upload,
  item detail, outfit generator) extend the same visual language.
- `backend/` — Express + TypeScript. A thin proxy that forwards item photos
  to Google Gemini's vision API to extract closet metadata, keeping the API
  key server-side.
- `supabase/schema.sql` — optional Postgres schema (`closet_items`, `outfits`)
  for persisting the closet server-side instead of just in the browser.

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env   # add your GEMINI_API_KEY
npm install
npm run dev             # http://localhost:4000
```

Without a `GEMINI_API_KEY`, the app still works end to end — uploads,
background removal, and manual tagging all function — but `/api/tag-item`
returns an error and the Upload screen falls back to a manual metadata
form.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

Vite proxies `/api/*` requests to the backend, so both need to be running
for AI tagging to work.

**Optional — Supabase-backed storage:** without it, the closet lives in
`localStorage` only. To persist server-side, copy `frontend/.env.example` to
`frontend/.env`, add your `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, and
run `supabase/schema.sql` in your project's SQL editor.

## How it works

- **Background removal** — `@imgly/background-removal` runs a segmentation
  model fully client-side (WASM), so photos never leave the browser for
  this step.
- **Vision tagging** — the cutout is sent to the backend, which calls
  Gemini with a JSON-schema-constrained response to return structured
  metadata: category, color, pattern, style tags, occasions, and weather
  suitability. Users can edit any of it before saving.
- **Outfit generation** (`frontend/src/lib/outfitEngine.ts`) — scores
  closet items against the selected occasion, weather (manual, or live via
  Open-Meteo + geolocation — no API key required), and style preferences,
  then assembles a 4-piece outfit (top + bottom, or dress; footwear; and
  outerwear or an accessory depending on weather), favoring pieces that
  haven't been worn recently.
- **Storage** (`frontend/src/store/closetStore.ts`) — writes through to
  Supabase (`closet_items`, `outfits` tables) when `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY` are set; otherwise falls back to `localStorage`
  so the app still works with zero setup.

## Design source

The landing page matches the "Styleby Landing" Figma template. The app
screens (closet, upload, item detail, outfit generator) weren't in that
template yet — they're built in a matching visual language (cream/ink/tan
palette, Lora serif headings, Inter body/UI) so they read as one product.
Bring designs for those screens whenever they're ready and they can be
swapped in the same way the landing page was.
