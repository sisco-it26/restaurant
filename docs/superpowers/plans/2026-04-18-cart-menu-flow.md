# Cart/Menu Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make /menu fully interactive (add-to-cart, variants, addons, order type toggle) and /cart fully functional (read store, change quantity, remove items, show correct totals).

**Architecture:** `/menu` is split into a thin Server Component (data fetch) and a `'use client'` `MenuClient` that owns all UI state (selected order type, open product modals, cart writes). `/cart` becomes a pure `'use client'` component that reads the Zustand persist store via `useCart()`. No new APIs needed — all existing `/api/menu` and cart-store logic is reused.

**Tech Stack:** Next.js 15 App Router, Zustand 5 (persist), React 19, TypeScript, Tailwind, existing `useCart` hook, existing `useCartStore`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `components/menu/MenuClient.tsx` | Full client-side menu UI: order-type toggle, product cards, variant/addon selection modal, cart writes |
| Modify | `app/(public)/menu/page.tsx` | Thin server component: fetch categories+products+variants+addons, pass to MenuClient |
| Replace | `app/(public)/cart/page.tsx` | `'use client'` cart page: read useCart, show items, qty controls, remove, totals |

---

## Task 1: MenuClient skeleton — order-type toggle

**Files:**
- Create: `components/menu/MenuClient.tsx`

- [ ] **Step 1: Create the file with order-type state only**

```tsx
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
```

- [ ] **Step 2: Update `app/(public)/menu/page.tsx` to use MenuClient**

Replace the entire file content with:

```tsx
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
```

- [ ] **Step 3: Verify the page renders without errors**

Run `npm run dev` and open `http://localhost:3000/menu`.
Expected: Menu page shows, order type toggle switches between Lieferung/Abholung (button style changes), category headings visible, product names visible.

- [ ] **Step 4: Commit**

```bash
cd /home/sisco/restaurantcms
git add components/menu/MenuClient.tsx app/(public)/menu/page.tsx
git commit -m "feat(menu): add MenuClient skeleton with order-type toggle"
```

---

## Task 2: Product card with inline "Hinzufügen" for simple products (no variants)

**Files:**
- Modify: `components/menu/MenuClient.tsx`

- [ ] **Step 1: Add `formatPrice` import and ProductCard sub-component inside the file**

Add these imports at the top of `MenuClient.tsx`:

```tsx
import { formatPrice } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
```

- [ ] **Step 2: Add `addToCartSimple` helper and replace the product placeholder div**

Inside `MenuClient`, add the helper function and replace the product placeholder `<div>` with a real card:

```tsx
// Inside MenuClient, before the return statement:
const { addItem } = useCart()

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
```

Replace the product placeholder `<div key={product.id}>` block with:

```tsx
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
```

Note: `openModal` is defined in Task 3. For now, add a stub before the return:

```tsx
function openModal(product: MenuProduct) {
  // stub — implemented in Task 3
  console.log('open modal for', product.name)
}
```

- [ ] **Step 3: Verify simple product add works**

Open `http://localhost:3000/menu`. Click "Hinzufügen" on a product without variants (e.g. Bruschetta, Caprese Salat, Tiramisu, Coca Cola). The cart badge in Header/BottomNav should increment immediately.

- [ ] **Step 4: Commit**

```bash
git add components/menu/MenuClient.tsx
git commit -m "feat(menu): product cards with add-to-cart for simple products"
```

---

## Task 3: Variant/Addon selection modal

**Files:**
- Modify: `components/menu/MenuClient.tsx`

- [ ] **Step 1: Add modal state to MenuClient**

Replace the `openModal` stub and add modal state:

```tsx
// State — add to the other useState calls at the top of MenuClient
const [modalProduct, setModalProduct] = useState<MenuProduct | null>(null)
const [selectedVariant, setSelectedVariant] = useState<MenuVariant | null>(null)
const [selectedAddons, setSelectedAddons] = useState<MenuAddon[]>([])

function openModal(product: MenuProduct) {
  setModalProduct(product)
  setSelectedVariant(product.variants[0] ?? null) // pre-select first variant
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
```

- [ ] **Step 2: Add modal JSX at the end of the return, after the categories section**

```tsx
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
```

- [ ] **Step 3: Verify modal flow**

Open `http://localhost:3000/menu`. Click "Auswählen" on Pizza Margherita or Pizza Prosciutto.
Expected:
- Modal opens with variant radio buttons (Klein/Mittel/Gross)
- Selecting a variant shows correct price modifier
- Checking an addon (Extra Käse +2.50) updates the button price
- Clicking "Hinzufügen — CHF X.XX" closes the modal and increments the Header badge
- Click outside the modal closes it

- [ ] **Step 4: Commit**

```bash
git add components/menu/MenuClient.tsx
git commit -m "feat(menu): variant/addon selection modal with dynamic price"
```

---

## Task 4: Repair /cart page — show real cart contents

**Files:**
- Replace: `app/(public)/cart/page.tsx`

- [ ] **Step 1: Replace the entire cart page**

```tsx
'use client'

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const {
    items,
    orderType,
    subtotal,
    deliveryFee,
    total,
    updateQuantity,
    removeItem,
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="container py-16 max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-stone-100 rounded-full p-6">
            <ShoppingCart className="w-12 h-12 text-stone-400" />
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-4">
          Ihr Warenkorb ist leer
        </h1>
        <p className="text-stone-600 mb-8">
          Fügen Sie Artikel aus unserer Speisekarte hinzu.
        </p>
        <Link href="/menu">
          <Button size="lg">Zur Speisekarte</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-stone-900 mb-8">
        Warenkorb
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border border-stone-200"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-900 truncate">{item.productName}</p>
              {item.variant && (
                <p className="text-sm text-stone-500 mt-0.5">• {item.variant.name}</p>
              )}
              {item.addons.length > 0 && (
                <p className="text-sm text-stone-500 mt-0.5">
                  + {item.addons.map((a) => a.name).join(', ')}
                </p>
              )}
              <p className="text-sm font-medium text-moss-700 mt-1">
                {formatPrice(item.totalPrice)} / Stück
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors"
                aria-label="Menge verringern"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-medium text-stone-900">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors"
                aria-label="Menge erhöhen"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-salmon-600 hover:bg-salmon-50 transition-colors ml-2"
                aria-label="Artikel entfernen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right flex-shrink-0 w-20">
              <p className="font-display font-semibold text-stone-900">
                {formatPrice(item.totalPrice * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-3">
        <div className="flex justify-between text-stone-700">
          <span>Zwischensumme</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-700">
          <span>
            {orderType === 'DELIVERY' ? 'Liefergebühr' : 'Abholung'}
          </span>
          <span>
            {orderType === 'DELIVERY'
              ? deliveryFee > 0
                ? formatPrice(deliveryFee)
                : '—'
              : 'Kostenlos'}
          </span>
        </div>
        <div className="border-t border-stone-200 pt-3 flex justify-between font-display text-xl font-bold text-stone-900">
          <span>Gesamt</span>
          <span>{formatPrice(total)}</span>
        </div>

        <Button className="w-full mt-4" size="lg">
          Zur Kasse
        </Button>
        <p className="text-xs text-center text-stone-500 mt-2">
          Bestellung als{' '}
          <span className="font-medium">
            {orderType === 'DELIVERY' ? 'Lieferung' : 'Abholung'}
          </span>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify cart page works end-to-end**

1. Go to `http://localhost:3000/menu`
2. Add Bruschetta (simple product, no variants) → Header badge shows 1
3. Add Pizza Margherita, select "Gross (36cm)", add "Extra Käse" → Header badge shows 2
4. Go to `http://localhost:3000/cart`
5. Expected:
   - Both items visible with correct names, variant, addon
   - Individual prices correct (Bruschetta: 12.50, Pizza: 16.00 + 4.00 + 2.50 = 22.50)
   - Quantity buttons: clicking + increments, clicking − decrements (at 1, removes the item)
   - Trash button removes item immediately
   - Subtotal = sum of all item totals
   - "Zur Kasse" button visible (not wired up — see open points)
6. Reduce Bruschetta to 0 via − button → item disappears
7. Remove last item → empty state shows "Ihr Warenkorb ist leer" with link to menu

- [ ] **Step 3: Commit**

```bash
git add app/(public)/cart/page.tsx
git commit -m "feat(cart): real cart page with items, qty controls, remove, and totals"
```

---

## Self-Review

**Spec coverage:**
- ✅ /menu interactive with working Add-to-Cart
- ✅ `'use client'` scoped to MenuClient only (server component for data fetch)
- ✅ useCart() wired via existing hook
- ✅ Lieferung/Abholung toggle with real state
- ✅ Variants and addons displayed and selectable
- ✅ Dynamic price calculation in modal
- ✅ Items written to cart store correctly
- ✅ /cart reads Zustand store (client component)
- ✅ Real cart items displayed
- ✅ Quantity increase/decrease
- ✅ Remove item
- ✅ Subtotal / delivery fee / total
- ✅ Empty state only when cart is genuinely empty
- ✅ Header badge updates (handled by existing useCart + hydration guard)

**Open points (out of scope for this plan, documented for next phase):**
- "Zur Kasse" button in /cart not wired — checkout flow (customer details, order submission) is a separate feature
- Delivery fee is 0 until a postal code has been validated via PostalCodeCheck — users need to validate delivery zone before checkout
- Notes field per item not exposed in menu modal (exists in CartItem type)
- No persistence feedback ("added to cart" toast) — cosmetic, P3

**Placeholder scan:** No TBDs, no incomplete steps.

**Type consistency:**
- `MenuProduct.variants` / `MenuVariant` used consistently across Tasks 1-3
- `addItem()` call signature matches `CartStore.addItem` parameter type (`Omit<CartItem, 'id' | 'totalPrice'>`)
- `updateQuantity(id, quantity)` — when quantity reaches 0, `useCartStore` calls `removeItem` internally ✅
