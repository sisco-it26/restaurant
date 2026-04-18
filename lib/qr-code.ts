import QRCode from 'qrcode'

export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
    return qrCodeDataUrl
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    throw new Error('QR code generation failed')
  }
}

export function generateGoogleMapsUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address)
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
}
