'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Settings = {
  id: string
  name: string
  description: string | null
  address: string
  city: string
  postalCode: string
  phone: string
  email: string
  autoAcceptOrders: boolean
  isTakingOrders: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then(setSettings)
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!settings) return

    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        const updated = await res.json()
        setSettings(updated)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-stone-500">Wird geladen…</p>
  if (!settings) return <p className="text-stone-500">Einstellungen nicht gefunden</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-stone-900">Einstellungen</h1>
        <p className="text-stone-600 mt-2">Restaurant-Konfiguration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant-Informationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700">Name</label>
            <Input
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700">Beschreibung</label>
            <textarea
              value={settings.description || ''}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="flex min-h-[80px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700">Telefon</label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">E-Mail</label>
              <Input
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adresse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700">Strasse</label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700">PLZ</label>
              <Input
                value={settings.postalCode}
                onChange={(e) => setSettings({ ...settings, postalCode: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">Stadt</label>
              <Input
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bestelleinstellungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900">Automatische Bestellannahme</p>
              <p className="text-sm text-stone-600">Bestellungen werden automatisch angenommen</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoAcceptOrders}
              onChange={(e) => setSettings({ ...settings, autoAcceptOrders: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900">Bestellungen aktiv</p>
              <p className="text-sm text-stone-600">Restaurant nimmt Bestellungen entgegen</p>
            </div>
            <input
              type="checkbox"
              checked={settings.isTakingOrders}
              onChange={(e) => setSettings({ ...settings, isTakingOrders: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? 'Wird gespeichert…' : 'Änderungen speichern'}
        </Button>
      </div>
    </form>
  )
}
