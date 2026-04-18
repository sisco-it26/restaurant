import { prisma } from '@/lib/db'
import { KitchenBoard } from '@/components/kitchen/KitchenBoard'

async function getActiveOrders() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'],
      },
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'asc' },
  })
  return orders.map((order) => ({
    ...order,
    deliveryFee: Number(order.deliveryFee),
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    })),
  }))
}

export default async function KitchenPage() {
  const orders = await getActiveOrders()

  return <KitchenBoard initialOrders={orders} />
}
