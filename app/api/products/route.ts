import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: { orderBy: { sortOrder: 'asc' } },
        addons: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, basePrice, categoryId, sortOrder, isActive, isAvailable, allergens, additives, variants, addons } = body

    const product = await prisma.product.create({
      data: {
        name, slug, description, basePrice, categoryId, sortOrder, isActive, isAvailable,
        allergens: allergens || [], additives: additives || [],
        variants: variants?.length ? { createMany: { data: variants.map((v: any, i: number) => ({ name: v.name, priceModifier: v.priceModifier || 0, sortOrder: i, isActive: true })) } } : undefined,
        addons: addons?.length ? { createMany: { data: addons.map((a: any, i: number) => ({ name: a.name, price: a.price || 0, sortOrder: i, isActive: true })) } } : undefined,
      },
      include: { category: true, variants: true, addons: true },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
