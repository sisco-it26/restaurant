'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, UtensilsCrossed, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/menu', label: 'Menü', icon: UtensilsCrossed },
  { href: '/cart', label: 'Warenkorb', icon: ShoppingCart },
  { href: '/account', label: 'Konto', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--border)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden pb-safe">
      <div className="flex items-center justify-around h-[4.25rem]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isCart = item.href === '/cart'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 relative transition-colors',
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'
              )}
            >
              <div className="relative">
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.8} />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[var(--accent)] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--accent)]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
