'use client'

import { useState, useEffect } from 'react'
import { OrderTicket } from './OrderTicket'
import { formatDistance } from 'date-fns'
import { de } from 'date-fns/locale'

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

export function KitchenBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)

  const pendingOrders = orders.filter(o => o.status === 'PENDING')
  const preparingOrders = orders.filter(o => o.status === 'PREPARING')
  const readyOrders = orders.filter(o => o.status === 'READY')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">
          Küche
        </h1>
        <div className="text-white text-sm">
          {orders.length} aktive Bestellungen
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">
            Neu ({pendingOrders.length})
          </h2>
          {pendingOrders.map(order => (
            <OrderTicket key={order.id} order={order} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">
            In Zubereitung ({preparingOrders.length})
          </h2>
          {preparingOrders.map(order => (
            <OrderTicket key={order.id} order={order} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">
            Bereit ({readyOrders.length})
          </h2>
          {readyOrders.map(order => (
            <OrderTicket key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
}
