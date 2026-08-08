import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppNavbar } from '../components/app/AppNavbar'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { useClosetStore } from '../store/closetStore'

export function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = useClosetStore((s) => s.items.find((it) => it.id === id))
  const removeItem = useClosetStore((s) => s.removeItem)

  if (!item) {
    return (
      <div className="min-h-screen bg-cream">
        <AppNavbar />
        <Container className="py-16 text-center">
          <p className="text-[15px] text-body">This piece isn't in your closet.</p>
          <Link to="/app" className="mt-4 inline-block">
            <Button variant="outline">Back to closet</Button>
          </Link>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <AppNavbar />
      <Container className="max-w-4xl py-12">
        <Link to="/app" className="text-sm text-ink-soft hover:text-ink">
          ← Back to closet
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-border/70 bg-placeholder">
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain p-6" />
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent capitalize">
              {item.category}
            </p>
            <h1 className="mt-2 font-serif text-3xl text-ink">{item.name}</h1>

            <dl className="mt-6 space-y-3 text-[15px]">
              <Row label="Color" value={item.color} />
              <Row label="Pattern" value={item.pattern} />
              <Row label="Style" value={item.styleTags.join(', ') || '—'} />
              <Row label="Occasions" value={item.occasions.join(', ') || '—'} />
              <Row label="Weather" value={item.warmth.join(', ') || '—'} />
              <Row label="Times worn" value={String(item.timesWorn)} />
            </dl>

            <div className="mt-8 flex gap-3">
              <Link to="/app/outfit">
                <Button>Build an outfit</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  removeItem(item.id)
                  navigate('/app')
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-2.5 capitalize">
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink-soft">{value}</dd>
    </div>
  )
}
