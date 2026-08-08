import { Link } from 'react-router-dom'
import { AppNavbar } from '../components/app/AppNavbar'
import { ItemCard } from '../components/app/ItemCard'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { useClosetStore } from '../store/closetStore'

const categories = ['top', 'bottom', 'outerwear', 'dress', 'footwear', 'accessory'] as const

export function Closet() {
  const items = useClosetStore((s) => s.items)

  return (
    <div className="min-h-screen bg-cream">
      <AppNavbar />
      <Container className="py-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
              Your closet
            </p>
            <h1 className="mt-2 font-serif text-3xl text-ink">
              {items.length} {items.length === 1 ? 'piece' : 'pieces'} in your capsule
            </h1>
          </div>
          <Link to="/app/upload">
            <Button>Add a piece</Button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-placeholder py-24 text-center">
            <p className="font-serif text-2xl text-ink">Your closet is empty</p>
            <p className="max-w-sm text-[15px] text-body">
              Upload a photo of a clothing item, shoe, or accessory to start
              building your capsule.
            </p>
            <Link to="/app/upload" className="mt-2">
              <Button>Upload your first piece</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {categories.map((cat) => {
              const inCategory = items.filter((it) => it.category === cat)
              if (inCategory.length === 0) return null
              return (
                <div key={cat}>
                  <h2 className="text-lg font-semibold capitalize text-ink">
                    {cat === 'outerwear' ? 'Outerwear' : `${cat}s`}
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                    {inCategory.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Container>
    </div>
  )
}
