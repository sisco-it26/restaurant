'use client'

import { useCart } from '@/hooks/use-cart'
import { Truck, Store, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function DeliveryModePill() {
  const { orderType, setOrderType } = useCart()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 h-9 px-3.5 bg-white border border-[var(--border)] rounded-full text-[13px] font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
      >
        {orderType === 'DELIVERY' ? (
          <>
            <Truck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Lieferung</span>
          </>
        ) : (
          <>
            <Store className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Abholung</span>
          </>
        )}
        <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)]" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center md:justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full md:max-w-[380px] md:rounded-2xl rounded-t-2xl p-6 animate-slide-up md:animate-fade-in">
            <h3 className="font-display text-lg font-extrabold text-[var(--text-primary)] mb-4">
              Bestellart wählen
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setOrderType('DELIVERY')
                  setShowModal(false)
                }}
                className={cn(
                  'flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all',
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
                onClick={() => {
                  setOrderType('PICKUP')
                  setShowModal(false)
                }}
                className={cn(
                  'flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all',
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
        </div>
      )}
    </>
  )
}
