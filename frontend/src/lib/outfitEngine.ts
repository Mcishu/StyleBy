import type { ClosetItem, Occasion, WeatherTag } from './types'

export interface OutfitRequest {
  occasion: Occasion
  weather: WeatherTag
  preferredStyles?: string[]
}

function score(item: ClosetItem, req: OutfitRequest): number {
  let s = 0
  if (item.occasions.includes(req.occasion)) s += 4
  if (item.warmth.includes(req.weather)) s += 3
  if (req.preferredStyles?.length) {
    s += item.styleTags.filter((tag) => req.preferredStyles!.includes(tag)).length * 2
  }
  // Favor pieces that haven't been worn recently, so recommendations rotate the closet.
  s -= Math.min(item.timesWorn, 5) * 0.4
  // Small random jitter so ties don't always resolve the same way.
  s += Math.random() * 0.5
  return s
}

function best(items: ClosetItem[], req: OutfitRequest, exclude: Set<string>): ClosetItem | null {
  const candidates = items.filter((it) => !exclude.has(it.id))
  if (candidates.length === 0) return null
  return candidates.reduce((top, it) => (score(it, req) > score(top, req) ? it : top))
}

/**
 * Assembles a 4-piece outfit (top+bottom, or dress, plus footwear and a
 * fourth piece — outerwear in cold weather, otherwise an accessory) scored
 * against occasion, weather, and the user's style preferences.
 */
export function generateOutfit(items: ClosetItem[], req: OutfitRequest): ClosetItem[] {
  const byCategory = (cat: ClosetItem['category']) => items.filter((it) => it.category === cat)
  const used = new Set<string>()
  const outfit: ClosetItem[] = []

  const wantsDress = byCategory('dress').length > 0 && Math.random() < 0.35
  const wantsOuterwear = req.weather === 'cold' || req.weather === 'rainy'

  if (wantsDress) {
    const dress = best(byCategory('dress'), req, used)
    if (dress) {
      outfit.push(dress)
      used.add(dress.id)
    }
  } else {
    const top = best(byCategory('top'), req, used)
    if (top) {
      outfit.push(top)
      used.add(top.id)
    }
    const bottom = best(byCategory('bottom'), req, used)
    if (bottom) {
      outfit.push(bottom)
      used.add(bottom.id)
    }
  }

  const footwear = best(byCategory('footwear'), req, used)
  if (footwear) {
    outfit.push(footwear)
    used.add(footwear.id)
  }

  const fourthPool = wantsOuterwear && byCategory('outerwear').length > 0
    ? byCategory('outerwear')
    : byCategory('accessory')
  const fourth = best(fourthPool, req, used)
  if (fourth) {
    outfit.push(fourth)
    used.add(fourth.id)
  }

  // Backfill up to 4 pieces from whatever categories remain, if the closet is sparse.
  while (outfit.length < 4) {
    const filler = best(items, req, used)
    if (!filler) break
    outfit.push(filler)
    used.add(filler.id)
  }

  return outfit
}
