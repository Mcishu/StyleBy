import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabaseClient'
import type { ClosetItem, Outfit } from '../lib/types'

type NewItem = Omit<ClosetItem, 'id' | 'createdAt'>
type NewOutfit = Omit<Outfit, 'id' | 'createdAt'>

interface ClosetState {
  items: ClosetItem[]
  outfits: Outfit[]
  loading: boolean
  error: string | null
  fetchAll: () => Promise<void>
  addItem: (item: NewItem) => Promise<ClosetItem>
  updateItem: (id: string, patch: Partial<ClosetItem>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  addOutfit: (outfit: NewOutfit) => Promise<void>
  incrementWorn: (itemIds: string[]) => Promise<void>
}

// --- Supabase <-> app-model mapping -----------------------------------

interface ClosetItemRow {
  id: string
  name: string
  category: ClosetItem['category']
  color: string
  pattern: string
  style_tags: string[]
  occasions: ClosetItem['occasions']
  warmth: ClosetItem['warmth']
  image_url: string
  original_image_url: string | null
  times_worn: number
  created_at: string
}

function rowToItem(row: ClosetItemRow): ClosetItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    color: row.color,
    pattern: row.pattern,
    styleTags: row.style_tags,
    occasions: row.occasions,
    warmth: row.warmth,
    imageUrl: row.image_url,
    originalImageUrl: row.original_image_url ?? undefined,
    timesWorn: row.times_worn,
    createdAt: row.created_at,
  }
}

function itemToRow(item: NewItem) {
  return {
    name: item.name,
    category: item.category,
    color: item.color,
    pattern: item.pattern,
    style_tags: item.styleTags,
    occasions: item.occasions,
    warmth: item.warmth,
    image_url: item.imageUrl,
    original_image_url: item.originalImageUrl ?? null,
    times_worn: item.timesWorn,
  }
}

/** Maps only the keys actually present in a partial update, so unset fields are left untouched in Supabase. */
function itemPatchToRow(patch: Partial<ClosetItem>) {
  const row: Record<string, unknown> = {}
  if (patch.name !== undefined) row.name = patch.name
  if (patch.category !== undefined) row.category = patch.category
  if (patch.color !== undefined) row.color = patch.color
  if (patch.pattern !== undefined) row.pattern = patch.pattern
  if (patch.styleTags !== undefined) row.style_tags = patch.styleTags
  if (patch.occasions !== undefined) row.occasions = patch.occasions
  if (patch.warmth !== undefined) row.warmth = patch.warmth
  if (patch.imageUrl !== undefined) row.image_url = patch.imageUrl
  if (patch.originalImageUrl !== undefined) row.original_image_url = patch.originalImageUrl
  if (patch.timesWorn !== undefined) row.times_worn = patch.timesWorn
  return row
}

interface OutfitRow {
  id: string
  item_ids: string[]
  occasion: Outfit['occasion']
  weather: Outfit['weather']
  created_at: string
}

function rowToOutfit(row: OutfitRow): Outfit {
  return {
    id: row.id,
    itemIds: row.item_ids,
    occasion: row.occasion,
    weather: row.weather,
    createdAt: row.created_at,
  }
}

// --- Store ---------------------------------------------------------------

export const useClosetStore = create<ClosetState>()(
  persist(
    (set, get) => ({
      items: [],
      outfits: [],
      loading: false,
      error: null,

      fetchAll: async () => {
        if (!supabase) return
        set({ loading: true, error: null })
        const [itemsRes, outfitsRes] = await Promise.all([
          supabase.from('closet_items').select('*').order('created_at', { ascending: false }),
          supabase.from('outfits').select('*').order('created_at', { ascending: false }),
        ])
        if (itemsRes.error || outfitsRes.error) {
          set({ loading: false, error: (itemsRes.error ?? outfitsRes.error)!.message })
          return
        }
        set({
          items: (itemsRes.data as ClosetItemRow[]).map(rowToItem),
          outfits: (outfitsRes.data as OutfitRow[]).map(rowToOutfit),
          loading: false,
        })
      },

      addItem: async (item) => {
        if (supabase) {
          const { data, error } = await supabase
            .from('closet_items')
            .insert(itemToRow(item))
            .select()
            .single()
          if (error) throw error
          const saved = rowToItem(data as ClosetItemRow)
          set((state) => ({ items: [saved, ...state.items] }))
          return saved
        }
        const saved: ClosetItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
        set((state) => ({ items: [saved, ...state.items] }))
        return saved
      },

      updateItem: async (id, patch) => {
        if (supabase) {
          const { error } = await supabase.from('closet_items').update(itemPatchToRow(patch)).eq('id', id)
          if (error) throw error
        }
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
        }))
      },

      removeItem: async (id) => {
        if (supabase) {
          const { error } = await supabase.from('closet_items').delete().eq('id', id)
          if (error) throw error
        }
        set((state) => ({ items: state.items.filter((it) => it.id !== id) }))
      },

      addOutfit: async (outfit) => {
        if (supabase) {
          const { data, error } = await supabase
            .from('outfits')
            .insert({ item_ids: outfit.itemIds, occasion: outfit.occasion, weather: outfit.weather })
            .select()
            .single()
          if (error) throw error
          const saved = rowToOutfit(data as OutfitRow)
          set((state) => ({ outfits: [saved, ...state.outfits] }))
          return
        }
        const saved: Outfit = { ...outfit, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
        set((state) => ({ outfits: [saved, ...state.outfits] }))
      },

      incrementWorn: async (itemIds) => {
        const { items } = get()
        const updates = items
          .filter((it) => itemIds.includes(it.id))
          .map((it) => ({ id: it.id, timesWorn: it.timesWorn + 1 }))

        if (supabase) {
          const client = supabase
          await Promise.all(
            updates.map(({ id, timesWorn }) =>
              client.from('closet_items').update({ times_worn: timesWorn }).eq('id', id),
            ),
          )
        }
        set((state) => ({
          items: state.items.map((it) =>
            itemIds.includes(it.id) ? { ...it, timesWorn: it.timesWorn + 1 } : it,
          ),
        }))
      },
    }),
    {
      name: 'styleby-closet',
      // Supabase (when configured) is the source of truth; localStorage is
      // just an offline cache/fallback, refreshed by fetchAll() on load.
      partialize: (state) => ({ items: state.items, outfits: state.outfits }),
    },
  ),
)

if (supabase) {
  useClosetStore.getState().fetchAll()
}
