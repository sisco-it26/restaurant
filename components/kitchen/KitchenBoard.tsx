'use client'

import { useState, useEffect, useCallback } from 'react'
import { OrderTicket } from './OrderTicket'

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

export function KitchenBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      const active = data.filter((o: Order) =>
        ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status)
      )
      setOrders(active)
    } catch {
      // silent — don't crash the board on network error
    }
  }, [])

  // Poll every 30 s
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30_000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const handleStatusChange = useCallback(async (orderId: string, newStatus: string) => {
    // Optimistic update
    setOrders((prev) =>
      prev
        .map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        .filter((o) => ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status))
    )
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        await fetchOrders()
      }
    } catch {
      await fetchOrders()
    }
  }, [fetchOrders])

  const pendingOrders = orders.filter((o) => o.status === 'PENDING')
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING' || o.status === 'ACCEPTED')
  const readyOrders = orders.filter((o) => o.status === 'READY')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">Küche</h1>
        <div className="text-white text-sm">{orders.length} aktive Bestellungen</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">
            Neu ({pendingOrders.length})
          </h2>
          {pendingOrders.map((order) => (
            <OrderTicket key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">
            In Zubereitung ({preparingOrders.length})
          </h2>
          {preparingOrders.map((order) => (
            <OrderTicket key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">
            Bereit ({readyOrders.length})
          </h2>
          {readyOrders.map((order) => (
            <OrderTicket key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      </div>
    </div>
  )
}
