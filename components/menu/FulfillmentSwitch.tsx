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
    <div className="relative flex bg-[#F0F0F0] rounded-xl p-[3px] h-11">
      {/* Sliding indicator */}
      <div
        className={cn(
          'absolute top-[3px] bottom-[3px] w-[calc(50%-3px)] bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-250 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          value === 'PICKUP' ? 'translate-x-[calc(100%+3px)]' : 'translate-x-0'
        )}
      />
      <button
        onClick={() => onChange('DELIVERY')}
        className={cn(
          'relative z-10 flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold tracking-[-0.01em] transition-colors duration-200 rounded-[10px]',
          value === 'DELIVERY'
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-tertiary)]'
        )}
      >
        <span className="text-[15px]">🛵</span>
        Lieferung
      </button>
      <button
        onClick={() => onChange('PICKUP')}
        className={cn(
          'relative z-10 flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold tracking-[-0.01em] transition-colors duration-200 rounded-[10px]',
          value === 'PICKUP'
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-tertiary)]'
        )}
      >
        <span className="text-[15px]">🏪</span>
        Abholung
      </button>
    </div>
  )
}
