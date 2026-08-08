import { Container } from '../ui/Container'

const steps = [
  {
    number: '01',
    title: 'Photograph your closet',
    body: 'Snap what you own in minutes. Styleby sorts it by category, color, and how often you actually wear it.',
  },
  {
    number: '02',
    title: 'Get your capsule',
    body: 'We build a tight, versatile capsule from pieces you already have — no shopping required to start.',
  },
  {
    number: '03',
    title: "Wear it, don't think about it",
    body: 'Every morning, Styleby hands you an outfit already put together from your capsule.',
  },
]

export function HowItWorks() {
  return (
    <div id="how-it-works" className="bg-ink text-cream">
      <Container className="py-20 md:py-24">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-soft">
          How it works
        </p>
        <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-cream sm:text-[42px]">
          From overflowing closet to capsule in three steps.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <p className="font-serif text-2xl italic text-accent-soft">{step.number}</p>
              <h3 className="mt-4 text-lg font-semibold text-cream">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/60">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
