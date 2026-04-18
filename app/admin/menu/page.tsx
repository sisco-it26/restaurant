import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Plus } from 'lucide-react'

async function getMenuData() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })
  return categories
}

export default async function MenuManagementPage() {
  const categories = await getMenuData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Menü</h1>
          <p className="text-stone-600 mt-2">Verwalten Sie Ihre Speisekarte</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Produkt hinzufügen
        </Button>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-stone-900">{product.name}</p>
                      <p className="text-sm text-stone-600 line-clamp-1">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display font-semibold text-stone-900">
                        {formatPrice(Number(product.basePrice))}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'Verfügbar' : 'Nicht verfügbar'}
                        </span>
                        <Button size="sm" variant="outline">Bearbeiten</Button>
                      </div>
                    </div>
                  </div>
                ))}
                {category.products.length === 0 && (
                  <p className="text-sm text-stone-500 text-center py-4">
                    Keine Produkte in dieser Kategorie
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
