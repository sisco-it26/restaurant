import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { openTime, closeTime, isOpen } = body

    const slot = await prisma.openingHours.update({
      where: { id: params.id },
      data: { openTime, closeTime, isOpen },
    })
    return NextResponse.json(slot)
  } catch (error) {
    console.error('Failed to update opening hours slot:', error)
    return NextResponse.json({ error: 'Failed to update slot' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.openingHours.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete opening hours slot:', error)
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 })
  }
}
