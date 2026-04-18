'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

type Page = { id: string; title: string; slug: string; content: string; seoTitle: string | null; seoDescription: string | null; isPublished: boolean; updatedAt: string }

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', seoTitle: '', seoDescription: '', isPublished: true })

  useEffect(() => { fetchPages() }, [])

  async function fetchPages() {
    const res = await fetch('/api/pages')
    if (res.ok) setPages(await res.json())
    setLoading(false)
  }

  function openModal(page?: Page) {
    if (page) {
      setEditingId(page.id)
      setFormData({ title: page.title, slug: page.slug, content: page.content, seoTitle: page.seoTitle || '', seoDescription: page.seoDescription || '', isPublished: page.isPublished })
    } else {
      setEditingId(null)
      setFormData({ title: '', slug: '', content: '', seoTitle: '', seoDescription: '', isPublished: true })
    }
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditingId(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingId ? `/api/pages/${editingId}` : '/api/pages'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { await fetchPages(); closeModal() }
    } finally { setSaving(false) }
  }

  if (loading) return <p className="text-stone-500">Wird geladen…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Seiten</h1>
          <p className="text-stone-600 mt-2">Statische Seiten verwalten</p>
        </div>
        <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" />Seite erstellen</Button>
      </div>

      <div className="space-y-3">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-stone-900">{page.title}</p>
                <p className="text-sm text-stone-500">/{page.slug} • {format(new Date(page.updatedAt), 'dd.MM.yyyy', { locale: de })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{page.isPublished ? 'Veröffentlicht' : 'Entwurf'}</span>
                <Button size="sm" variant="outline" onClick={() => openModal(page)}>Bearbeiten</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pages.length === 0 && <Card><CardContent className="py-12 text-center text-stone-500">Keine Seiten vorhanden</CardContent></Card>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-stone-900">{editingId ? 'Seite bearbeiten' : 'Seite erstellen'}</h3>
                <button type="button" onClick={closeModal}><X className="w-5 h-5 text-stone-400" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">Titel</label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Slug</label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Inhalt</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required className="flex min-h-[200px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">SEO Titel</label>
                  <Input value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">SEO Beschreibung</label>
                  <Input value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-4 h-4" />
                <label className="text-sm font-medium text-stone-700">Veröffentlicht</label>
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
