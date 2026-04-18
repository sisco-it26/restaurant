import { NextResponse } from 'next/server'
import { getOpenStatus } from '@/lib/opening-hours'

export async function GET() {
  try {
    const status = await getOpenStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error('Failed to check opening hours:', error)
    return NextResponse.json(
      { error: 'Failed to check opening hours' },
      { status: 500 }
    )
  }
}
