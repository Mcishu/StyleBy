import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Container } from '../ui/Container'
import { useAuth } from '../../lib/AuthContext'

const links = [
  { label: 'Closet', to: '/app' },
  { label: 'Upload', to: '/app/upload' },
  { label: 'Outfits', to: '/app/outfit' },
]

export function AppNavbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/', { replace: true })
  }

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

        <div className="flex items-center gap-4">
          {user && <span className="hidden text-sm text-muted sm:inline">{user.email}</span>}
          <button
            onClick={handleSignOut}
            className="text-[15px] text-ink-soft transition-colors hover:text-ink"
          >
            Log out
          </button>
        </div>
      </Container>
    </header>
  )
}
