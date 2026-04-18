import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

async function getPages() {
  return prisma.page.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function AdminPagesPage() {
  const pages = await getPages()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Seiten</h1>
          <p className="text-stone-600 mt-2">Statische Seiten verwalten</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Seite erstellen
        </Button>
      </div>

      <div className="space-y-3">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-stone-900">{page.title}</p>
                <p className="text-sm text-stone-500">
                  /{page.slug} • {format(page.updatedAt, 'dd.MM.yyyy', { locale: de })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {page.isPublished ? 'Veröffentlicht' : 'Entwurf'}
                </span>
                <Button size="sm" variant="outline">Bearbeiten</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pages.length === 0 && (
          <Card><CardContent className="py-12 text-center text-stone-500">Keine Seiten vorhanden</CardContent></Card>
        )}
      </div>
    </div>
  )
}
