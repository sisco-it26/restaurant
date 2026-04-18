import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Failed to fetch contact messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const msg = await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, subject, message },
    })
    return NextResponse.json(msg, { status: 201 })
  } catch (error) {
    console.error('Failed to create contact message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
