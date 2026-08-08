import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { EditorialImage } from '../ui/EditorialImage'
import { stockPhotos } from '../../lib/stockPhotos'

const stats = [
  { value: '40k+', label: 'closets\nstyled' },
  { value: '3x', label: 'more outfit\ncombos' },
  { value: '4.8★', label: 'app store\nrating' },
]

export function Hero() {
  return (
    <Container className="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 md:py-24">
      <div className="flex flex-col items-start">
        <p className="mb-6 max-w-xs text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
          Build a wardrobe you actually wear
        </p>

        <h1 className="font-serif text-5xl leading-[1.08] text-ink sm:text-6xl">
          Fewer clothes.
          <br />
          More outfits
          <br />
          you love.
        </h1>

        <p className="mt-7 max-w-md text-[17px] leading-relaxed text-body">
          Styleby turns the pile of clothes you already own into a curated
          capsule closet — so getting dressed is never a 20-minute
          negotiation with your closet again.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Link to="/app">
            <Button className="px-7 py-4 text-center leading-snug">
              Start your
              <br />
              capsule
            </Button>
          </Link>
          <a
            href="#how-it-works"
            className="text-[15px] font-medium text-ink hover:text-accent"
          >
            See how it works →
          </a>
        </div>

        <div className="mt-14 flex gap-10">
          {stats.map((stat) => (
            <div key={stat.value}>
              <p className="font-serif text-3xl text-ink">{stat.value}</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-snug text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <EditorialImage
        src={stockPhotos.heroProductShot}
        alt="A neatly styled capsule wardrobe hanging on a wooden rack"
        className="min-h-[420px] w-full"
        eager
      />
    </Container>
  )
}
