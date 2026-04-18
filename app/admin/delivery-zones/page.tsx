'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type Zone = {
  id: string
  name: string
  postalCodes: string[]
  deliveryFee: number
  minOrderAmount: number | null
  estimatedTime: number
  isActive: boolean
}

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: '', postalCodesText: '', deliveryFee: 0, minOrderAmount: '', estimatedTime: 30, isActive: true })

  useEffect(() => { fetchZones() }, [])

  async function fetchZones() {
    const res = await fetch('/api/delivery-zones')
    if (res.ok) setZones(await res.json())
    setLoading(false)
  }

  function openModal(zone?: Zone) {
    if (zone) {
      setEditingId(zone.id)
      setFormData({ name: zone.name, postalCodesText: zone.postalCodes.join(', '), deliveryFee: zone.deliveryFee, minOrderAmount: zone.minOrderAmount?.toString() || '', estimatedTime: zone.estimatedTime, isActive: zone.isActive })
    } else {
      setEditingId(null)
      setFormData({ name: '', postalCodesText: '', deliveryFee: 0, minOrderAmount: '', estimatedTime: 30, isActive: true })
    }
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditingId(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const postalCodes = formData.postalCodesText.split(',').map((s) => s.trim()).filter(Boolean)
    const payload = { name: formData.name, postalCodes, deliveryFee: formData.deliveryFee, minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null, estimatedTime: formData.estimatedTime, isActive: formData.isActive }
    try {
      const url = editingId ? `/api/delivery-zones/${editingId}` : '/api/delivery-zones'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { await fetchZones(); closeModal() }
    } finally { setSaving(false) }
  }

  if (loading) return <p className="text-stone-500">Wird geladen…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Liefergebiete</h1>
          <p className="text-stone-600 mt-2">Postleitzahlen und Liefergebühren</p>
        </div>
        <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" />Zone hinzufügen</Button>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardContent className="flex items-start justify-between py-4">
              <div className="space-y-1">
                <p className="font-medium text-stone-900">{zone.name}</p>
                <p className="text-sm text-stone-600">PLZ: {zone.postalCodes.join(', ')}</p>
                <p className="text-sm text-stone-600">
                  Liefergebühr: {formatPrice(Number(zone.deliveryFee))} • ca. {zone.estimatedTime} Min.
                  {zone.minOrderAmount ? ` • Mind. ${formatPrice(Number(zone.minOrderAmount))}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${zone.isActive ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}`}>
                  {zone.isActive ? 'Aktiv' : 'Inaktiv'}
                </span>
                <Button size="sm" variant="outline" onClick={() => openModal(zone)}>Bearbeiten</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {zones.length === 0 && <Card><CardContent className="py-12 text-center text-stone-500">Keine Lieferzonen vorhanden</CardContent></Card>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-stone-900">{editingId ? 'Zone bearbeiten' : 'Zone hinzufügen'}</h3>
                <button type="button" onClick={closeModal}><X className="w-5 h-5 text-stone-400" /></button>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Postleitzahlen (kommagetrennt, Wildcard mit *)</label>
                <textarea value={formData.postalCodesText} onChange={(e) => setFormData({ ...formData, postalCodesText: e.target.value })} required className="flex min-h-[60px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1" placeholder="8001, 8002, 80*" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">Liefergebühr (CHF)</label>
                  <Input type="number" step="0.50" value={formData.deliveryFee} onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Mindestbestellung (CHF)</label>
                  <Input type="number" step="0.50" value={formData.minOrderAmount} onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })} placeholder="Kein Minimum" className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Geschätzte Zeit (Minuten)</label>
                <Input type="number" value={formData.estimatedTime} onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })} className="mt-1" />
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
