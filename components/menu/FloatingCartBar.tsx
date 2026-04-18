'use client'

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export function FloatingCartBar() {
  const { itemCount, total } = useCart()

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-safe lg:hidden">
      <Link
        href="/cart"
        className="flex items-center justify-between w-full h-[52px] px-5 bg-[var(--accent)] text-white rounded-xl shadow-[0_4px_20px_rgba(61,90,62,0.35)] active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2 bg-white text-[var(--accent)] text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5">
              {itemCount}
            </span>
          </div>
          <span className="text-[14px] font-bold">Warenkorb ansehen</span>
        </div>
        <span className="text-[15px] font-extrabold">{formatPrice(total)}</span>
      </Link>
    </div>
  )
}
