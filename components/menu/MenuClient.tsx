'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'

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
  const { orderType, setOrderType } = useCart()

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
        >
          Lieferung
        </Button>
        <Button
          variant={orderType === 'PICKUP' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setOrderType('PICKUP')}
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
                <div key={product.id} className="p-4 bg-white rounded-lg border border-stone-200">
                  <p className="font-medium">{product.name}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
