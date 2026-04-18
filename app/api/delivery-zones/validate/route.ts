import { NextRequest, NextResponse } from 'next/server'
import { validatePostalCode } from '@/lib/delivery-zones'

export async function POST(request: NextRequest) {
  try {
    const { postalCode } = await request.json()

    if (!postalCode || typeof postalCode !== 'string') {
      return NextResponse.json(
        { error: 'Postleitzahl erforderlich' },
        { status: 400 }
      )
    }

    const result = await validatePostalCode(postalCode)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to validate postal code:', error)
    return NextResponse.json(
      { error: 'Validierung fehlgeschlagen' },
      { status: 500 }
    )
  }
}
