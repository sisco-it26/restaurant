'use client'

import { useOpeningHours } from '@/hooks/use-opening-hours'
import { AlertCircle } from 'lucide-react'

export function ClosedOverlay() {
  const { status, loading } = useOpeningHours()

  if (loading || !status || status.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-[var(--shadow-xl)] p-8 max-w-md mx-4 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] mb-2">
          Aktuell geschlossen
        </h2>
        <p className="text-[var(--text-secondary)] mb-4">{status.message}</p>
        {status.nextOpenTime && (
          <p className="text-sm text-[var(--text-tertiary)]">
            {status.nextOpenDay && `${status.nextOpenDay} `}
            ab {status.nextOpenTime} Uhr wieder für Sie da
          </p>
        )}
      </div>
    </div>
  )
}
