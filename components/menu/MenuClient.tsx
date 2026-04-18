'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Plus, Minus, X, Check, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const CATEGORY_EMOJIS: Record<string, string> = {
  vorspeisen: '🥗', salate: '🥗', suppen: '🍜', burger: '🍔', pizza: '🍕',
  pasta: '🍝', hauptgerichte: '🍽️', desserts: '🍰', getränke: '🥤',
  beilagen: '🍟', sushi: '🍣', grill: '🥩', frühstück: '🥐', bowls: '🥙',
}

function getEmoji(slug: string): string {
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (slug.toLowerCase().includes(key)) return emoji
  }
  return '🍽️'
}

export function MenuClient({ categories }: { categories: MenuCategory[] }) {
  const { orderType, setOrderType, addItem } = useCart()

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')
  const [modalProduct, setModalProduct] = useState<MenuProduct | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<MenuAddon[]>([])
  const [modalQty, setModalQty] = useState(1)
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const navRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // IntersectionObserver for active category tracking
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id)
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    )

    sectionRefs.current.forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [categories])

  // Scroll active pill into view
  useEffect(() => {
    if (!navRef.current) return
    const activeBtn = navRef.current.querySelector(`[data-cat="${activeCategory}"]`)
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeCategory])

  function scrollToCategory(id: string) {
    const el = sectionRefs.current.get(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 130
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

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
    setSelectedVariant(null)
    setSelectedAddons([])
    setModalQty(1)
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
      (modalProduct.basePrice +
        (selectedVariant?.priceModifier ?? 0) +
        selectedAddons.reduce((sum, a) => sum + a.price, 0)) * modalQty
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
  }, [])

  return (
    <div className="min-h-screen">
      {/* ── Sticky Category Nav ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-[var(--border)]">
        <div className="container">
          {/* Order type toggle */}
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setOrderType('DELIVERY')}
                className={cn(
                  'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                  orderType === 'DELIVERY'
                    ? 'bg-white text-[var(--text-primary)] shadow-[var(--shadow-xs)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                🛵 Lieferung
              </button>
              <button
                onClick={() => setOrderType('PICKUP')}
                className={cn(
                  'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                  orderType === 'PICKUP'
                    ? 'bg-white text-[var(--text-primary)] shadow-[var(--shadow-xs)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                🏪 Abholung
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div ref={navRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-2 px-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-sm)]'
                    : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200 hover:text-[var(--text-primary)]'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Sections ── */}
      <div className="container py-8 space-y-12">
        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            ref={setSectionRef(category.id)}
          >
            <div className="mb-5">
              <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-sm text-[var(--text-secondary)] mt-1">{category.description}</p>
              )}
            </div>

            <div className="grid gap-3">
              {category.products.map((product) => {
                const isAdded = addedProductId === product.id
                const hasOptions = product.variants.length > 0 || product.addons.length > 0
                const emoji = getEmoji(category.slug)

                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 bg-white border border-[var(--border)] rounded-2xl hover:shadow-[var(--shadow-md)] hover:border-transparent transition-all duration-200 group"
                  >
                    {/* Image placeholder */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-subtle)] flex items-center justify-center text-4xl">
                      {emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="font-display text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                        {(product.allergens.length > 0 || product.additives.length > 0) && (
                          <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5">
                            {[...product.allergens, ...product.additives].join(' · ')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="font-display text-lg font-bold text-[var(--text-primary)]">
                          {formatPrice(product.basePrice)}
                        </span>

                        {hasOptions ? (
                          <button
                            onClick={() => openModal(product)}
                            className="flex items-center gap-1.5 h-9 px-4 text-sm font-semibold rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[var(--shadow-sm)] transition-all active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Wählen
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCartSimple(product)}
                            className={cn(
                              'flex items-center justify-center w-9 h-9 rounded-full shadow-[var(--shadow-sm)] transition-all duration-300 active:scale-90',
                              isAdded
                                ? 'bg-[var(--success)] text-white'
                                : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-md)]'
                            )}
                          >
                            {isAdded ? (
                              <Check className="w-4 h-4 animate-checkmark" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-20">
            <ShoppingCart className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2">Keine Gerichte verfügbar</h3>
            <p className="text-[var(--text-secondary)]">Bitte versuchen Sie es später erneut.</p>
          </div>
        )}
      </div>

      {/* ── Variant/Addon Modal ── */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl shadow-[var(--shadow-xl)] max-h-[85vh] flex flex-col animate-slide-up md:animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-0">
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  {modalProduct.name}
                </h3>
                {modalProduct.description && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{modalProduct.description}</p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-[var(--text-secondary)] transition-colors ml-3 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Variants */}
              {modalProduct.variants.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">Grösse wählen</p>
                  {modalProduct.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          'flex items-center justify-between w-full p-3.5 rounded-xl border-2 transition-all duration-200',
                          isSelected
                            ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                            : 'border-[var(--border)] hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                            isSelected ? 'border-[var(--accent)]' : 'border-gray-300'
                          )}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />}
                          </div>
                          <span className="text-sm font-semibold text-[var(--text-primary)]">{variant.name}</span>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                          {variant.priceModifier > 0
                            ? `+${formatPrice(variant.priceModifier)}`
                            : variant.priceModifier < 0
                            ? formatPrice(variant.priceModifier)
                            : 'Inklusive'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Addons */}
              {modalProduct.addons.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">Extras</p>
                  {modalProduct.addons.map((addon) => {
                    const checked = selectedAddons.some((a) => a.id === addon.id)
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={cn(
                          'flex items-center justify-between w-full p-3.5 rounded-xl border-2 transition-all duration-200',
                          checked
                            ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                            : 'border-[var(--border)] hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors',
                            checked ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-gray-300'
                          )}>
                            {checked && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm font-semibold text-[var(--text-primary)]">{addon.name}</span>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-secondary)]">+{formatPrice(addon.price)}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sticky footer */}
            <div className="p-5 pt-3 border-t border-[var(--border)] bg-white rounded-b-2xl">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{modalQty}</span>
                  <button
                    onClick={() => setModalQty(modalQty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add button */}
                <button
                  onClick={addToCartFromModal}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all active:scale-[0.98]"
                >
                  In den Warenkorb — {formatPrice(computeModalPrice())}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
