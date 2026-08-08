import { Container } from '../ui/Container'
import { EditorialImage } from '../ui/EditorialImage'
import { stockPhotos } from '../../lib/stockPhotos'

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
        <EditorialImage
          src={stockPhotos.homeFeedToday}
          alt="A neatly organized walk-in closet with clothes and shoes sorted by category"
          className="min-h-[560px] w-full"
        />
        <div className="grid grid-rows-2 gap-6">
          <EditorialImage
            src={stockPhotos.capsuleOverview}
            alt="A neutral-toned capsule of coats and sweaters on a rack"
            className="min-h-[260px] w-full"
          />
          <EditorialImage
            src={stockPhotos.rediscoverPiece}
            alt="A pile of clothes on hangers waiting to be rediscovered"
            className="min-h-[260px] w-full"
          />
        </div>
      </div>
    </Container>
  )
}
