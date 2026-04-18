import { prisma } from '@/lib/db'
import { MenuClient, type MenuCategory } from '@/components/menu/MenuClient'

async function getMenuData(): Promise<MenuCategory[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      products: {
        where: { isActive: true, isAvailable: true },
        include: {
          variants: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
          },
          addons: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })

  // Prisma Decimal → plain number for client serialization
  return categories.map((cat) => ({
    ...cat,
    products: cat.products.map((p) => ({
      ...p,
      basePrice: Number(p.basePrice),
      variants: p.variants.map((v) => ({
        ...v,
        priceModifier: Number(v.priceModifier),
      })),
      addons: p.addons.map((a) => ({
        ...a,
        price: Number(a.price),
      })),
    })),
  }))
}

export default async function MenuPage() {
  const categories = await getMenuData()
  return <MenuClient categories={categories} />
}
