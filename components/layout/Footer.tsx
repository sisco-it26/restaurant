import Link from 'next/link'

const footerLinks = [
  { href: '/agb', label: 'AGB' },
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
]

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 py-8 pb-20 md:pb-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-600">
            © {new Date().getFullYear()} Restaurant. Alle Rechte vorbehalten.
          </p>
          <nav className="flex gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-600 hover:text-moss-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
