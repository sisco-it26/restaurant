import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, postalCodes, deliveryFee, minOrderAmount, estimatedTime, isActive } = body

    const zone = await prisma.deliveryZone.update({
      where: { id: params.id },
      data: { name, postalCodes, deliveryFee, minOrderAmount: minOrderAmount || null, estimatedTime, isActive },
    })
    return NextResponse.json(zone)
  } catch (error) {
    console.error('Failed to update delivery zone:', error)
    return NextResponse.json({ error: 'Failed to update delivery zone' }, { status: 500 })
  }
}
