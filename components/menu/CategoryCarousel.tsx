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

  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current.querySelector(`[data-cat="${activeId}"]`) as HTMLElement | null
    if (el) {
      const container = scrollRef.current
      const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
      container.scrollTo({ left, behavior: 'smooth' })
    }
  }, [activeId])

  return (
    <div
      ref={scrollRef}
      className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 py-0.5"
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
              'flex-shrink-0 px-3.5 py-[6px] rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-150',
              isActive
                ? 'bg-[var(--text-primary)] text-white'
                : 'bg-transparent text-[var(--text-secondary)] active:bg-[#E8E6E1]'
            )}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
