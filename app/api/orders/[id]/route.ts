import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return NextResponse.json(
      { error: 'Bestellung konnte nicht geladen werden' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status erforderlich' },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === 'ACCEPTED' && { acceptedAt: new Date() }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json(
      { error: 'Bestellung konnte nicht aktualisiert werden' },
      { status: 500 }
    )
  }
}
