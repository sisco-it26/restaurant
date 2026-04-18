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
  return orders
}

export default async function KitchenPage() {
  const orders = await getActiveOrders()

  return <KitchenBoard initialOrders={orders} />
}
