import { Container } from '../ui/Container'

const publications = ['The Wardrobe Post', 'Closet Weekly', 'Minimal Living', 'Threadline']

export function AsSeenIn() {
  return (
    <div className="border-y border-border/70">
      <Container className="flex flex-col items-center gap-6 py-8 md:flex-row md:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          As seen in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {publications.map((name) => (
            <span key={name} className="font-serif text-lg italic text-ink-soft">
              {name}
            </span>
          ))}
        </div>
      </Container>
    </div>
  )
}
