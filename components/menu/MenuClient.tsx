'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useCart } from '@/hooks/use-cart'
import { ShoppingCart, Star, Clock, Truck, MapPin } from 'lucide-react'

import { MenuSearchBar } from './MenuSearchBar'
import { FulfillmentSwitch } from './FulfillmentSwitch'
import { CategoryCarousel } from './CategoryCarousel'
import { CategorySection } from './CategorySection'
import { ProductModal } from './ProductModal'

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

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  const [modalProduct, setModalProduct] = useState<MenuProduct | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<MenuAddon[]>([])
  const [modalQty, setModalQty] = useState(1)

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const isScrollingProgrammatically = useRef(false)

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories
      .map((cat) => ({
        ...cat,
        products: cat.products.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.products.length > 0)
  }, [categories, searchQuery])

  // IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingProgrammatically.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveCategory(entry.target.id)
        }
      },
      { rootMargin: '-130px 0px -65% 0px', threshold: 0 }
    )
    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [filteredCategories])

  function scrollToCategory(id: string) {
    setActiveCategory(id)
    const el = sectionRefs.current.get(id)
    if (!el) return
    isScrollingProgrammatically.current = true
    const top = el.getBoundingClientRect().top + window.scrollY - 145
    window.scrollTo({ top, behavior: 'smooth' })
    setTimeout(() => { isScrollingProgrammatically.current = false }, 600)
  }

  function addToCartSimple(product: MenuProduct) {
    addItem({
      productId: product.id, productName: product.name, productSlug: product.slug,
      basePrice: product.basePrice, quantity: 1, variant: undefined, addons: [], notes: undefined,
    })
    setAddedProductId(product.id)
    setTimeout(() => setAddedProductId(null), 1500)
  }

  function openModal(product: MenuProduct) {
    setModalProduct(product)
    setSelectedVariant(product.variants[0] ?? null)
    setSelectedAddons([])
    setModalQty(1)
  }

  function closeModal() { setModalProduct(null) }

  function toggleAddon(addon: MenuAddon) {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  function addToCartFromModal() {
    if (!modalProduct) return
    addItem({
      productId: modalProduct.id, productName: modalProduct.name, productSlug: modalProduct.slug,
      basePrice: modalProduct.basePrice, quantity: modalQty,
      variant: selectedVariant
        ? { id: selectedVariant.id, name: selectedVariant.name, priceModifier: selectedVariant.priceModifier }
        : undefined,
      addons: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
      notes: undefined,
    })
    closeModal()
  }

  const setSectionRef = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el)
    else sectionRefs.current.delete(id)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* ═══ RESTAURANT HEADER ═══ */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="px-4 md:container py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-[20px] font-extrabold text-[var(--text-primary)] leading-tight">
                Bistro Zürich
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                  <span className="text-[13px] font-bold text-[var(--text-primary)]">4.8</span>
                  <span className="text-[12px] text-[var(--text-tertiary)]">(200+)</span>
                </div>
                <span className="text-[var(--border-strong)]">·</span>
                <span className="text-[12px] text-[var(--text-secondary)] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Musterstrasse 12
                </span>
              </div>
            </div>
          </div>

          {/* Info chips */}
          <div className="flex gap-3 mt-3 overflow-x-auto scrollbar-hide">
            {[
              { icon: Clock, text: '30–45 Min' },
              { icon: Truck, text: 'CHF 3.90 Lieferung' },
              { text: 'Ab CHF 20 Bestellung' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-1 text-[12px] text-[var(--text-secondary)] bg-[#F0EFEB] px-2.5 py-1 rounded-md whitespace-nowrap flex-shrink-0">
                {Icon && <Icon className="w-3 h-3" />}
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STICKY NAV ═══ */}
      <div className="sticky top-16 z-30 bg-white border-b border-[var(--border)]">
        <div className="px-4 md:container space-y-2 py-2.5">
          <MenuSearchBar value={searchQuery} onChange={setSearchQuery} />
          <FulfillmentSwitch value={orderType} onChange={setOrderType} />
          {filteredCategories.length > 0 && (
            <CategoryCarousel
              categories={filteredCategories.map((c) => ({ id: c.id, name: c.name }))}
              activeId={activeCategory}
              onSelect={scrollToCategory}
            />
          )}
        </div>
      </div>

      {/* ═══ MENU ═══ */}
      <div className="px-4 md:container py-4 space-y-6 pb-28">
        {filteredCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            addedProductId={addedProductId}
            onAddSimple={addToCartSimple}
            onOpenModal={openModal}
            sectionRef={setSectionRef(category.id)}
          />
        ))}

        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-[14px] font-bold text-[var(--text-primary)]">Keine Ergebnisse</p>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Nichts für &quot;{searchQuery}&quot; gefunden.
            </p>
          </div>
        )}

        {!searchQuery && categories.length === 0 && (
          <div className="text-center py-16">
            <ShoppingCart className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[14px] font-bold text-[var(--text-primary)]">Keine Gerichte verfügbar</p>
          </div>
        )}
      </div>

      {/* ═══ MODAL ═══ */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          selectedVariant={selectedVariant}
          selectedAddons={selectedAddons}
          quantity={modalQty}
          onSelectVariant={setSelectedVariant}
          onToggleAddon={toggleAddon}
          onQuantityChange={setModalQty}
          onAdd={addToCartFromModal}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
