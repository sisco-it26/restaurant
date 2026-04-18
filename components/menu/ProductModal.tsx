'use client'

import { formatPrice } from '@/lib/utils'
import { Plus, Minus, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MenuProduct, MenuVariant, MenuAddon } from './MenuClient'

export function ProductModal({
  product,
  selectedVariant,
  selectedAddons,
  quantity,
  onSelectVariant,
  onToggleAddon,
  onQuantityChange,
  onAdd,
  onClose,
}: {
  product: MenuProduct
  selectedVariant: MenuVariant | null
  selectedAddons: MenuAddon[]
  quantity: number
  onSelectVariant: (v: MenuVariant) => void
  onToggleAddon: (a: MenuAddon) => void
  onQuantityChange: (q: number) => void
  onAdd: () => void
  onClose: () => void
}) {
  const totalPrice =
    (product.basePrice +
      (selectedVariant?.priceModifier ?? 0) +
      selectedAddons.reduce((sum, a) => sum + a.price, 0)) * quantity

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white w-full md:max-w-[420px] md:rounded-2xl rounded-t-3xl shadow-[var(--shadow-xl)] max-h-[90vh] flex flex-col animate-slide-up md:animate-fade-in">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-2 pb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-extrabold text-[var(--text-primary)] leading-tight">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-[13px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                {product.description}
              </p>
            )}
            <p className="text-[15px] font-bold text-[var(--text-primary)] mt-2">
              ab {formatPrice(product.basePrice)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] text-[var(--text-secondary)] transition-colors flex-shrink-0 mt-1"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable options */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4 space-y-5">
          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-[0.04em]">
                  Grösse wählen
                </p>
                <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-full">
                  Pflicht
                </span>
              </div>
              <div className="space-y-2">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id
                  return (
                    <button
                      key={variant.id}
                      onClick={() => onSelectVariant(variant)}
                      className={cn(
                        'flex items-center justify-between w-full py-3 px-3.5 rounded-xl border-2 transition-all duration-150',
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                          : 'border-[#ECECEC] active:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center',
                          isSelected ? 'border-[var(--accent)]' : 'border-[#CCC]'
                        )}>
                          {isSelected && <div className="w-[10px] h-[10px] rounded-full bg-[var(--accent)]" />}
                        </div>
                        <span className="text-[14px] font-semibold text-[var(--text-primary)]">{variant.name}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
                        {variant.priceModifier > 0
                          ? `+${formatPrice(variant.priceModifier)}`
                          : variant.priceModifier < 0
                          ? formatPrice(variant.priceModifier)
                          : 'Inkl.'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Addons */}
          {product.addons.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-[0.04em]">
                  Extras hinzufügen
                </p>
                <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
                  Optional
                </span>
              </div>
              <div className="space-y-2">
                {product.addons.map((addon) => {
                  const checked = selectedAddons.some((a) => a.id === addon.id)
                  return (
                    <button
                      key={addon.id}
                      onClick={() => onToggleAddon(addon)}
                      className={cn(
                        'flex items-center justify-between w-full py-3 px-3.5 rounded-xl border-2 transition-all duration-150',
                        checked
                          ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                          : 'border-[#ECECEC] active:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-colors',
                          checked ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[#CCC]'
                        )}>
                          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-[14px] font-semibold text-[var(--text-primary)]">{addon.name}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
                        +{formatPrice(addon.price)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sticky bottom bar */}
        <div className="px-5 py-4 border-t border-[var(--border)] bg-white rounded-b-2xl pb-safe">
          <div className="flex items-center gap-3">
            {/* Qty control */}
            <div className="flex items-center h-12 bg-[#F0F0F0] rounded-xl flex-shrink-0">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="w-11 h-12 flex items-center justify-center text-[var(--text-secondary)] active:text-[var(--text-primary)] transition-colors"
                aria-label="Weniger"
              >
                <Minus className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </button>
              <span className="w-7 text-center text-[15px] font-bold tabular-nums">{quantity}</span>
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="w-11 h-12 flex items-center justify-center text-[var(--text-secondary)] active:text-[var(--text-primary)] transition-colors"
                aria-label="Mehr"
              >
                <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </button>
            </div>

            {/* CTA */}
            <button
              onClick={onAdd}
              className="flex-1 h-12 flex items-center justify-center gap-2 bg-[var(--accent)] text-white text-[15px] font-bold rounded-xl shadow-[0_2px_12px_rgba(61,90,62,0.25)] active:scale-[0.98] transition-transform"
            >
              Hinzufügen · {formatPrice(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
