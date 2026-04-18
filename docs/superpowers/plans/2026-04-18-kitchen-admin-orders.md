# Kitchen + Admin Orders — Funktions-Repair Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Kitchen-Buttons (Starten/Fertig/Abgeschlossen) funktionieren mit echten API-Calls; Kitchen-Board pollt alle 30 s; Admin-Bestellungen bekommen Status-Buttons.

**Architecture:** `OrderTicket` ruft `PATCH /api/orders/[id]` auf und aktualisiert den lokalen `orders`-State im `KitchenBoard` (Lift-State-Up). Kitchen-Board pollt via `setInterval`. Admin-Orders-Page wird zu einem Client Component mit Status-Buttons.

**Tech Stack:** Next.js 15, React 19, bestehende `PATCH /api/orders/[id]` API.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `components/kitchen/KitchenBoard.tsx` | State-Owner der Orders; exposes `onStatusChange` an OrderTicket; polling alle 30 s |
| Modify | `components/kitchen/OrderTicket.tsx` | Buttons rufen `onStatusChange(id, newStatus)` auf |
| Replace | `app/admin/orders/page.tsx` | Client Component mit Status-Buttons und PATCH-Calls |

---

## Task 1: KitchenBoard — Status-Handler + 30s Polling

**Files:**
- Modify: `components/kitchen/KitchenBoard.tsx`

- [ ] **Step 1: Ergänze `onStatusChange` und `fetchOrders` in KitchenBoard**

Ersetze den gesamten Inhalt von `components/kitchen/KitchenBoard.tsx` mit:

```tsx
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
      const res = await fetch('/api/orders?kitchen=1', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      // Filter to active statuses only
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
        // Revert on failure
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
```

- [ ] **Step 2: Typen prüfen**

```bash
cd /home/sisco/restaurantcms && npx tsc --noEmit 2>&1 | grep -i "KitchenBoard" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/kitchen/KitchenBoard.tsx
git commit -m "feat(kitchen): add status change handler and 30s polling"
```

---

## Task 2: OrderTicket — echte Buttons

**Files:**
- Modify: `components/kitchen/OrderTicket.tsx`

- [ ] **Step 1: Ersetze den gesamten Inhalt von `components/kitchen/OrderTicket.tsx`**

```tsx
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
```

- [ ] **Step 2: Typen prüfen**

```bash
cd /home/sisco/restaurantcms && npx tsc --noEmit 2>&1 | grep -i "OrderTicket\|KitchenBoard" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/kitchen/OrderTicket.tsx
git commit -m "feat(kitchen): wire status buttons to API with optimistic update"
```

---

## Task 3: Admin Orders — Status-Buttons

**Files:**
- Replace: `app/admin/orders/page.tsx`

- [ ] **Step 1: Ersetze den gesamten Inhalt von `app/admin/orders/page.tsx`**

```tsx
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
  status: keyof typeof statusLabels
  customerName: string
  deliveryAddress: string | null
  total: number
  createdAt: string
  items: OrderItem[]
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-stone-100 text-stone-800',
  CANCELLED: 'bg-red-100 text-red-800',
} as const

const statusLabels = {
  PENDING: 'Ausstehend',
  ACCEPTED: 'Angenommen',
  PREPARING: 'In Zubereitung',
  READY: 'Bereit',
  OUT_FOR_DELIVERY: 'Unterwegs',
  COMPLETED: 'Abgeschlossen',
  CANCELLED: 'Storniert',
} as const

// Which statuses can transition to which
const TRANSITIONS: Partial<Record<string, { label: string; next: string }[]>> = {
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
```

- [ ] **Step 2: Typen prüfen**

```bash
cd /home/sisco/restaurantcms && npx tsc --noEmit 2>&1 | grep -i "admin/orders" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/orders/page.tsx
git commit -m "feat(admin/orders): add status transition buttons with API integration"
```
