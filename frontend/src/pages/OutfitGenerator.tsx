import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppNavbar } from '../components/app/AppNavbar'
import { ItemCard } from '../components/app/ItemCard'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { fetchLiveWeather } from '../lib/api'
import { generateOutfit } from '../lib/outfitEngine'
import type { ClosetItem, Occasion, WeatherTag } from '../lib/types'
import { useClosetStore } from '../store/closetStore'

const occasionOptions: Occasion[] = ['casual', 'work', 'formal', 'active', 'evening']
const weatherOptions: WeatherTag[] = ['cold', 'mild', 'warm', 'hot', 'rainy']

export function OutfitGenerator() {
  const items = useClosetStore((s) => s.items)
  const addOutfit = useClosetStore((s) => s.addOutfit)
  const incrementWorn = useClosetStore((s) => s.incrementWorn)

  const [occasion, setOccasion] = useState<Occasion>('casual')
  const [weather, setWeather] = useState<WeatherTag>('mild')
  const [weatherStatus, setWeatherStatus] = useState<string | null>(null)
  const [result, setResult] = useState<ClosetItem[] | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const styleTags = useMemo(
    () => Array.from(new Set(items.flatMap((it) => it.styleTags))).slice(0, 10),
    [items],
  )
  const [preferredStyles, setPreferredStyles] = useState<Set<string>>(new Set())

  function toggleStyle(tag: string) {
    const next = new Set(preferredStyles)
    next.has(tag) ? next.delete(tag) : next.add(tag)
    setPreferredStyles(next)
  }

  function handleGenerate() {
    setSaved(false)
    setResult(
      generateOutfit(items, {
        occasion,
        weather,
        preferredStyles: Array.from(preferredStyles),
      }),
    )
  }

  async function handleUseLocation() {
    setWeatherStatus('Locating…')
    if (!navigator.geolocation) {
      setWeatherStatus('Geolocation not supported by this browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          setWeatherStatus('Checking the weather…')
          const live = await fetchLiveWeather(coords.latitude, coords.longitude)
          setWeather(live.tag)
          setWeatherStatus(`It's about ${Math.round(live.temperatureC)}°C — set to "${live.tag}".`)
        } catch {
          setWeatherStatus('Could not fetch live weather — pick manually.')
        }
      },
      () => setWeatherStatus('Location permission denied — pick manually.'),
    )
  }

  async function handleWearThis() {
    if (!result) return
    setSaving(true)
    try {
      await addOutfit({ itemIds: result.map((it) => it.id), occasion, weather })
      await incrementWorn(result.map((it) => it.id))
      setSaved(true)
    } catch (err) {
      setWeatherStatus(`Couldn't save this outfit: ${(err as Error).message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <AppNavbar />
      <Container className="py-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
          Outfit generator
        </p>
        <h1 className="mt-2 max-w-lg font-serif text-3xl text-ink">
          A 4-piece outfit, built from what you already own.
        </h1>

        {items.length < 2 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-placeholder py-16 text-center">
            <p className="text-[15px] text-body">
              Add a few more pieces to your closet before generating outfits.
            </p>
            <Link to="/app/upload" className="mt-4 inline-block">
              <Button>Upload a piece</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">Occasion</p>
                <div className="flex flex-wrap gap-2">
                  {occasionOptions.map((o) => (
                    <Chip key={o} label={o} active={occasion === o} onClick={() => setOccasion(o)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-soft">Weather</p>
                  <button
                    onClick={handleUseLocation}
                    className="text-xs font-medium text-accent hover:text-ink"
                  >
                    Use my location
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {weatherOptions.map((w) => (
                    <Chip key={w} label={w} active={weather === w} onClick={() => setWeather(w)} />
                  ))}
                </div>
                {weatherStatus && <p className="mt-2 text-xs text-muted">{weatherStatus}</p>}
              </div>
            </div>

            {styleTags.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-ink-soft">Style (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {styleTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      active={preferredStyles.has(tag)}
                      onClick={() => toggleStyle(tag)}
                    />
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleGenerate} className="mt-8">
              {result ? 'Regenerate outfit' : 'Generate outfit'}
            </Button>

            {result && (
              <div className="mt-10">
                {result.length < 4 && (
                  <p className="mb-4 text-sm text-muted">
                    Your closet doesn't have enough pieces yet for a full 4-piece
                    outfit — add more to round this out.
                  </p>
                )}
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {result.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <Button onClick={handleWearThis} disabled={saved || saving}>
                    {saved ? 'Saved to outfit history ✓' : saving ? 'Saving…' : 'Wear this today'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${
        active ? 'border-ink bg-ink text-cream' : 'border-border text-ink-soft hover:border-ink'
      }`}
    >
      {label}
    </button>
  )
}
