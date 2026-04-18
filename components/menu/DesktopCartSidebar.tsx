'use client'

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function DesktopCartSidebar() {
  const { items, subtotal, deliveryFee, total, orderType, updateQuantity, removeItem, itemCount } = useCart()

  if (itemCount === 0) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-[14px] font-bold text-[var(--text-primary)] mb-4">Warenkorb</h3>
        <div className="text-center py-6">
          <ShoppingCart className="w-6 h-6 text-[var(--text-tertiary)] mx-auto mb-2" />
          <p className="text-[13px] text-[var(--text-secondary)]">Noch leer</p>
          <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">Füge Artikel hinzu</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
            Warenkorb
            <span className="text-[var(--text-tertiary)] font-medium ml-1">({itemCount})</span>
          </h3>
          <span className="text-[11px] text-[var(--text-tertiary)]">
            {orderType === 'DELIVERY' ? '🛵 Lieferung' : '🏪 Abholung'}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="max-h-[320px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-2.5 border-b border-[var(--border)] last:border-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight truncate">
                  {item.productName}
                </p>
                {item.variant && (
                  <p className="text-[11px] text-[var(--text-tertiary)]">{item.variant.name}</p>
                )}
                {item.addons.length > 0 && (
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    + {item.addons.map((a) => a.name).join(', ')}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="w-6 h-6 flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center bg-[#F0EFEB] rounded-md">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)]"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-[12px] font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)]"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[13px] font-bold text-[var(--text-primary)]">
                {formatPrice(item.totalPrice * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-4 py-3 bg-[#FAFAF8] border-t border-[var(--border)] space-y-1.5">
        <div className="flex justify-between text-[12px] text-[var(--text-secondary)]">
          <span>Zwischensumme</span>
          <span className="font-medium text-[var(--text-primary)]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[12px] text-[var(--text-secondary)]">
          <span>{orderType === 'DELIVERY' ? 'Liefergebühr' : 'Abholung'}</span>
          <span className="font-medium text-[var(--text-primary)]">
            {orderType === 'DELIVERY' && deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratis'}
          </span>
        </div>
        <div className="flex justify-between pt-1.5 border-t border-[var(--border)]">
          <span className="text-[14px] font-extrabold text-[var(--text-primary)]">Gesamt</span>
          <span className="text-[14px] font-extrabold text-[var(--text-primary)]">{formatPrice(total)}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="p-3">
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 w-full h-11 bg-[var(--accent)] text-white text-[14px] font-bold rounded-xl hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all"
        >
          Zur Kasse
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
