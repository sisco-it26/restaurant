'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDistance } from 'date-fns'
import { de } from 'date-fns/locale'
import { Clock, MapPin, Package } from 'lucide-react'

type OrderItem = {
  id: string
  productName: string
  quantity: number
  variant: string | null
  addons: string[]
  notes: string | null
}

type Order = {
  id: string
  orderNumber: string
  type: 'DELIVERY' | 'PICKUP'
  status: string
  customerName: string
  deliveryAddress: string | null
  notes: string | null
  createdAt: Date
  items: OrderItem[]
}

type Props = {
  order: Order
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>
}

const NEXT_STATUS: Record<string, string> = {
  PENDING: 'PREPARING',
  ACCEPTED: 'PREPARING',
  PREPARING: 'READY',
  READY: 'COMPLETED',
}

const BUTTON_LABELS: Record<string, string> = {
  PENDING: 'Starten',
  ACCEPTED: 'Starten',
  PREPARING: 'Fertig',
  READY: 'Abgeschlossen',
}

export function OrderTicket({ order, onStatusChange }: Props) {
  const [timeAgo, setTimeAgo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    function update() {
      setTimeAgo(
        formatDistance(new Date(order.createdAt), new Date(), {
          addSuffix: true,
          locale: de,
        })
      )
    }
    update()
    const interval = setInterval(update, 30_000)
    return () => clearInterval(interval)
  }, [order.createdAt])

  async function handleAction() {
    const nextStatus = NEXT_STATUS[order.status]
    if (!nextStatus) return
    setLoading(true)
    await onStatusChange(order.id, nextStatus)
    setLoading(false)
  }

  const buttonLabel = BUTTON_LABELS[order.status]

  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-stone-900">
              #{order.orderNumber}
            </h3>
            <p className="text-sm text-stone-600 mt-1">{order.customerName}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Clock className="w-4 h-4" />
            {timeAgo ?? '…'}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          {order.type === 'DELIVERY' ? (
            <>
              <MapPin className="w-4 h-4 text-moss-600" />
              <span className="font-medium text-moss-700">Lieferung</span>
              {order.deliveryAddress && (
                <span className="text-stone-500 text-xs truncate">{order.deliveryAddress}</span>
              )}
            </>
          ) : (
            <>
              <Package className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-700">Abholung</span>
            </>
          )}
        </div>

        <div className="space-y-2 border-t border-stone-200 pt-3">
          {order.items.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-start justify-between">
                <span className="font-medium text-stone-900">
                  {item.quantity}x {item.productName}
                </span>
              </div>
              {item.variant && (
                <p className="text-sm text-stone-600 pl-4">• {item.variant}</p>
              )}
              {item.addons.length > 0 && (
                <p className="text-sm text-stone-600 pl-4">+ {item.addons.join(', ')}</p>
              )}
              {item.notes && (
                <p className="text-sm text-salmon-700 pl-4 italic">Hinweis: {item.notes}</p>
              )}
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm font-medium text-yellow-900">Bestellnotiz: {order.notes}</p>
          </div>
        )}

        {buttonLabel && (
          <div className="pt-2">
            <Button
              className="w-full"
              size="lg"
              onClick={handleAction}
              disabled={loading}
            >
              {loading ? 'Wird gespeichert…' : buttonLabel}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
