import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

export function FinalCTA() {
  return (
    <div className="bg-beige">
      <Container className="flex flex-col items-center py-20 text-center md:py-24">
        <h2 className="max-w-xl font-serif text-4xl leading-tight text-ink sm:text-[42px]">
          Ready to meet the closet you already own?
        </h2>
        <p className="mt-5 text-[17px] text-body">
          Free to start. No credit card, no shopping list required.
        </p>
        <Link to="/login?signup=1" className="mt-9">
          <Button>Get started free</Button>
        </Link>
      </Container>
    </div>
  )
}
