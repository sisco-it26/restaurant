'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X, ChevronDown, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type Category = { id: string; name: string }
type Variant = { id: string; name: string; priceModifier: number }
type Addon = { id: string; name: string; price: number }
type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: number
  categoryId: string
  category: Category
  sortOrder: number
  isActive: boolean
  isAvailable: boolean
  allergens: string[]
  additives: string[]
  variants: Variant[]
  addons: Addon[]
}

type FormData = {
  name: string
  slug: string
  description: string
  basePrice: string
  categoryId: string
  sortOrder: number
  isActive: boolean
  isAvailable: boolean
  allergensText: string
  additivesText: string
}

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState<FormData>({
    name: '', slug: '', description: '', basePrice: '', categoryId: '',
    sortOrder: 0, isActive: true, isAvailable: true, allergensText: '', additivesText: '',
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ]).then(([cats, prods]) => {
      setCategories(cats)
      setProducts(prods)
      setExpandedCategories(new Set(cats.map((c: Category) => c.id)))
    }).finally(() => setLoading(false))
  }, [])

  async function fetchProducts() {
    const res = await fetch('/api/products')
    if (res.ok) setProducts(await res.json())
  }

  function openModal(product?: Product) {
    if (product) {
      setEditingId(product.id)
      setFormData({
        name: product.name, slug: product.slug,
        description: product.description || '',
        basePrice: String(product.basePrice),
        categoryId: product.categoryId,
        sortOrder: product.sortOrder,
        isActive: product.isActive, isAvailable: product.isAvailable,
        allergensText: product.allergens.join(', '),
        additivesText: product.additives.join(', '),
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '', slug: '', description: '',
        basePrice: '', categoryId: categories[0]?.id || '',
        sortOrder: products.length, isActive: true, isAvailable: true,
        allergensText: '', additivesText: '',
      })
    }
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditingId(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: formData.name, slug: formData.slug,
      description: formData.description || null,
      basePrice: parseFloat(formData.basePrice),
      categoryId: formData.categoryId,
      sortOrder: formData.sortOrder,
      isActive: formData.isActive, isAvailable: formData.isAvailable,
      allergens: formData.allergensText.split(',').map((s) => s.trim()).filter(Boolean),
      additives: formData.additivesText.split(',').map((s) => s.trim()).filter(Boolean),
    }
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      if (res.ok) { await fetchProducts(); closeModal() }
    } finally { setSaving(false) }
  }

  function toggleCategory(id: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  if (loading) return <p className="text-stone-500">Wird geladen…</p>

  const byCategory = categories.map((cat) => ({
    cat,
    products: products.filter((p) => p.categoryId === cat.id),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Menü</h1>
          <p className="text-stone-600 mt-2">Verwalten Sie Ihre Speisekarte</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Produkt hinzufügen
        </Button>
      </div>

      <div className="space-y-4">
        {byCategory.map(({ cat, products: catProducts }) => (
          <Card key={cat.id}>
            <CardHeader
              className="cursor-pointer select-none pb-3"
              onClick={() => toggleCategory(cat.id)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {expandedCategories.has(cat.id)
                    ? <ChevronDown className="w-4 h-4" />
                    : <ChevronRight className="w-4 h-4" />}
                  {cat.name}
                  <span className="text-sm font-normal text-stone-500">({catProducts.length})</span>
                </CardTitle>
              </div>
            </CardHeader>

            {expandedCategories.has(cat.id) && (
              <CardContent>
                <div className="space-y-2">
                  {catProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-stone-500 line-clamp-1">{product.description}</p>
                        )}
                        {product.variants.length > 0 && (
                          <p className="text-xs text-stone-400 mt-0.5">
                            {product.variants.length} Variante(n) • {product.addons.length} Extra(s)
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span className="font-display font-semibold text-stone-900">
                          {formatPrice(Number(product.basePrice))}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.isAvailable ? 'Verfügbar' : 'Nicht verfügbar'}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => openModal(product)}>
                          Bearbeiten
                        </Button>
                      </div>
                    </div>
                  ))}
                  {catProducts.length === 0 && (
                    <p className="text-sm text-stone-400 text-center py-4">Keine Produkte in dieser Kategorie</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-stone-900">
                  {editingId ? 'Produkt bearbeiten' : 'Produkt hinzufügen'}
                </h3>
                <button type="button" onClick={closeModal}>
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">Name</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Slug</label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required className="mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex min-h-[60px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">Preis (CHF)</label>
                  <Input type="number" step="0.50" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Reihenfolge</label>
                  <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })} className="mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Kategorie</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="flex w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1"
                >
                  <option value="">Kategorie wählen…</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Allergene (kommagetrennt)</label>
                <Input value={formData.allergensText} onChange={(e) => setFormData({ ...formData, allergensText: e.target.value })} placeholder="Gluten, Milch, Ei" className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Zusatzstoffe (kommagetrennt)</label>
                <Input value={formData.additivesText} onChange={(e) => setFormData({ ...formData, additivesText: e.target.value })} placeholder="Koffein" className="mt-1" />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                  <label className="text-sm font-medium text-stone-700">Aktiv</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} className="w-4 h-4" />
                  <label className="text-sm font-medium text-stone-700">Verfügbar</label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">Abbrechen</Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Wird gespeichert…' : 'Speichern'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
