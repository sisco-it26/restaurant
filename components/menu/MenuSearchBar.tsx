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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Suche in der Speisekarte…"
        className="w-full h-10 pl-9 pr-3 text-[14px] font-medium bg-[#F0EFEB] border-0 rounded-lg outline-none placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:bg-white transition-all"
      />
    </div>
  )
}
