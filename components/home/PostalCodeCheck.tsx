'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, XCircle, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function PostalCodeCheck({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
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

  const isHero = variant === 'hero'

  return (
    <div className="space-y-2">
      <div className="flex">
        <div className="relative flex-1">
          <MapPin className={cn(
            'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none',
            isHero ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-tertiary)]'
          )} />
          <input
            type="text"
            placeholder="Deine Postleitzahl"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            maxLength={4}
            className={cn(
              'w-full pl-10 pr-3 text-[14px] font-medium rounded-l-xl focus:outline-none transition-colors placeholder:text-[var(--text-tertiary)]',
              isHero
                ? 'h-[52px] bg-white text-[var(--text-primary)] border-0'
                : 'h-11 bg-white border-2 border-r-0 border-[var(--border-strong)] focus:border-[var(--accent)]'
            )}
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={loading || !postalCode.trim()}
          className={cn(
            'font-semibold text-white rounded-r-xl transition-colors disabled:opacity-50 flex-shrink-0',
            isHero
              ? 'h-[52px] px-6 text-[14px] bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
              : 'h-11 px-5 text-[13px] bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Prüfen'}
        </button>
      </div>

      {result && (
        <div className={cn(
          'flex items-center gap-2 text-[13px] animate-fade-in',
          isHero ? 'text-white/90' : ''
        )}>
          {result.available ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span className="font-medium">
                Lieferung möglich — ca. {result.zone?.estimatedTime} Min. · CHF {result.zone?.deliveryFee.toFixed(2)}
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="font-medium">{result.message || 'Leider nicht verfügbar'}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
