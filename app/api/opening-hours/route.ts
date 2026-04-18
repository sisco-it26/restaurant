import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const slots = await prisma.openingHours.findMany({
      orderBy: [{ dayOfWeek: 'asc' }, { openTime: 'asc' }],
    })
    return NextResponse.json(slots)
  } catch (error) {
    console.error('Failed to fetch opening hours:', error)
    return NextResponse.json({ error: 'Failed to fetch opening hours' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dayOfWeek, openTime, closeTime, isOpen } = body

    const slot = await prisma.openingHours.create({
      data: { dayOfWeek, openTime, closeTime, isOpen },
    })
    return NextResponse.json(slot, { status: 201 })
  } catch (error) {
    console.error('Failed to create opening hours slot:', error)
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 })
  }
}
