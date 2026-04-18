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
      {/* Category header — compact */}
      <div className="flex items-baseline justify-between pb-1.5 border-b border-[var(--border)]">
        <h2 className="text-[15px] font-extrabold text-[var(--text-primary)]">
          {category.name}
        </h2>
        <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
          {category.products.length}
        </span>
      </div>

      {/* Product list — tight dividers */}
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
