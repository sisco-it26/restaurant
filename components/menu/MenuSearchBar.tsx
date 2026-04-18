'use client'

import { Search } from 'lucide-react'

export function MenuSearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-tertiary)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Suche in der Speisekarte…"
        className="w-full h-11 pl-10 pr-4 text-[15px] font-medium bg-[#F5F5F5] border-0 rounded-xl outline-none placeholder:text-[var(--text-tertiary)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
      />
    </div>
  )
}
