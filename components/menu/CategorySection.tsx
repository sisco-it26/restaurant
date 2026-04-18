'use client'

import { MenuItemRow } from './MenuItemRow'
import type { MenuCategory } from './MenuClient'

export function CategorySection({
  category,
  addedProductId,
  onAddSimple,
  onOpenModal,
  sectionRef,
}: {
  category: MenuCategory
  addedProductId: string | null
  onAddSimple: (product: MenuCategory['products'][0]) => void
  onOpenModal: (product: MenuCategory['products'][0]) => void
  sectionRef: (el: HTMLElement | null) => void
}) {
  return (
    <section id={category.id} ref={sectionRef}>
      {/* Category header */}
      <div className="flex items-baseline justify-between mb-1 pt-2">
        <h2 className="font-display text-[18px] font-extrabold text-[var(--text-primary)]">
          {category.name}
        </h2>
        <span className="text-[12px] font-semibold text-[var(--text-tertiary)]">
          {category.products.length} {category.products.length === 1 ? 'Gericht' : 'Gerichte'}
        </span>
      </div>

      {category.description && (
        <p className="text-[13px] text-[var(--text-secondary)] mb-2">{category.description}</p>
      )}

      {/* Product list */}
      <div className="divide-y divide-[var(--border)]">
        {category.products.map((product) => (
          <MenuItemRow
            key={product.id}
            product={product}
            isAdded={addedProductId === product.id}
            onAdd={() => onAddSimple(product)}
            onSelect={() => onOpenModal(product)}
          />
        ))}
      </div>
    </section>
  )
}
