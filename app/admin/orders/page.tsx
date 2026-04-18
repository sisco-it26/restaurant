'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

type OrderItem = {
  id: string
  productName: string
  quantity: number
}

type Order = {
  id: string
  orderNumber: string
  type: 'DELIVERY' | 'PICKUP'
  status: string
  customerName: string
  deliveryAddress: string | null
  total: number
  createdAt: string
  items: OrderItem[]
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-stone-100 text-stone-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Ausstehend',
  ACCEPTED: 'Angenommen',
  PREPARING: 'In Zubereitung',
  READY: 'Bereit',
  OUT_FOR_DELIVERY: 'Unterwegs',
  COMPLETED: 'Abgeschlossen',
  CANCELLED: 'Storniert',
}

const TRANSITIONS: Record<string, { label: string; next: string }[]> = {
  PENDING: [
    { label: 'Annehmen', next: 'ACCEPTED' },
    { label: 'Stornieren', next: 'CANCELLED' },
  ],
  ACCEPTED: [{ label: 'Zubereitung starten', next: 'PREPARING' }],
  PREPARING: [{ label: 'Fertig', next: 'READY' }],
  READY: [
    { label: 'Zur Auslieferung', next: 'OUT_FOR_DELIVERY' },
    { label: 'Abgeschlossen', next: 'COMPLETED' },
  ],
  OUT_FOR_DELIVERY: [{ label: 'Abgeschlossen', next: 'COMPLETED' }],
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  async function handleTransition(orderId: string, newStatus: string) {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const updated = await res.json()
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
        )
      }
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl font-bold text-stone-900">Bestellungen</h1>
        <p className="text-stone-500">Wird geladen…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Bestellungen</h1>
          <p className="text-stone-600 mt-2">Verwalten Sie alle Bestellungen</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          Aktualisieren
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const transitions = TRANSITIONS[order.status] ?? []
          const isUpdating = updatingId === order.id

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle className="text-lg">#{order.orderNumber}</CardTitle>
                    <p className="text-sm text-stone-600 mt-1">
                      {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })} •{' '}
                      {order.customerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status] ?? 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                    <span className="font-display text-lg font-semibold text-stone-900">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
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

                {transitions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-200">
                    {transitions.map(({ label, next }) => (
                      <Button
                        key={next}
                        size="sm"
                        variant={next === 'CANCELLED' ? 'outline' : 'default'}
                        disabled={isUpdating}
                        onClick={() => handleTransition(order.id, next)}
                        className={next === 'CANCELLED' ? 'border-red-200 text-red-700 hover:bg-red-50' : ''}
                      >
                        {isUpdating ? 'Wird gespeichert…' : label}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

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
