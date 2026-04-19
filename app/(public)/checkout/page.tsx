'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DeliveryModePill } from '@/components/menu/DeliveryModePill'
import { ArrowLeft, Loader2, CheckCircle, ShoppingCart, Truck, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, orderType, setOrderType, subtotal, deliveryFee, total, clearCart, itemCount } = useCart()

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    postalCode: '',
    city: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ orderNumber: string } | null>(null)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isDelivery = orderType === 'DELIVERY'
  const canSubmit =
    form.customerName.trim() &&
    form.customerEmail.trim() &&
    form.customerPhone.trim() &&
    (!isDelivery || (form.deliveryAddress.trim() && form.postalCode.trim() && form.city.trim())) &&
    items.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: orderType,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          deliveryAddress: isDelivery ? form.deliveryAddress : undefined,
          postalCode: isDelivery ? form.postalCode : undefined,
          deliveryFee: isDelivery ? deliveryFee : 0,
          notes: form.notes || undefined,
          items: items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            variant: item.variant,
            addons: item.addons,
            notes: item.notes,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Bestellung fehlgeschlagen')
      }

      const data = await res.json()
      setSuccess({ orderNumber: data.orderNumber })
      clearCart()
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setSubmitting(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-[var(--accent-light)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[var(--accent)]" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)] mb-2">
            Bestellung aufgegeben!
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mb-1">
            Bestellnummer: <span className="font-bold text-[var(--text-primary)]">{success.orderNumber}</span>
          </p>
          <p className="text-[13px] text-[var(--text-tertiary)] mb-6">
            Du erhältst eine Bestätigung per E-Mail.
          </p>
          <Link href="/menu">
            <Button>Zurück zur Speisekarte</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Empty cart
  if (itemCount === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShoppingCart className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
          <h1 className="font-display text-xl font-extrabold text-[var(--text-primary)] mb-2">
            Warenkorb ist leer
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mb-6">
            Füge Artikel hinzu, bevor du zur Kasse gehst.
          </p>
          <Link href="/menu">
            <Button>Zur Speisekarte</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen pb-28 lg:pb-8">
      <div className="px-4 lg:max-w-[960px] lg:mx-auto lg:px-6 py-5">
        {/* Back */}
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-5">
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Warenkorb
        </Link>

        <h1 className="font-display text-[22px] font-extrabold text-[var(--text-primary)] mb-6">
          Kasse
        </h1>

        {/* Delivery Mode Selection */}
        <div className="mb-6">
          <h2 className="text-[13px] font-bold text-[var(--text-secondary)] mb-3">Bestellart</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrderType('DELIVERY')}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                orderType === 'DELIVERY'
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                  : 'border-[var(--border)] hover:border-[var(--border-strong)]'
              )}
            >
              <Truck className="w-5 h-5 text-[var(--accent)]" />
              <div className="flex-1 text-left">
                <p className="text-[14px] font-bold text-[var(--text-primary)]">Lieferung</p>
                <p className="text-[12px] text-[var(--text-secondary)]">30–40 Min</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setOrderType('PICKUP')}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                orderType === 'PICKUP'
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                  : 'border-[var(--border)] hover:border-[var(--border-strong)]'
              )}
            >
              <Store className="w-5 h-5 text-[var(--accent)]" />
              <div className="flex-1 text-left">
                <p className="text-[14px] font-bold text-[var(--text-primary)]">Abholung</p>
                <p className="text-[12px] text-[var(--text-secondary)]">15–20 Min</p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Left: Form */}
            <div className="space-y-5">
              {/* Contact */}
              <div className="bg-white border border-[var(--border)] rounded-xl p-5">
                <h2 className="text-[14px] font-bold text-[var(--text-primary)] mb-4">Kontaktdaten</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">Name *</label>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => update('customerName', e.target.value)}
                      required
                      className="w-full h-10 px-3 text-[14px] bg-[#F5F4F0] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">E-Mail *</label>
                      <input
                        type="email"
                        value={form.customerEmail}
                        onChange={(e) => update('customerEmail', e.target.value)}
                        required
                        className="w-full h-10 px-3 text-[14px] bg-[#F5F4F0] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">Telefon *</label>
                      <input
                        type="tel"
                        value={form.customerPhone}
                        onChange={(e) => update('customerPhone', e.target.value)}
                        required
                        className="w-full h-10 px-3 text-[14px] bg-[#F5F4F0] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              {isDelivery && (
                <div className="bg-white border border-[var(--border)] rounded-xl p-5">
                  <h2 className="text-[14px] font-bold text-[var(--text-primary)] mb-4">Lieferadresse</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">Adresse *</label>
                      <input
                        type="text"
                        value={form.deliveryAddress}
                        onChange={(e) => update('deliveryAddress', e.target.value)}
                        required
                        placeholder="Strasse und Hausnummer"
                        className="w-full h-10 px-3 text-[14px] bg-[#F5F4F0] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all placeholder:text-[var(--text-tertiary)]"
                      />
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-3">
                      <div>
                        <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">PLZ *</label>
                        <input
                          type="text"
                          value={form.postalCode}
                          onChange={(e) => update('postalCode', e.target.value)}
                          required
                          maxLength={4}
                          className="w-full h-10 px-3 text-[14px] bg-[#F5F4F0] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">Ort *</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => update('city', e.target.value)}
                          required
                          placeholder="Zürich"
                          className="w-full h-10 px-3 text-[14px] bg-[#F5F4F0] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all placeholder:text-[var(--text-tertiary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-white border border-[var(--border)] rounded-xl p-5">
                <h2 className="text-[14px] font-bold text-[var(--text-primary)] mb-4">Bemerkungen</h2>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  rows={3}
                  placeholder="Sonderwünsche, Etage, Klingel..."
                  className="w-full px-3 py-2.5 text-[14px] bg-[#F5F4F0] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none placeholder:text-[var(--text-tertiary)]"
                />
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="bg-white border border-[var(--border)] rounded-xl p-5 lg:sticky lg:top-20">
                <h2 className="text-[14px] font-bold text-[var(--text-primary)] mb-4">
                  Zusammenfassung
                  <span className="text-[var(--text-tertiary)] font-medium ml-1">({itemCount})</span>
                </h2>

                <div className="divide-y divide-[var(--border)]">
                  {items.map((item) => (
                    <div key={item.id} className="py-2 first:pt-0 last:pb-0">
                      <div className="flex justify-between gap-2">
                        <span className="text-[13px] text-[var(--text-primary)]">
                          <span className="font-semibold">{item.quantity}×</span> {item.productName}
                        </span>
                        <span className="text-[13px] font-semibold text-[var(--text-primary)] flex-shrink-0">
                          {formatPrice(item.totalPrice * item.quantity)}
                        </span>
                      </div>
                      {item.variant && (
                        <p className="text-[11px] text-[var(--text-tertiary)]">{item.variant.name}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-1.5 text-[13px]">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Zwischensumme</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>{isDelivery ? 'Liefergebühr' : 'Abholung'}</span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {isDelivery && deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratis'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[var(--border)]">
                    <span className="text-[15px] font-extrabold text-[var(--text-primary)]">Gesamt</span>
                    <span className="text-[15px] font-extrabold text-[var(--text-primary)]">{formatPrice(total)}</span>
                  </div>
                </div>

                {error && (
                  <p className="text-[12px] text-red-600 font-medium mt-3">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="w-full mt-4 h-12 text-[15px]"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Wird gesendet...
                    </>
                  ) : (
                    `Bestellung aufgeben · ${formatPrice(total)}`
                  )}
                </Button>

                <p className="text-[11px] text-center text-[var(--text-tertiary)] mt-2">
                  {isDelivery ? '🛵 Lieferung' : '🏪 Abholung'} · Zahlung bei Erhalt
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
