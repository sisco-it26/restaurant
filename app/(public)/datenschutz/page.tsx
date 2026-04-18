import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug, isPublished: true } })
}

export default async function DatenschutzPage() {
  const page = await getPage('datenschutz')
  if (!page) notFound()
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="font-display text-4xl font-bold text-stone-900 mb-8">{page.title}</h1>
      <div className="prose prose-stone max-w-none">
        <p className="whitespace-pre-wrap text-stone-700">{page.content}</p>
      </div>
    </div>
  )
}
