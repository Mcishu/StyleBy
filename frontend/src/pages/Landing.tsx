import { Navbar } from '../components/landing/Navbar'
import { Hero } from '../components/landing/Hero'
import { AsSeenIn } from '../components/landing/AsSeenIn'
import { HomeFeedSection } from '../components/landing/HomeFeedSection'
import { HowItWorks } from '../components/landing/HowItWorks'
import { Testimonial } from '../components/landing/Testimonial'
import { FinalCTA } from '../components/landing/FinalCTA'
import { Footer } from '../components/landing/Footer'

export function Landing() {
  return (
    <div className="bg-cream">
      <Navbar />
      <Hero />
      <AsSeenIn />
      <HomeFeedSection />
      <HowItWorks />
      <Testimonial />
      <FinalCTA />
      <Footer />
    </div>
  )
}
