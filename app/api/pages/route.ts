import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const pages = await prisma.page.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Failed to fetch pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, seoTitle, seoDescription, isPublished } = body

    const page = await prisma.page.create({
      data: { title, slug, content, seoTitle, seoDescription, isPublished },
    })
    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Failed to create page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
