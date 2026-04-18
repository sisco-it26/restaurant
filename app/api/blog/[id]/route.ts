import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, author, isPublished } = body

    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title, slug, excerpt, content, author, isPublished,
        publishedAt: isPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to update blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}
