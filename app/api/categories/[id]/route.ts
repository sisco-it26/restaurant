import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, description, sortOrder, isActive } = body

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, sortOrder, isActive },
      include: { _count: { select: { products: true } } },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Failed to update category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}
