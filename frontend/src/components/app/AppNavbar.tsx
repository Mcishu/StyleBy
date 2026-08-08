import { NavLink, Link } from 'react-router-dom'
import { Container } from '../ui/Container'

const links = [
  { label: 'Closet', to: '/app' },
  { label: 'Upload', to: '/app/upload' },
  { label: 'Outfits', to: '/app/outfit' },
]

export function AppNavbar() {
  return (
    <header className="border-b border-border/70 bg-cream">
      <Container className="flex items-center justify-between py-5">
        <Link to="/" className="font-serif text-2xl italic text-ink">
          Styleby
        </Link>

        <nav className="flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/app'}
              className={({ isActive }) =>
                `text-[15px] transition-colors ${
                  isActive ? 'font-medium text-ink' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </Container>
    </header>
  )
}
