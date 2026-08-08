import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

const links = [
  { label: 'Home', href: '#' },
  { label: 'Capsules', href: '#capsules' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
]

export function Navbar() {
  return (
    <header className="border-b border-border/70">
      <Container className="flex items-center justify-between py-6">
        <Link to="/" className="font-serif text-2xl italic text-ink">
          Styleby
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[15px] text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="hidden text-[15px] text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            Log in
          </Link>
          <Link to="/login?signup=1">
            <Button>Get started</Button>
          </Link>
        </div>
      </Container>
    </header>
  )
}
