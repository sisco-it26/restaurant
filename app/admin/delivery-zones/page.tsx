import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

async function getZones() {
  return prisma.deliveryZone.findMany({ orderBy: { name: 'asc' } })
}

export default async function DeliveryZonesPage() {
  const zones = await getZones()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Liefergebiete</h1>
          <p className="text-stone-600 mt-2">Postleitzahlen und Liefergebühren</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Zone hinzufügen
        </Button>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardContent className="flex items-start justify-between py-4">
              <div className="space-y-1">
                <p className="font-medium text-stone-900">{zone.name}</p>
                <p className="text-sm text-stone-600">
                  PLZ: {zone.postalCodes.join(', ')}
                </p>
                <p className="text-sm text-stone-600">
                  Liefergebühr: {formatPrice(Number(zone.deliveryFee))} •
                  ca. {zone.estimatedTime} Min.
                  {zone.minOrderAmount ? ` • Mind. ${formatPrice(Number(zone.minOrderAmount))}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${zone.isActive ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}`}>
                  {zone.isActive ? 'Aktiv' : 'Inaktiv'}
                </span>
                <Button size="sm" variant="outline">Bearbeiten</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {zones.length === 0 && (
          <Card><CardContent className="py-12 text-center text-stone-500">Keine Lieferzonen vorhanden</CardContent></Card>
        )}
      </div>
    </div>
  )
}
