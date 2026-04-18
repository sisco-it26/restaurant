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
    <div className="flex items-start gap-3 py-3">
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-bold text-[var(--text-primary)] leading-[1.3]">
          {product.name}
        </h3>
        <p className="text-[14px] font-semibold text-[var(--text-primary)] mt-0.5">
          {formatPrice(product.basePrice)}
          {product.variants.length > 0 && (
            <span className="text-[11px] font-normal text-[var(--text-tertiary)] ml-0.5">ab</span>
          )}
        </p>
        {product.description && (
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 line-clamp-2 leading-[1.4]">
            {product.description}
          </p>
        )}
      </div>

      {/* Add button */}
      <div className="flex-shrink-0 pt-0.5">
        <button
          onClick={hasOptions ? onSelect : onAdd}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-90',
            isAdded
              ? 'bg-[var(--accent)] text-white shadow-[0_2px_6px_rgba(61,90,62,0.3)]'
              : 'bg-[var(--accent)] text-white shadow-[0_2px_6px_rgba(61,90,62,0.3)]'
          )}
          aria-label={`${product.name} hinzufügen`}
        >
          {isAdded ? (
            <Check className="w-4 h-4 animate-checkmark" strokeWidth={2.5} />
          ) : (
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  )
}
