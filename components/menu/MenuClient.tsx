'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useCart } from '@/hooks/use-cart'
import { ShoppingCart } from 'lucide-react'

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

  // ── State ──
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  // Modal state
  const [modalProduct, setModalProduct] = useState<MenuProduct | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<MenuAddon[]>([])
  const [modalQty, setModalQty] = useState(1)

  // Refs for scroll tracking
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const isScrollingProgrammatically = useRef(false)

  // ── Filtered categories ──
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories
      .map((cat) => ({
        ...cat,
        products: cat.products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.products.length > 0)
  }, [categories, searchQuery])

  // ── IntersectionObserver for active category ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingProgrammatically.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id)
          }
        }
      },
      { rootMargin: '-140px 0px -65% 0px', threshold: 0 }
    )

    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [filteredCategories])

  // ── Scroll to category ──
  function scrollToCategory(id: string) {
    setActiveCategory(id)
    const el = sectionRefs.current.get(id)
    if (!el) return

    isScrollingProgrammatically.current = true
    const top = el.getBoundingClientRect().top + window.scrollY - 155
    window.scrollTo({ top, behavior: 'smooth' })

    // Re-enable observer after scroll settles
    setTimeout(() => {
      isScrollingProgrammatically.current = false
    }, 600)
  }

  // ── Cart actions ──
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
    setAddedProductId(product.id)
    setTimeout(() => setAddedProductId(null), 1500)
  }

  function openModal(product: MenuProduct) {
    setModalProduct(product)
    setSelectedVariant(product.variants[0] ?? null)
    setSelectedAddons([])
    setModalQty(1)
  }

  function closeModal() {
    setModalProduct(null)
  }

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
      productId: modalProduct.id,
      productName: modalProduct.name,
      productSlug: modalProduct.slug,
      basePrice: modalProduct.basePrice,
      quantity: modalQty,
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
      {/* ═══════════════════════════════════════════
          STICKY TOP HEADER
          Search → Switch → Categories
          ═══════════════════════════════════════════ */}
      <div className="sticky top-16 z-30 bg-white border-b border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="px-4 md:container space-y-2.5 py-3">
          {/* Search */}
          <MenuSearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Fulfillment switch */}
          <FulfillmentSwitch value={orderType} onChange={setOrderType} />

          {/* Category carousel */}
          {filteredCategories.length > 0 && (
            <CategoryCarousel
              categories={filteredCategories.map((c) => ({ id: c.id, name: c.name }))}
              activeId={activeCategory}
              onSelect={scrollToCategory}
            />
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MENU CONTENT
          ═══════════════════════════════════════════ */}
      <div className="px-4 md:container py-5 space-y-8 pb-28">
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

        {/* Empty search state */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--text-tertiary)] text-4xl mb-4">🔍</p>
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
              Keine Ergebnisse
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Keine Gerichte für &quot;{searchQuery}&quot; gefunden.
            </p>
          </div>
        )}

        {/* Empty menu state */}
        {!searchQuery && categories.length === 0 && (
          <div className="text-center py-20">
            <ShoppingCart className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
              Keine Gerichte verfügbar
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Bitte versuchen Sie es später erneut.
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          PRODUCT MODAL / BOTTOM SHEET
          ═══════════════════════════════════════════ */}
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
