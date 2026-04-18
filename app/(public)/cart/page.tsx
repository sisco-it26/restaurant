'use client'

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
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
      <div className="container py-16 max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-stone-100 rounded-full p-6">
            <ShoppingCart className="w-12 h-12 text-stone-400" />
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-4">
          Ihr Warenkorb ist leer
        </h1>
        <p className="text-stone-600 mb-8">
          Fügen Sie Artikel aus unserer Speisekarte hinzu.
        </p>
        <Link href="/menu">
          <Button size="lg">Zur Speisekarte</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-stone-900 mb-8">
        Warenkorb
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border border-stone-200"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-900 truncate">{item.productName}</p>
              {item.variant && (
                <p className="text-sm text-stone-500 mt-0.5">• {item.variant.name}</p>
              )}
              {item.addons.length > 0 && (
                <p className="text-sm text-stone-500 mt-0.5">
                  + {item.addons.map((a) => a.name).join(', ')}
                </p>
              )}
              <p className="text-sm font-medium text-moss-700 mt-1">
                {formatPrice(item.totalPrice)} / Stück
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors"
                aria-label="Menge verringern"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-medium text-stone-900">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors"
                aria-label="Menge erhöhen"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-salmon-600 hover:bg-salmon-50 transition-colors ml-2"
                aria-label="Artikel entfernen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right flex-shrink-0 w-20">
              <p className="font-display font-semibold text-stone-900">
                {formatPrice(item.totalPrice * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-3">
        <div className="flex justify-between text-stone-700">
          <span>Zwischensumme</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-700">
          <span>
            {orderType === 'DELIVERY' ? 'Liefergebühr' : 'Abholung'}
          </span>
          <span>
            {orderType === 'DELIVERY'
              ? deliveryFee > 0
                ? formatPrice(deliveryFee)
                : 'Kostenlos'
              : 'Kostenlos'}
          </span>
        </div>
        <div className="border-t border-stone-200 pt-3 flex justify-between font-display text-xl font-bold text-stone-900">
          <span>Gesamt</span>
          <span>{formatPrice(total)}</span>
        </div>

        <Button className="w-full mt-4" size="lg">
          Zur Kasse
        </Button>
        <p className="text-xs text-center text-stone-500 mt-2">
          Bestellung als{' '}
          <span className="font-medium">
            {orderType === 'DELIVERY' ? 'Lieferung' : 'Abholung'}
          </span>
        </p>
      </div>
    </div>
  )
}
