import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const footerNav = [
  { href: '/menu', label: 'Speisekarte' },
  { href: '/about', label: 'Über uns' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Kontakt' },
]

const legalLinks = [
  { href: '/agb', label: 'AGB' },
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
]

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#999] pb-24 md:pb-0">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">B</span>
              </div>
              <span className="font-display text-xl font-bold text-white">Bistro</span>
            </div>
            <p className="text-sm leading-relaxed max-w-[220px]">
              Frische Küche, ehrlich serviert. Internationale Aromen in Zürich.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#666]">Navigation</h3>
            <nav className="flex flex-col gap-2.5">
              {footerNav.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm hover:text-white transition-colors w-fit">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kontakt */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#666]">Kontakt</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-1 text-[var(--accent)]" />
                <span>Musterstrasse 12<br />8001 Zürich</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>+41 44 123 45 67</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>info@bistro.ch</span>
              </div>
            </div>
          </div>

          {/* Öffnungszeiten */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#666]">Öffnungszeiten</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Mo–Fr: 11–22 Uhr</span>
              </div>
              <p className="pl-[22px]">Sa–So: 12–23 Uhr</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#555]">
            &copy; {new Date().getFullYear()} Bistro Zürich. Alle Rechte vorbehalten.
          </p>
          <nav className="flex gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-[#555] hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
