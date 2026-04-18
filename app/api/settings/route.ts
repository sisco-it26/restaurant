import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const settings = await prisma.restaurantSettings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, address, city, postalCode, phone, email, autoAcceptOrders, isTakingOrders } = body

    const settings = await prisma.restaurantSettings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    const updated = await prisma.restaurantSettings.update({
      where: { id: settings.id },
      data: {
        name,
        description,
        address,
        city,
        postalCode,
        phone,
        email,
        autoAcceptOrders,
        isTakingOrders,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
