'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSent(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setError('Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.')
      }
    } catch {
      setError('Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="container py-16 max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-4">
          Nachricht gesendet!
        </h1>
        <p className="text-stone-600 mb-8">
          Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.
        </p>
        <Button onClick={() => setSent(false)}>Weitere Nachricht senden</Button>
      </div>
    )
  }

  return (
    <div className="container py-16 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-stone-900 mb-4">Kontakt</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Haben Sie Fragen, Anregungen oder möchten Sie eine Reservierung vornehmen? Schreiben Sie uns!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Nachricht senden</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-stone-700">Name *</label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700">E-Mail *</label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-stone-700">Telefon</label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700">Betreff *</label>
                    <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Nachricht *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="flex w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={sending}>
                  {sending ? 'Wird gesendet…' : 'Nachricht senden'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-moss-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-900">Adresse</p>
                  <p className="text-sm text-stone-600">Musterstrasse 12<br />8001 Zürich</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-moss-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-900">Telefon</p>
                  <p className="text-sm text-stone-600">+41 44 123 45 67</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-moss-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-900">E-Mail</p>
                  <p className="text-sm text-stone-600">info@restaurant.ch</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
