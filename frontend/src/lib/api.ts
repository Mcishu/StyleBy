import type { ClothingCategory, Occasion, WeatherTag } from './types'

export interface TaggedMetadata {
  name: string
  category: ClothingCategory
  color: string
  pattern: string
  styleTags: string[]
  occasions: Occasion[]
  warmth: WeatherTag[]
}

/**
 * Sends a background-removed item photo to the backend, which forwards it to
 * Claude's vision API and returns structured closet metadata.
 */
export async function tagItemImage(imageDataUrl: string): Promise<TaggedMetadata> {
  const res = await fetch('/api/tag-item', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageDataUrl }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Tagging failed (${res.status})`)
  }

  return res.json()
}

export interface LiveWeather {
  temperatureC: number
  tag: WeatherTag
}

function weatherTagFromTemp(tempC: number, precipitation: number): WeatherTag {
  if (precipitation > 0.5) return 'rainy'
  if (tempC <= 8) return 'cold'
  if (tempC <= 18) return 'mild'
  if (tempC <= 27) return 'warm'
  return 'hot'
}

/**
 * Fetches current conditions from Open-Meteo (no API key required) for the
 * given coordinates and maps them to StyleBy's weather tags.
 */
export async function fetchLiveWeather(lat: number, lon: number): Promise<LiveWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Could not fetch weather')
  const data = await res.json()
  const temperatureC = data.current.temperature_2m as number
  const precipitation = data.current.precipitation as number
  return { temperatureC, tag: weatherTagFromTemp(temperatureC, precipitation) }
}
