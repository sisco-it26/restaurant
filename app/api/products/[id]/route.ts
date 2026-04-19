import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, description, basePrice, categoryId, sortOrder, isActive, isAvailable, allergens, additives, variants, addons } = body

    // Use transaction to replace variants/addons atomically
    const product = await prisma.$transaction(async (tx) => {
      // Replace variants if provided
      if (variants !== undefined) {
        await tx.productVariant.deleteMany({ where: { productId: id } })
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v: any, i: number) => ({
              productId: id,
              name: v.name,
              priceModifier: v.priceModifier || 0,
              sortOrder: i,
              isActive: v.isActive !== false,
            })),
          })
        }
      }

      // Replace addons if provided
      if (addons !== undefined) {
        await tx.productAddon.deleteMany({ where: { productId: id } })
        if (addons.length > 0) {
          await tx.productAddon.createMany({
            data: addons.map((a: any, i: number) => ({
              productId: id,
              name: a.name,
              price: a.price || 0,
              sortOrder: i,
              isActive: a.isActive !== false,
            })),
          })
        }
      }

      // Update product fields
      return tx.product.update({
        where: { id },
        data: { name, slug, description, basePrice, categoryId, sortOrder, isActive, isAvailable, allergens, additives },
        include: { category: true, variants: { orderBy: { sortOrder: 'asc' } }, addons: { orderBy: { sortOrder: 'asc' } } },
      })
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
