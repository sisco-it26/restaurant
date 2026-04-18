import { prisma } from './db'

export type ZoneResult =
  | { available: true; zone: { id: string; name: string; deliveryFee: number; minOrderAmount: number | null; estimatedTime: number } }
  | { available: false; message: string }

export async function validatePostalCode(postalCode: string): Promise<ZoneResult> {
  const normalized = postalCode.trim().replace(/\s+/g, '')

  const zones = await prisma.deliveryZone.findMany({
    where: { isActive: true },
  })

  for (const zone of zones) {
    for (const pattern of zone.postalCodes) {
      if (matchesPattern(normalized, pattern)) {
        return {
          available: true,
          zone: {
            id: zone.id,
            name: zone.name,
            deliveryFee: Number(zone.deliveryFee),
            minOrderAmount: zone.minOrderAmount ? Number(zone.minOrderAmount) : null,
            estimatedTime: zone.estimatedTime,
          },
        }
      }
    }
  }

  return {
    available: false,
    message: 'Leider liefern wir nicht in Ihre Postleitzahl.',
  }
}

function matchesPattern(postalCode: string, pattern: string): boolean {
  if (pattern.endsWith('*')) {
    return postalCode.startsWith(pattern.slice(0, -1))
  }
  return postalCode === pattern
}

export async function getAllZones() {
  return prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}
