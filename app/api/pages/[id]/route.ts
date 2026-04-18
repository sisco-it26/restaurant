import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, content, seoTitle, seoDescription, isPublished } = body

    const page = await prisma.page.update({
      where: { id },
      data: { title, slug, content, seoTitle, seoDescription, isPublished },
    })
    return NextResponse.json(page)
  } catch (error) {
    console.error('Failed to update page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}
