'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

type BlogPost = { id: string; title: string; slug: string; excerpt: string | null; content: string; author: string; isPublished: boolean; createdAt: string }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', content: '', author: '', isPublished: false })

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    const res = await fetch('/api/blog')
    if (res.ok) setPosts(await res.json())
    setLoading(false)
  }

  function openModal(post?: BlogPost) {
    if (post) {
      setEditingId(post.id)
      setFormData({ title: post.title, slug: post.slug, excerpt: post.excerpt || '', content: post.content, author: post.author, isPublished: post.isPublished })
    } else {
      setEditingId(null)
      setFormData({ title: '', slug: '', excerpt: '', content: '', author: '', isPublished: false })
    }
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditingId(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingId ? `/api/blog/${editingId}` : '/api/blog'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { await fetchPosts(); closeModal() }
    } finally { setSaving(false) }
  }

  if (loading) return <p className="text-stone-500">Wird geladen…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Blog</h1>
          <p className="text-stone-600 mt-2">Blogbeiträge verwalten</p>
        </div>
        <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" />Beitrag erstellen</Button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-stone-900">{post.title}</p>
                <p className="text-sm text-stone-500">{post.author} • {format(new Date(post.createdAt), 'dd.MM.yyyy', { locale: de })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{post.isPublished ? 'Veröffentlicht' : 'Entwurf'}</span>
                <Button size="sm" variant="outline" onClick={() => openModal(post)}>Bearbeiten</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && <Card><CardContent className="py-12 text-center text-stone-500">Keine Beiträge vorhanden</CardContent></Card>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-stone-900">{editingId ? 'Beitrag bearbeiten' : 'Beitrag erstellen'}</h3>
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
                <label className="text-sm font-medium text-stone-700">Autor</label>
                <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Auszug</label>
                <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="flex min-h-[60px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Inhalt</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required className="flex min-h-[200px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-4 h-4" />
                <label className="text-sm font-medium text-stone-700">Sofort veröffentlichen</label>
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
