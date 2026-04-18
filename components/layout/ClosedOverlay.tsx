'use client'

import { useOpeningHours } from '@/hooks/use-opening-hours'
import { AlertCircle } from 'lucide-react'

export function ClosedOverlay() {
  const { status, loading } = useOpeningHours()

  if (loading || !status || status.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-salmon-100 rounded-full p-3">
            <AlertCircle className="w-8 h-8 text-salmon-600" />
          </div>
        </div>
        <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">
          Aktuell geschlossen
        </h2>
        <p className="text-stone-600 mb-4">{status.message}</p>
        {status.nextOpenTime && (
          <p className="text-sm text-stone-500">
            {status.nextOpenDay && `${status.nextOpenDay} `}
            ab {status.nextOpenTime} Uhr wieder für Sie da
          </p>
        )}
      </div>
    </div>
  )
}
