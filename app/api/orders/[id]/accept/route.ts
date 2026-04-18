import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { estimatedTime } = body

    if (!estimatedTime) {
      return NextResponse.json(
        { error: 'Geschätzte Zeit erforderlich' },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'ACCEPTED',
        estimatedTime,
        acceptedAt: new Date(),
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Failed to accept order:', error)
    return NextResponse.json(
      { error: 'Bestellung konnte nicht angenommen werden' },
      { status: 500 }
    )
  }
}
