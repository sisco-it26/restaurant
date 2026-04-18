import { NextRequest, NextResponse } from 'next/server'
import { generateReceipt } from '@/lib/receipt-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const html = await generateReceipt(id)

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Failed to generate receipt:', error)
    return NextResponse.json(
      { error: 'Quittung konnte nicht generiert werden' },
      { status: 500 }
    )
  }
}
