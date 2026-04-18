import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      type,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      postalCode,
      deliveryZone,
      deliveryFee,
      items,
      notes,
    } = body

    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Fehlende erforderliche Felder' },
        { status: 400 }
      )
    }

    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + item.totalPrice * item.quantity
    }, 0)

    const total = subtotal + (deliveryFee || 0)

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        type,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        postalCode,
        deliveryZone,
        deliveryFee,
        subtotal,
        total,
        notes,
        items: {
          create: items.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.totalPrice,
            totalPrice: item.totalPrice * item.quantity,
            variant: item.variant?.name,
            addons: item.addons.map((a: any) => a.name),
            notes: item.notes,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Bestellung konnte nicht erstellt werden' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Bestellungen konnten nicht geladen werden' },
      { status: 500 }
    )
  }
}
