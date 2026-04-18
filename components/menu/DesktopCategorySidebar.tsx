'use client'

import { cn } from '@/lib/utils'

export function DesktopCategorySidebar({
  categories,
  activeId,
  onSelect,
}: {
  categories: { id: string; name: string; count: number }[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <nav className="space-y-0.5">
      <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.06em] mb-2 px-3">
        Kategorien
      </p>
      {categories.map((cat) => {
        const isActive = activeId === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 text-left',
              isActive
                ? 'bg-[var(--accent)] text-white font-semibold'
                : 'text-[var(--text-secondary)] hover:bg-[#F0EFEB] hover:text-[var(--text-primary)]'
            )}
          >
            <span className="truncate">{cat.name}</span>
            <span className={cn(
              'text-[11px] flex-shrink-0 ml-2',
              isActive ? 'text-white/70' : 'text-[var(--text-tertiary)]'
            )}>
              {cat.count}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
