'use client'

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const {
    items,
    orderType,
    subtotal,
    deliveryFee,
    total,
    updateQuantity,
    removeItem,
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="container py-24 max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-8 h-8 text-[var(--text-tertiary)]" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)] mb-3">
          Noch nichts im Warenkorb
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Entdecke unsere Speisekarte und bestell dein Lieblingsgericht.
        </p>
        <Link href="/menu">
          <Button size="lg">
            <UtensilsCrossed className="w-4 h-4 mr-2" />
            Zur Speisekarte
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 pb-32 md:pb-8">
      <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)] mb-6">
        Warenkorb
        <span className="text-[var(--text-tertiary)] font-medium text-base ml-2">
          ({items.length} {items.length === 1 ? 'Artikel' : 'Artikel'})
        </span>
      </h1>

      <div className="grid md:grid-cols-[1fr_340px] gap-8">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white border border-[var(--border)] rounded-2xl"
            >
              {/* Emoji placeholder */}
              <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-subtle)] flex items-center justify-center text-2xl">
                🍽️
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)] text-sm">{item.productName}</p>
                    {item.variant && (
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.variant.name}</p>
                    )}
                    {item.addons.length > 0 && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        + {item.addons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-display font-bold text-[var(--text-primary)]">
                    {formatPrice(item.totalPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/menu"
            className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[var(--accent)] hover:underline underline-offset-4"
          >
            <Plus className="w-4 h-4" />
            Weitere Artikel hinzufügen
          </Link>
        </div>

        {/* Summary */}
        <div className="md:sticky md:top-24 h-fit">
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">Zusammenfassung</h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Zwischensumme</span>
                <span className="font-medium text-[var(--text-primary)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>{orderType === 'DELIVERY' ? 'Liefergebühr' : 'Abholung'}</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {orderType === 'DELIVERY' && deliveryFee > 0 ? formatPrice(deliveryFee) : 'Kostenlos'}
                </span>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4 flex justify-between">
              <span className="font-display text-lg font-extrabold text-[var(--text-primary)]">Gesamt</span>
              <span className="font-display text-lg font-extrabold text-[var(--text-primary)]">{formatPrice(total)}</span>
            </div>

            <Button className="w-full h-14 text-base" size="lg">
              Zur Kasse
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <p className="text-xs text-center text-[var(--text-tertiary)]">
              {orderType === 'DELIVERY' ? '🛵 Lieferung' : '🏪 Abholung'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
