import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return orders
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-stone-100 text-stone-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const statusLabels = {
  PENDING: 'Ausstehend',
  ACCEPTED: 'Angenommen',
  PREPARING: 'In Zubereitung',
  READY: 'Bereit',
  OUT_FOR_DELIVERY: 'Unterwegs',
  COMPLETED: 'Abgeschlossen',
  CANCELLED: 'Storniert',
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Bestellungen</h1>
          <p className="text-stone-600 mt-2">Verwalten Sie alle Bestellungen</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">#{order.orderNumber}</CardTitle>
                  <p className="text-sm text-stone-600 mt-1">
                    {format(order.createdAt, 'dd.MM.yyyy HH:mm', { locale: de })} • {order.customerName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <span className="font-display text-lg font-semibold text-stone-900">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-stone-700">Typ:</span>
                  <span className="text-stone-600">
                    {order.type === 'DELIVERY' ? 'Lieferung' : 'Abholung'}
                  </span>
                </div>
                {order.deliveryAddress && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-stone-700">Adresse:</span>
                    <span className="text-stone-600">{order.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-stone-700">Artikel:</span>
                  <span className="text-stone-600">{order.items.length} Positionen</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-stone-600">Noch keine Bestellungen vorhanden</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
