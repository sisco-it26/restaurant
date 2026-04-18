import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
  })
  return post
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container py-16 max-w-3xl">
      {post.coverImage && (
        <div className="aspect-video bg-stone-200 rounded-xl mb-8" />
      )}

      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold text-stone-900 mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-stone-600">
          <span>{post.author}</span>
          {post.publishedAt && (
            <>
              <span>•</span>
              <time dateTime={post.publishedAt.toISOString()}>
                {format(post.publishedAt, 'dd. MMMM yyyy', { locale: de })}
              </time>
            </>
          )}
        </div>
      </header>

      <div className="prose prose-stone max-w-none">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>
    </article>
  )
}
