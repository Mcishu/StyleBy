import { Link } from 'react-router-dom'
import type { ClosetItem } from '../../lib/types'

export function ItemCard({ item }: { item: ClosetItem }) {
  return (
    <Link
      to={`/app/item/${item.id}`}
      className="group block overflow-hidden rounded-2xl border border-border/70 bg-cream-soft transition-shadow hover:shadow-md"
    >
      <div className="flex aspect-square items-center justify-center bg-placeholder">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <span className="text-sm text-muted">No image</span>
        )}
      </div>
      <div className="p-3.5">
        <p className="truncate text-[15px] font-medium text-ink">{item.name}</p>
        <p className="mt-0.5 text-sm capitalize text-muted">
          {item.isTagging ? 'Tagging…' : `${item.category} · ${item.color}`}
        </p>
      </div>
    </Link>
  )
}
