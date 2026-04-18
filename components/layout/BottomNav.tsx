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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[hsl(35,15%,87%)] md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isCart = item.href === '/cart'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative',
                isActive ? 'text-[hsl(24,70%,45%)]' : 'text-[hsl(30,8%,46%)]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              {isCart && itemCount > 0 && (
                <span className="absolute top-2 right-1/4 bg-[hsl(24,70%,45%)] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
