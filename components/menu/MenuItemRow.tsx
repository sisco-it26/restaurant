'use client'

import { formatPrice } from '@/lib/utils'
import { Plus, Check, Info } from 'lucide-react'
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
  const hasAllergens = product.allergens.length > 0 || product.additives.length > 0

  return (
    <div className="flex items-start gap-3 py-4 group">
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight">
          {product.name}
        </h3>

        <p className="text-[15px] font-bold text-[var(--text-primary)] mt-1">
          {formatPrice(product.basePrice)}
          {product.variants.length > 0 && (
            <span className="text-[12px] font-medium text-[var(--text-tertiary)] ml-1">ab</span>
          )}
        </p>

        {product.description && (
          <p className="text-[13px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-[1.4]">
            {product.description}
          </p>
        )}

        {hasAllergens && (
          <div className="flex items-center gap-1 mt-1.5">
            <Info className="w-3 h-3 text-[var(--text-tertiary)]" />
            <span className="text-[11px] text-[var(--text-tertiary)] leading-none">
              {[...product.allergens, ...product.additives].join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Add button — large touch target */}
      <div className="flex-shrink-0 pt-1">
        {hasOptions ? (
          <button
            onClick={onSelect}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)] text-white shadow-[0_2px_8px_rgba(232,93,42,0.3)] active:scale-90 transition-transform"
            aria-label={`${product.name} auswählen`}
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={onAdd}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full shadow-[0_2px_8px_rgba(232,93,42,0.3)] active:scale-90 transition-all duration-300',
              isAdded
                ? 'bg-[var(--success)] text-white shadow-[0_2px_8px_rgba(34,163,85,0.3)]'
                : 'bg-[var(--accent)] text-white'
            )}
            aria-label={`${product.name} hinzufügen`}
          >
            {isAdded ? (
              <Check className="w-5 h-5 animate-checkmark" strokeWidth={2.5} />
            ) : (
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
