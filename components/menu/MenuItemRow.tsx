'use client'

import { formatPrice } from '@/lib/utils'
import { Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MenuProduct } from './MenuClient'

export function MenuItemRow({
  product,
  isAdded,
  onAdd,
  onSelect,
}: {
  product: MenuProduct
  isAdded: boolean
  onAdd: () => void
  onSelect: () => void
}) {
  const hasOptions = product.variants.length > 0 || product.addons.length > 0

  return (
    <div
      className="flex items-start gap-3 py-3.5 cursor-pointer active:bg-[var(--bg)]"
      onClick={onSelect}
    >
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] leading-[1.3]">
          {product.name}
        </h3>
        <p className="text-[15px] font-extrabold text-[var(--text-primary)] mt-1">
          {formatPrice(product.basePrice)}
          {product.variants.length > 0 && (
            <span className="text-[11px] font-normal text-[var(--text-tertiary)] ml-0.5">ab</span>
          )}
        </p>
        {product.description && (
          <p className="text-[13px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-[1.4]">
            {product.description}
          </p>
        )}
      </div>

      {/* Add button - CRITICAL: high contrast, clear shadow */}
      <div className="flex-shrink-0 pt-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation()
            hasOptions ? onSelect() : onAdd()
          }}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-[0.85]',
            'bg-[var(--accent)] text-white shadow-[0_3px_12px_rgba(61,90,62,0.4)] hover:shadow-[0_4px_16px_rgba(61,90,62,0.5)]',
            'border-2 border-white'
          )}
          aria-label={`${product.name} hinzufügen`}
        >
          {isAdded ? (
            <Check className="w-5 h-5 animate-checkmark" strokeWidth={3} />
          ) : (
            <Plus className="w-5 h-5" strokeWidth={3} />
          )}
        </button>
      </div>
    </div>
  )
}
