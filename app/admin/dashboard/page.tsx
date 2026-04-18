import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

async function getDashboardStats() {
  const [totalOrders, pendingOrders, todayRevenue, completedToday] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      _sum: { total: true },
    }),
    prisma.order.count({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])

  return {
    totalOrders,
    pendingOrders,
    todayRevenue: Number(todayRevenue._sum.total || 0),
    completedToday,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-600 mt-2">Übersicht über Ihr Restaurant</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Bestellungen heute
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Umsatz heute
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.todayRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Ausstehend
            </CardTitle>
            <Clock className="w-4 h-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Gesamt
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
