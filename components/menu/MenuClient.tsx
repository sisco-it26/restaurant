'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type MenuCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  products: MenuProduct[]
}

export type MenuProduct = {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: number
  allergens: string[]
  additives: string[]
  variants: MenuVariant[]
  addons: MenuAddon[]
}

export type MenuVariant = {
  id: string
  name: string
  priceModifier: number
}

export type MenuAddon = {
  id: string
  name: string
  price: number
}

export function MenuClient({ categories }: { categories: MenuCategory[] }) {
  const { orderType, setOrderType, addItem } = useCart()

  function addToCartSimple(product: MenuProduct) {
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      basePrice: product.basePrice,
      quantity: 1,
      variant: undefined,
      addons: [],
      notes: undefined,
    })
  }

  function openModal(product: MenuProduct) {
    // stub — implemented in Task 3
    console.log('open modal for', product.name)
  }

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
        <Button
          variant={orderType === 'DELIVERY' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setOrderType('DELIVERY')}
          aria-pressed={orderType === 'DELIVERY'}
        >
          Lieferung
        </Button>
        <Button
          variant={orderType === 'PICKUP' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setOrderType('PICKUP')}
          aria-pressed={orderType === 'PICKUP'}
        >
          Abholung
        </Button>
      </div>

      {/* Categories placeholder */}
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
                        {formatPrice(product.basePrice)}
                      </span>
                      {product.variants.length === 0 ? (
                        <Button size="sm" onClick={() => addToCartSimple(product)}>
                          <Plus className="w-4 h-4 mr-1" />
                          Hinzufügen
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => openModal(product)}>
                          <Plus className="w-4 h-4 mr-1" />
                          Auswählen
                        </Button>
                      )}
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
