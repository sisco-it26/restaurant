import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, author, isPublished } = body

    const post = await prisma.blogPost.create({
      data: {
        title, slug, excerpt, content, author, isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Failed to create blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
