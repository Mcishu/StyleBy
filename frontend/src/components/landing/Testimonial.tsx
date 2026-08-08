import { Container } from '../ui/Container'
import { EditorialImage } from '../ui/EditorialImage'
import { stockPhotos } from '../../lib/stockPhotos'

export function Testimonial() {
  return (
    <Container className="py-20 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-serif text-2xl italic leading-relaxed text-ink sm:text-[28px]">
          "I went from a closet I couldn't close to eleven pieces I actually
          reach for. Getting dressed stopped being a decision I dreaded."
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <EditorialImage
            src={stockPhotos.testimonialAvatar}
            alt="Renata Osei"
            rounded
            className="h-14 w-14 shrink-0"
          />
          <div className="text-left">
            <p className="text-[15px] font-semibold text-ink">Renata Osei</p>
            <p className="text-sm text-muted">Styleby member since 2025</p>
          </div>
        </div>
      </div>
    </Container>
  )
}
