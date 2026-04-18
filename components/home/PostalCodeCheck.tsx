'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

type ValidationResult = {
  available: boolean
  zone?: {
    name: string
    deliveryFee: number
    minOrderAmount: number | null
    estimatedTime: number
  }
  message?: string
}

export function PostalCodeCheck() {
  const [postalCode, setPostalCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const handleCheck = async () => {
    if (!postalCode.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/delivery-zones/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postalCode: postalCode.trim() }),
      })
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ available: false, message: 'Fehler. Bitte erneut versuchen.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex">
        <input
          type="text"
          placeholder="PLZ eingeben"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          maxLength={4}
          className="flex-1 h-12 px-4 text-sm font-medium border-2 border-r-0 border-[var(--border-strong)] rounded-l-xl bg-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-tertiary)]"
        />
        <button
          onClick={handleCheck}
          disabled={loading || !postalCode.trim()}
          className="h-12 px-6 text-sm font-semibold bg-[var(--accent)] text-white rounded-r-xl hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Prüfen'}
        </button>
      </div>

      {result && (
        <div className="flex items-center gap-2 text-sm animate-fade-in">
          {result.available ? (
            <>
              <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
              <span className="text-[var(--success)] font-medium">
                Lieferung möglich — ca. {result.zone?.estimatedTime} Min. • CHF {result.zone?.deliveryFee.toFixed(2)} Liefergebühr
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-red-600 font-medium">{result.message || 'Leider nicht verfügbar'}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
