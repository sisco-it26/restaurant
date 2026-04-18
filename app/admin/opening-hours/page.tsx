import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

async function getHours() {
  const slots = await prisma.openingHours.findMany({
    orderBy: [{ dayOfWeek: 'asc' }, { openTime: 'asc' }],
  })
  const byDay: Record<number, typeof slots> = {}
  for (const s of slots) {
    if (!byDay[s.dayOfWeek]) byDay[s.dayOfWeek] = []
    byDay[s.dayOfWeek].push(s)
  }
  return byDay
}

export default async function OpeningHoursPage() {
  const byDay = await getHours()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-stone-900">Öffnungszeiten</h1>
        <p className="text-stone-600 mt-2">Reguläre Öffnungszeiten verwalten</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Wochenplan</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {DAY_NAMES.map((day, index) => {
            const slots = byDay[index] ?? []
            const isOpen = slots.some(s => s.isOpen)
            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                <span className="w-32 font-medium text-stone-700">{day}</span>
                <div className="flex-1">
                  {isOpen
                    ? slots.filter(s => s.isOpen).map(s => (
                        <span key={s.id} className="text-sm text-stone-600 mr-4">
                          {s.openTime}–{s.closeTime}
                        </span>
                      ))
                    : <span className="text-sm text-stone-400">Geschlossen</span>}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${isOpen ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-500'}`}>
                  {isOpen ? 'Geöffnet' : 'Geschlossen'}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
