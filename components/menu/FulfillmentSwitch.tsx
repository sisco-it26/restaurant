'use client'

import { cn } from '@/lib/utils'

export function FulfillmentSwitch({
  value,
  onChange,
}: {
  value: 'DELIVERY' | 'PICKUP'
  onChange: (v: 'DELIVERY' | 'PICKUP') => void
}) {
  return (
    <div className="relative flex bg-[#ECEAE5] rounded-lg p-[3px] h-[38px]">
      {/* Sliding pill */}
      <div
        className={cn(
          'absolute top-[3px] bottom-[3px] w-[calc(50%-3px)] rounded-[6px] transition-transform duration-250 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          value === 'DELIVERY'
            ? 'translate-x-0 bg-[var(--accent)]'
            : 'translate-x-[calc(100%+3px)] bg-[var(--accent)]'
        )}
      />
      <button
        onClick={() => onChange('DELIVERY')}
        className={cn(
          'relative z-10 flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-colors duration-200 rounded-[6px]',
          value === 'DELIVERY' ? 'text-white' : 'text-[var(--text-secondary)]'
        )}
      >
        Lieferung
      </button>
      <button
        onClick={() => onChange('PICKUP')}
        className={cn(
          'relative z-10 flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-colors duration-200 rounded-[6px]',
          value === 'PICKUP' ? 'text-white' : 'text-[var(--text-secondary)]'
        )}
      >
        Abholung
      </button>
    </div>
  )
}
