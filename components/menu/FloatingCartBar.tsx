'use client'

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function FloatingCartBar() {
  const { itemCount, total } = useCart()
  const pathname = usePathname()

  // Hide on checkout/cart pages
  if (pathname === '/checkout' || pathname === '/cart') return null

  // Only show when cart has items
  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pb-safe">
      <div className="container px-4 pb-4">
        <Link
          href="/cart"
          className="flex items-center justify-between h-14 px-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-2xl shadow-[0_8px_32px_rgba(45,74,46,0.45)] active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium opacity-90">Warenkorb</span>
              <span className="text-[13px] font-bold">{itemCount} {itemCount === 1 ? 'Artikel' : 'Artikel'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-extrabold">{formatPrice(total)}</span>
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </Link>
      </div>
    </div>
  )
}
