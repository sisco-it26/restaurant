'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  isActive: boolean
  _count: { products: number }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', sortOrder: 0, isActive: true })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
    setLoading(false)
  }

  function openModal(category?: Category) {
    if (category) {
      setEditingId(category.id)
      setFormData({ name: category.name, slug: category.slug, description: category.description || '', sortOrder: category.sortOrder, isActive: category.isActive })
    } else {
      setEditingId(null)
      setFormData({ name: '', slug: '', description: '', sortOrder: categories.length, isActive: true })
    }
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '', sortOrder: 0, isActive: true })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        await fetchCategories()
        closeModal()
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-stone-500">Wird geladen…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Kategorien</h1>
          <p className="text-stone-600 mt-2">Menü-Kategorien verwalten</p>
        </div>
        <Button onClick={() => openModal()}>
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
                <Button size="sm" variant="outline" onClick={() => openModal(cat)}>Bearbeiten</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <Card><CardContent className="py-12 text-center text-stone-500">Keine Kategorien vorhanden</CardContent></Card>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-stone-900">
                  {editingId ? 'Kategorie bearbeiten' : 'Kategorie hinzufügen'}
                </h3>
                <button type="button" onClick={closeModal} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Slug</label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Beschreibung</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="flex min-h-[60px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Reihenfolge</label>
                <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })} className="mt-1" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                <label className="text-sm font-medium text-stone-700">Aktiv</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">Abbrechen</Button>
                <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Wird gespeichert…' : 'Speichern'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
