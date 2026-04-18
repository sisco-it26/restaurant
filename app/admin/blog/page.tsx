import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

async function getPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function AdminBlogPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Blog</h1>
          <p className="text-stone-600 mt-2">Blogbeiträge verwalten</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Beitrag erstellen
        </Button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-stone-900">{post.title}</p>
                <p className="text-sm text-stone-500">
                  {post.author} • {format(post.createdAt, 'dd.MM.yyyy', { locale: de })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {post.isPublished ? 'Veröffentlicht' : 'Entwurf'}
                </span>
                <Button size="sm" variant="outline">Bearbeiten</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <Card><CardContent className="py-12 text-center text-stone-500">Keine Beiträge vorhanden</CardContent></Card>
        )}
      </div>
    </div>
  )
}
