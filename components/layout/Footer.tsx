import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'

const footerLinks = [
  { href: '/agb', label: 'AGB' },
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[hsl(35,15%,87%)] bg-[hsl(30,10%,12%)] text-[hsl(40,15%,75%)] pb-20 md:pb-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[hsl(24,70%,45%)] to-transparent" />

      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(24,70%,45%)] flex items-center justify-center">
                <span className="text-white font-display text-base leading-none">B</span>
              </div>
              <span className="font-display text-2xl text-[hsl(40,20%,95%)] tracking-tight">
                Bistro
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Frische Küche, ehrlich serviert. Internationale Aromen in gemütlicher Atmosphäre.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg text-[hsl(40,20%,95%)]">Besuchen Sie uns</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[hsl(24,70%,45%)]" />
                <span>Musterstrasse 12<br />8001 Zürich</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[hsl(24,70%,45%)]" />
                <span>+41 44 123 45 67</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg text-[hsl(40,20%,95%)]">Rechtliches</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm hover:text-[hsl(24,70%,45%)] transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[hsl(30,10%,18%)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(30,8%,40%)]">
            &copy; {new Date().getFullYear()} Bistro. Mit Liebe in Zürich.
          </p>
        </div>
      </div>
    </footer>
  )
}
