import { Container } from '../ui/Container'

const columns = [
  { title: 'Product', links: ['Capsules', 'How it works', 'Pricing'] },
  { title: 'Company', links: ['About', 'Careers', 'Press'] },
  { title: 'Support', links: ['Help center', 'Contact', 'Privacy'] },
]

export function Footer() {
  return (
    <Container className="py-14">
      <div className="flex flex-col gap-12 border-t border-border/70 pt-12 md:flex-row md:justify-between">
        <span className="font-serif text-2xl italic text-ink">Styleby</span>

        <div className="flex flex-wrap gap-16">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-ink">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[15px] text-accent transition-colors hover:text-ink"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-sm text-muted">
        © {new Date().getFullYear()} Styleby. All rights reserved.
      </p>
    </Container>
  )
}
