import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Plus } from 'lucide-react'

async function getMenuData() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      products: {
        where: { isActive: true, isAvailable: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })
  return categories
}

export default async function MenuPage() {
  const categories = await getMenuData()

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-stone-900">
          Unsere Speisekarte
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Entdecken Sie unsere vielfältige Auswahl an frisch zubereiteten Gerichten
        </p>
      </div>

      {/* Order Type Toggle */}
      <div className="flex justify-center gap-4 p-4 bg-white rounded-lg border border-stone-200 max-w-md mx-auto">
        <Button variant="default" className="flex-1">
          Lieferung
        </Button>
        <Button variant="outline" className="flex-1">
          Abholung
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.id} id={category.slug}>
            <h2 className="font-display text-3xl font-bold text-stone-900 mb-6">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-stone-600 mb-6">{category.description}</p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-stone-200" />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        {product.description && (
                          <CardDescription className="mt-2 line-clamp-2">
                            {product.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-semibold text-moss-600">
                        {formatPrice(Number(product.basePrice))}
                      </span>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Hinzufügen
                      </Button>
                    </div>
                    {(product.allergens.length > 0 || product.additives.length > 0) && (
                      <div className="mt-3 pt-3 border-t border-stone-200">
                        <p className="text-xs text-stone-500">
                          {[...product.allergens, ...product.additives].join(', ')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
