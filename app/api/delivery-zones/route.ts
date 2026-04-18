import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(zones)
  } catch (error) {
    console.error('Failed to fetch delivery zones:', error)
    return NextResponse.json({ error: 'Failed to fetch delivery zones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, postalCodes, deliveryFee, minOrderAmount, estimatedTime, isActive } = body

    const zone = await prisma.deliveryZone.create({
      data: { name, postalCodes, deliveryFee, minOrderAmount: minOrderAmount || null, estimatedTime, isActive },
    })
    return NextResponse.json(zone, { status: 201 })
  } catch (error) {
    console.error('Failed to create delivery zone:', error)
    return NextResponse.json({ error: 'Failed to create delivery zone' }, { status: 500 })
  }
}
