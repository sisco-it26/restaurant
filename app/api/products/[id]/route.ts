import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, description, basePrice, categoryId, sortOrder, isActive, isAvailable, allergens, additives } = body

    const product = await prisma.product.update({
      where: { id },
      data: { name, slug, description, basePrice, categoryId, sortOrder, isActive, isAvailable, allergens, additives },
      include: { category: true, variants: true, addons: true },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
