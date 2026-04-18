import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

async function getSettings() {
  const settings = await prisma.restaurantSettings.findFirst()
  return settings
}

export default async function SettingsPage() {
  const settings = await getSettings()

  if (!settings) {
    return <div>Einstellungen nicht gefunden</div>
  }

  return (
    <div className="space-y-6 max-w-3xl">
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
            <Input defaultValue={settings.name} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700">Beschreibung</label>
            <textarea
              defaultValue={settings.description || ''}
              className="flex min-h-[80px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700">Telefon</label>
              <Input defaultValue={settings.phone} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">E-Mail</label>
              <Input defaultValue={settings.email} className="mt-1" />
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
            <Input defaultValue={settings.address} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700">PLZ</label>
              <Input defaultValue={settings.postalCode} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">Stadt</label>
              <Input defaultValue={settings.city} className="mt-1" />
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
              defaultChecked={settings.autoAcceptOrders}
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
              defaultChecked={settings.isTakingOrders}
              className="w-4 h-4"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">Änderungen speichern</Button>
      </div>
    </div>
  )
}
