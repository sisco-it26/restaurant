import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistance } from 'date-fns'
import { de } from 'date-fns/locale'

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  })
  return posts
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="font-display text-4xl font-bold text-stone-900 mb-8 text-center">
        Blog
      </h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="hover:shadow-md transition-shadow">
              {post.coverImage && (
                <div className="aspect-video bg-stone-200 rounded-t-lg" />
              )}
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  {post.publishedAt && formatDistance(post.publishedAt, new Date(), {
                    addSuffix: true,
                    locale: de
                  })} • {post.author}
                </CardDescription>
              </CardHeader>
              {post.excerpt && (
                <CardContent>
                  <p className="text-stone-600">{post.excerpt}</p>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600">Noch keine Blogbeiträge vorhanden</p>
          </div>
        )}
      </div>
    </div>
  )
}
