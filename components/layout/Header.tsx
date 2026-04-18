'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
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
  const { itemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-500',
          scrolled
            ? 'bg-[#faf7f2]/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.04)]'
            : 'bg-transparent'
        )}
      >
        <div className="container flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[hsl(24,70%,45%)] flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <span className="text-white font-display text-lg leading-none">B</span>
            </div>
            <span className="font-display text-2xl text-[hsl(30,10%,12%)] tracking-tight">
              Bistro
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded-full',
                  pathname === link.href
                    ? 'text-[hsl(24,70%,45%)] bg-[hsl(24,70%,45%)]/8'
                    : 'text-[hsl(30,8%,40%)] hover:text-[hsl(30,10%,12%)] hover:bg-[hsl(30,10%,12%)]/4'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full bg-[hsl(30,10%,12%)] text-[hsl(40,33%,97%)] hover:bg-[hsl(30,10%,18%)] transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Warenkorb</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[hsl(24,70%,45%)] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-[#faf7f2]">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[hsl(30,10%,12%)]/5 transition-colors"
              aria-label="Menü öffnen"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-[#faf7f2] md:hidden">
          <nav className="flex flex-col items-center justify-center h-full gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-display text-4xl tracking-tight py-3 transition-colors animate-fade-up',
                  pathname === link.href
                    ? 'text-[hsl(24,70%,45%)]'
                    : 'text-[hsl(30,10%,12%)]'
                )}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
