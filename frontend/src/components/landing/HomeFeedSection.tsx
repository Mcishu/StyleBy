import { Container } from '../ui/Container'
import { Placeholder } from '../ui/Placeholder'

export function HomeFeedSection() {
  return (
    <Container className="py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
          Your home feed
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-[42px]">
          One feed. Everything you already own, made new again.
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-body">
          Open Styleby to a daily outfit built entirely from your closet, a
          running capsule of your most-worn pieces, and gentle nudges toward
          what you haven't touched in a while.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-[1.6fr_1fr]">
        <Placeholder label="App screen — home feed, today's outfit" className="min-h-[560px]" />
        <div className="grid grid-rows-2 gap-6">
          <Placeholder label="App screen — capsule overview" className="min-h-[260px]" />
          <Placeholder label="App screen — rediscover a piece" className="min-h-[260px]" />
        </div>
      </div>
    </Container>
  )
}
