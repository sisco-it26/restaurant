import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  })
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Kategorien</h1>
          <p className="text-stone-600 mt-2">Menü-Kategorien verwalten</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Kategorie hinzufügen
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-stone-900">{cat.name}</p>
                <p className="text-sm text-stone-500">{cat._count.products} Produkte • Reihenfolge: {cat.sortOrder}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}`}>
                  {cat.isActive ? 'Aktiv' : 'Inaktiv'}
                </span>
                <Button size="sm" variant="outline">Bearbeiten</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <Card><CardContent className="py-12 text-center text-stone-500">Keine Kategorien vorhanden</CardContent></Card>
        )}
      </div>
    </div>
  )
}
