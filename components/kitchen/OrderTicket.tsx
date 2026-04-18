'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDistance } from 'date-fns'
import { de } from 'date-fns/locale'
import { Clock, MapPin, Package } from 'lucide-react'

type Order = {
  id: string
  orderNumber: string
  type: 'DELIVERY' | 'PICKUP'
  status: string
  customerName: string
  deliveryAddress: string | null
  notes: string | null
  createdAt: Date
  items: Array<{
    id: string
    productName: string
    quantity: number
    variant: string | null
    addons: string[]
    notes: string | null
  }>
}

export function OrderTicket({ order }: { order: Order }) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-stone-900">
              #{order.orderNumber}
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              {order.customerName}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Clock className="w-4 h-4" />
            {formatDistance(order.createdAt, new Date(), { addSuffix: true, locale: de })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          {order.type === 'DELIVERY' ? (
            <>
              <MapPin className="w-4 h-4 text-moss-600" />
              <span className="font-medium text-moss-700">Lieferung</span>
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
                <p className="text-sm text-stone-600 pl-4">
                  + {item.addons.join(', ')}
                </p>
              )}
              {item.notes && (
                <p className="text-sm text-salmon-700 pl-4 italic">
                  Hinweis: {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm font-medium text-yellow-900">
              Bestellnotiz: {order.notes}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {order.status === 'PENDING' && (
            <Button className="flex-1" size="lg">
              Starten
            </Button>
          )}
          {order.status === 'PREPARING' && (
            <Button className="flex-1" size="lg" variant="default">
              Fertig
            </Button>
          )}
          {order.status === 'READY' && (
            <Button className="flex-1" size="lg" variant="secondary">
              Abgeschlossen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
