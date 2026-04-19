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
      className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1"
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
              'flex-shrink-0 px-5 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-all duration-200',
              isActive
                ? 'bg-[var(--text-primary)] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                : 'bg-white text-[var(--text-secondary)] border border-[var(--border)] active:bg-[#F5F4F0]'
            )}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
