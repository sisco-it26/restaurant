'use client'

import { useState } from 'react'
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

  const [modalProduct, setModalProduct] = useState<MenuProduct | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<MenuAddon[]>([])

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
    setModalProduct(product)
    setSelectedVariant(product.variants[0] ?? null)
    setSelectedAddons([])
  }

  function closeModal() {
    setModalProduct(null)
    setSelectedVariant(null)
    setSelectedAddons([])
  }

  function toggleAddon(addon: MenuAddon) {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  function computeModalPrice(): number {
    if (!modalProduct) return 0
    return (
      modalProduct.basePrice +
      (selectedVariant?.priceModifier ?? 0) +
      selectedAddons.reduce((sum, a) => sum + a.price, 0)
    )
  }

  function addToCartFromModal() {
    if (!modalProduct) return
    addItem({
      productId: modalProduct.id,
      productName: modalProduct.name,
      productSlug: modalProduct.slug,
      basePrice: modalProduct.basePrice,
      quantity: 1,
      variant: selectedVariant
        ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            priceModifier: selectedVariant.priceModifier,
          }
        : undefined,
      addons: selectedAddons.map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
      })),
      notes: undefined,
    })
    closeModal()
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
                      {product.variants.length === 0 && product.addons.length === 0 ? (
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

      {/* Variant/Addon Modal */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-stone-900">
                    {modalProduct.name}
                  </h3>
                  {modalProduct.description && (
                    <p className="text-sm text-stone-600 mt-1">{modalProduct.description}</p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="text-stone-400 hover:text-stone-600 text-2xl leading-none ml-4"
                  aria-label="Schliessen"
                >
                  ×
                </button>
              </div>

              {/* Variants */}
              {modalProduct.variants.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-stone-900 text-sm">Grösse wählen</p>
                  {modalProduct.variants.map((variant) => (
                    <label
                      key={variant.id}
                      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors"
                      style={{
                        borderColor: selectedVariant?.id === variant.id ? '#5a7a52' : '#e7e5e4',
                        backgroundColor: selectedVariant?.id === variant.id ? '#f0f4ef' : 'white',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="variant"
                          checked={selectedVariant?.id === variant.id}
                          onChange={() => setSelectedVariant(variant)}
                          className="text-moss-600"
                        />
                        <span className="text-sm font-medium text-stone-900">{variant.name}</span>
                      </div>
                      <span className="text-sm text-stone-600">
                        {variant.priceModifier > 0
                          ? `+${formatPrice(variant.priceModifier)}`
                          : variant.priceModifier < 0
                          ? `${formatPrice(variant.priceModifier)}`
                          : 'Inklusive'}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Addons */}
              {modalProduct.addons.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-stone-900 text-sm">Extras hinzufügen</p>
                  {modalProduct.addons.map((addon) => {
                    const checked = selectedAddons.some((a) => a.id === addon.id)
                    return (
                      <label
                        key={addon.id}
                        className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors"
                        style={{
                          borderColor: checked ? '#5a7a52' : '#e7e5e4',
                          backgroundColor: checked ? '#f0f4ef' : 'white',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAddon(addon)}
                            className="text-moss-600"
                          />
                          <span className="text-sm font-medium text-stone-900">{addon.name}</span>
                        </div>
                        <span className="text-sm text-stone-600">+{formatPrice(addon.price)}</span>
                      </label>
                    )
                  })}
                </div>
              )}

              {/* Add to Cart */}
              <div className="border-t border-stone-200 pt-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={addToCartFromModal}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Hinzufügen — {formatPrice(computeModalPrice())}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
