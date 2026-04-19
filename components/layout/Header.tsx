'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Start' },
  { href: '/menu', label: 'Speisekarte' },
  { href: '/about', label: 'Über uns' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Kontakt' },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header
        className={cn(
          'relative z-40 w-full bg-white transition-shadow duration-300',
          scrolled ? 'shadow-[var(--shadow-sm)]' : ''
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">B</span>
            </div>
            <span className="font-display text-xl font-bold text-[var(--text-primary)]">
              Bistro
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  pathname === link.href
                    ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile sheet */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-30 w-72 bg-white shadow-[var(--shadow-xl)] animate-slide-right">
            <div className="p-6 pt-20">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 text-base font-medium rounded-xl transition-colors',
                      pathname === link.href
                        ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                        : 'text-[var(--text-primary)] hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}
