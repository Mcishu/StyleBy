export type ClothingCategory =
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'dress'
  | 'footwear'
  | 'accessory'

export type Occasion = 'casual' | 'work' | 'formal' | 'active' | 'evening'

export type WeatherTag = 'cold' | 'mild' | 'warm' | 'hot' | 'rainy'

export interface ClosetItem {
  id: string
  /** Background-removed image, stored as a data URL. */
  imageUrl: string
  /** Original upload, kept for re-processing. */
  originalImageUrl?: string
  name: string
  category: ClothingCategory
  color: string
  pattern: string
  styleTags: string[]
  occasions: Occasion[]
  warmth: WeatherTag[]
  timesWorn: number
  createdAt: string
  /** true while metadata is still being fetched from the vision API. */
  isTagging?: boolean
}

export interface Outfit {
  id: string
  itemIds: string[]
  occasion: Occasion
  weather: WeatherTag
  createdAt: string
}

export interface StylePreferences {
  favoriteColors: string[]
  preferredStyles: string[]
}
