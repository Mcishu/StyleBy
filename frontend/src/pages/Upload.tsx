import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppNavbar } from '../components/app/AppNavbar'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { removeImageBackground, fileToDataUrl } from '../lib/backgroundRemoval'
import { tagItemImage } from '../lib/api'
import { useClosetStore } from '../store/closetStore'
import type {
  ClothingCategory,
  ClosetItem,
  Occasion,
  WeatherTag,
} from '../lib/types'

type Stage = 'idle' | 'removing-bg' | 'tagging' | 'ready' | 'error'

const categories: ClothingCategory[] = ['top', 'bottom', 'outerwear', 'dress', 'footwear', 'accessory']
const occasionOptions: Occasion[] = ['casual', 'work', 'formal', 'active', 'evening']
const weatherOptions: WeatherTag[] = ['cold', 'mild', 'warm', 'hot', 'rainy']

export function Upload() {
  const navigate = useNavigate()
  const addItem = useClosetStore((s) => s.addItem)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stage, setStage] = useState<Stage>('idle')
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<ClothingCategory>('top')
  const [color, setColor] = useState('')
  const [pattern, setPattern] = useState('solid')
  const [styleTags, setStyleTags] = useState('')
  const [occasions, setOccasions] = useState<Set<Occasion>>(new Set(['casual']))
  const [warmth, setWarmth] = useState<Set<WeatherTag>>(new Set(['mild']))
  const [saving, setSaving] = useState(false)

  async function handleFile(file: File) {
    setErrorMessage(null)
    setOriginalPreview(await fileToDataUrl(file))
    setStage('removing-bg')

    let cutout: string
    try {
      cutout = await removeImageBackground(file)
    } catch {
      cutout = await fileToDataUrl(file)
    }
    setProcessedImage(cutout)

    setStage('tagging')
    try {
      const meta = await tagItemImage(cutout)
      setName(meta.name)
      setCategory(meta.category)
      setColor(meta.color)
      setPattern(meta.pattern)
      setStyleTags(meta.styleTags.join(', '))
      setOccasions(new Set(meta.occasions))
      setWarmth(new Set(meta.warmth))
      setStage('ready')
    } catch (err) {
      setErrorMessage(
        (err as Error).message.includes('fetch')
          ? "AI tagging isn't available right now — fill in the details manually below."
          : (err as Error).message,
      )
      setStage('ready')
    }
  }

  function toggle<T>(set: Set<T>, value: T, setter: (s: Set<T>) => void) {
    const next = new Set(set)
    next.has(value) ? next.delete(value) : next.add(value)
    setter(next)
  }

  async function handleSave() {
    if (!processedImage) return
    setSaving(true)
    setErrorMessage(null)
    const newItem: Omit<ClosetItem, 'id' | 'createdAt'> = {
      imageUrl: processedImage,
      originalImageUrl: originalPreview ?? undefined,
      name: name || 'Untitled piece',
      category,
      color: color || 'unknown',
      pattern,
      styleTags: styleTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      occasions: Array.from(occasions),
      warmth: Array.from(warmth),
      timesWorn: 0,
    }
    try {
      const saved = await addItem(newItem)
      navigate(`/app/item/${saved.id}`)
    } catch (err) {
      setSaving(false)
      setErrorMessage(`Couldn't save this piece: ${(err as Error).message}`)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <AppNavbar />
      <Container className="max-w-3xl py-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
          Add a piece
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink">
          Upload a clothing item, shoe, or accessory
        </h1>

        {stage === 'idle' && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-8 flex min-h-[320px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-placeholder text-center transition-colors hover:border-accent"
          >
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <p className="text-[15px] font-medium text-ink-soft">
              Drop a photo here, or click to browse files
            </p>
            <p className="text-sm text-muted">
              Backgrounds are removed automatically, right in your browser.
            </p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        {stage !== 'idle' && (
          <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-border/70 bg-placeholder">
              {processedImage ? (
                <img src={processedImage} alt="Processed item" className="h-full w-full object-contain p-4" />
              ) : originalPreview ? (
                <img src={originalPreview} alt="Original upload" className="h-full w-full object-contain p-4 opacity-60" />
              ) : null}
            </div>

            <div>
              {stage === 'removing-bg' && (
                <StatusLine text="Removing background…" />
              )}
              {stage === 'tagging' && <StatusLine text="Analyzing with AI…" />}
              {errorMessage && (
                <p className="mb-4 rounded-lg bg-beige px-4 py-3 text-sm text-ink-soft">
                  {errorMessage}
                </p>
              )}

              {stage === 'ready' && (
                <div className="space-y-5">
                  <Field label="Name">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      placeholder="e.g. Ivory linen shirt"
                    />
                  </Field>

                  <Field label="Category">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                      className="input capitalize"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="capitalize">
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Color">
                      <input value={color} onChange={(e) => setColor(e.target.value)} className="input" />
                    </Field>
                    <Field label="Pattern">
                      <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="input" />
                    </Field>
                  </div>

                  <Field label="Style tags (comma separated)">
                    <input
                      value={styleTags}
                      onChange={(e) => setStyleTags(e.target.value)}
                      className="input"
                      placeholder="minimal, classic, boho"
                    />
                  </Field>

                  <Field label="Occasions">
                    <div className="flex flex-wrap gap-2">
                      {occasionOptions.map((o) => (
                        <Chip
                          key={o}
                          label={o}
                          active={occasions.has(o)}
                          onClick={() => toggle(occasions, o, setOccasions)}
                        />
                      ))}
                    </div>
                  </Field>

                  <Field label="Weather suitability">
                    <div className="flex flex-wrap gap-2">
                      {weatherOptions.map((w) => (
                        <Chip
                          key={w}
                          label={w}
                          active={warmth.has(w)}
                          onClick={() => toggle(warmth, w, setWarmth)}
                        />
                      ))}
                    </div>
                  </Field>

                  <Button onClick={handleSave} disabled={saving} className="mt-2 w-full">
                    {saving ? 'Saving…' : 'Save to closet'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

function StatusLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-[15px] text-ink-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      {text}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${
        active
          ? 'border-ink bg-ink text-cream'
          : 'border-border text-ink-soft hover:border-ink'
      }`}
    >
      {label}
    </button>
  )
}
