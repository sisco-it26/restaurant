'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react'

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
    } catch (error) {
      console.error('Failed to validate postal code:', error)
      setResult({
        available: false,
        message: 'Fehler bei der Validierung. Bitte versuchen Sie es erneut.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-moss-600" />
            <h3 className="font-display text-lg font-semibold">Liefergebiet prüfen</h3>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Postleitzahl eingeben"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              maxLength={4}
              className="flex-1"
            />
            <Button onClick={handleCheck} disabled={loading || !postalCode.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Prüfen'}
            </Button>
          </div>

          {result && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
                result.available ? 'bg-moss-50 border border-moss-200' : 'bg-salmon-50 border border-salmon-200'
              }`}
            >
              {result.available ? (
                <CheckCircle className="w-5 h-5 text-moss-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-salmon-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                {result.available && result.zone ? (
                  <>
                    <p className="font-medium text-moss-900">Lieferung möglich!</p>
                    <p className="text-sm text-moss-700 mt-1">
                      Zone: {result.zone.name} • Liefergebühr: CHF {result.zone.deliveryFee.toFixed(2)} •
                      ca. {result.zone.estimatedTime} Min.
                    </p>
                    {result.zone.minOrderAmount && (
                      <p className="text-xs text-moss-600 mt-1">
                        Mindestbestellwert: CHF {result.zone.minOrderAmount.toFixed(2)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-salmon-900">{result.message}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
