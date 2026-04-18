'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'Startseite' },
  { href: '/menu', label: 'Speisekarte' },
  { href: '/about', label: 'Über uns' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Kontakt' },
]

export function Header() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold text-stone-900">
          Restaurant
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-moss-600',
                pathname === link.href ? 'text-moss-600' : 'text-stone-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/cart" className="hidden md:block">
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Warenkorb
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-salmon-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  )
}
