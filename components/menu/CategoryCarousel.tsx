'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function CategoryCarousel({
  categories,
  activeId,
  onSelect,
}: {
  categories: { id: string; name: string }[]
  activeId: string
  onSelect: (id: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep active pill centered in view
  useEffect(() => {
    if (!scrollRef.current) return
    const activeBtn = scrollRef.current.querySelector(`[data-cat="${activeId}"]`) as HTMLElement | null
    if (activeBtn) {
      const container = scrollRef.current
      const scrollLeft = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [activeId])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4"
      role="tablist"
    >
      {categories.map((cat) => {
        const isActive = activeId === cat.id
        return (
          <button
            key={cat.id}
            data-cat={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'flex-shrink-0 px-4 py-[7px] rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30',
              isActive
                ? 'bg-[var(--text-primary)] text-white'
                : 'bg-[#F0F0F0] text-[var(--text-secondary)] active:bg-[#E5E5E5]'
            )}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
