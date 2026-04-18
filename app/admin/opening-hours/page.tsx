'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

type Slot = { id: string; dayOfWeek: number; openTime: string; closeTime: string; isOpen: boolean }

export default function OpeningHoursPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ dayOfWeek: 1, openTime: '10:00', closeTime: '22:00', isOpen: true })

  useEffect(() => { fetchSlots() }, [])

  async function fetchSlots() {
    const res = await fetch('/api/opening-hours')
    if (res.ok) setSlots(await res.json())
    setLoading(false)
  }

  function openAdd() {
    setEditingSlot(null)
    setFormData({ dayOfWeek: 1, openTime: '10:00', closeTime: '22:00', isOpen: true })
    setModalOpen(true)
  }

  function openEdit(slot: Slot) {
    setEditingSlot(slot)
    setFormData({ dayOfWeek: slot.dayOfWeek, openTime: slot.openTime, closeTime: slot.closeTime, isOpen: slot.isOpen })
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditingSlot(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingSlot) {
        const res = await fetch(`/api/opening-hours/${editingSlot.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ openTime: formData.openTime, closeTime: formData.closeTime, isOpen: formData.isOpen }) })
        if (res.ok) { await fetchSlots(); closeModal() }
      } else {
        const res = await fetch('/api/opening-hours', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
        if (res.ok) { await fetchSlots(); closeModal() }
      }
    } finally { setSaving(false) }
  }

  async function deleteSlot(id: string) {
    await fetch(`/api/opening-hours/${id}`, { method: 'DELETE' })
    await fetchSlots()
  }

  // Group slots by day
  const byDay: Record<number, Slot[]> = {}
  for (const s of slots) {
    if (!byDay[s.dayOfWeek]) byDay[s.dayOfWeek] = []
    byDay[s.dayOfWeek].push(s)
  }

  if (loading) return <p className="text-stone-500">Wird geladen…</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Öffnungszeiten</h1>
          <p className="text-stone-600 mt-2">Reguläre Öffnungszeiten verwalten</p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Zeitfenster hinzufügen</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Wochenplan</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {DAY_NAMES.map((day, index) => {
            const daySlots = byDay[index] ?? []
            const isOpen = daySlots.some(s => s.isOpen)
            return (
              <div key={index} className="border-b border-stone-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="w-28 font-medium text-stone-700">{day}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${isOpen ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-500'}`}>
                    {isOpen ? 'Geöffnet' : 'Geschlossen'}
                  </span>
                </div>
                <div className="space-y-1 pl-1">
                  {daySlots.filter(s => s.isOpen).map((slot) => (
                    <div key={slot.id} className="flex items-center gap-3">
                      <span className="text-sm text-stone-600">{slot.openTime}–{slot.closeTime}</span>
                      <button onClick={() => openEdit(slot)} className="text-xs text-moss-600 hover:underline">Bearbeiten</button>
                      <button onClick={() => deleteSlot(slot.id)} className="text-xs text-red-500 hover:underline">Löschen</button>
                    </div>
                  ))}
                  {daySlots.length === 0 && <p className="text-sm text-stone-400">Kein Eintrag</p>}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-stone-900">{editingSlot ? 'Zeitfenster bearbeiten' : 'Zeitfenster hinzufügen'}</h3>
                <button type="button" onClick={closeModal}><X className="w-5 h-5 text-stone-400" /></button>
              </div>
              {!editingSlot && (
                <div>
                  <label className="text-sm font-medium text-stone-700">Tag</label>
                  <select value={formData.dayOfWeek} onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })} className="flex w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1">
                    {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">Öffnet</label>
                  <Input type="time" value={formData.openTime} onChange={(e) => setFormData({ ...formData, openTime: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Schließt</label>
                  <Input type="time" value={formData.closeTime} onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isOpen} onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })} className="w-4 h-4" />
                <label className="text-sm font-medium text-stone-700">Geöffnet</label>
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
