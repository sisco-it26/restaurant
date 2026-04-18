import { prisma } from './db'

export type OpenStatus = {
  isOpen: boolean
  nextOpenTime?: string
  nextOpenDay?: string
  message: string
  state: 'open' | 'closed' | 'closing_soon'
}

const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export async function getOpenStatus(now?: Date): Promise<OpenStatus> {
  const current = now ?? new Date()

  const dayOfWeek = current.getDay()
  const currentMinutes = current.getHours() * 60 + current.getMinutes()
  const todayDate = new Date(current.getFullYear(), current.getMonth(), current.getDate())

  // Check for special hours override
  const specialHours = await prisma.specialHours.findFirst({
    where: {
      date: todayDate,
    },
  })

  if (specialHours) {
    if (specialHours.isClosed) {
      return {
        isOpen: false,
        message: `Heute geschlossen${specialHours.reason ? `: ${specialHours.reason}` : ''}`,
        state: 'closed',
      }
    }

    if (specialHours.openTime && specialHours.closeTime) {
      const openMin = parseTime(specialHours.openTime)
      const closeMin = parseTime(specialHours.closeTime)
      if (currentMinutes >= openMin && currentMinutes < closeMin) {
        const closingSoon = closeMin - currentMinutes <= 30
        return {
          isOpen: true,
          message: closingSoon
            ? `Schliesst bald um ${specialHours.closeTime} Uhr`
            : `Geöffnet bis ${specialHours.closeTime} Uhr`,
          state: closingSoon ? 'closing_soon' : 'open',
        }
      }
    }
  }

  // Check regular opening hours for today
  const todayHours = await prisma.openingHours.findMany({
    where: { dayOfWeek, isOpen: true },
    orderBy: { openTime: 'asc' },
  })

  for (const slot of todayHours) {
    const openMin = parseTime(slot.openTime)
    const closeMin = parseTime(slot.closeTime)

    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      const closingSoon = closeMin - currentMinutes <= 30
      return {
        isOpen: true,
        message: closingSoon
          ? `Schliesst bald um ${slot.closeTime} Uhr`
          : `Geöffnet bis ${slot.closeTime} Uhr`,
        state: closingSoon ? 'closing_soon' : 'open',
      }
    }

    if (currentMinutes < openMin) {
      return {
        isOpen: false,
        nextOpenTime: slot.openTime,
        message: `Öffnet heute um ${slot.openTime} Uhr`,
        state: 'closed',
      }
    }
  }

  // Look for next open slot across the week
  for (let daysAhead = 1; daysAhead <= 7; daysAhead++) {
    const nextDay = (dayOfWeek + daysAhead) % 7
    const nextHours = await prisma.openingHours.findFirst({
      where: { dayOfWeek: nextDay, isOpen: true },
      orderBy: { openTime: 'asc' },
    })

    if (nextHours) {
      const dayLabel = daysAhead === 1 ? 'Morgen' : DAY_NAMES[nextDay]
      return {
        isOpen: false,
        nextOpenTime: nextHours.openTime,
        nextOpenDay: dayLabel,
        message: `Nächste Öffnung: ${dayLabel} um ${nextHours.openTime} Uhr`,
        state: 'closed',
      }
    }
  }

  return {
    isOpen: false,
    message: 'Aktuell geschlossen',
    state: 'closed',
  }
}

export async function getTodayHours(): Promise<{ openTime: string; closeTime: string }[]> {
  const dayOfWeek = new Date().getDay()
  const slots = await prisma.openingHours.findMany({
    where: { dayOfWeek, isOpen: true },
    orderBy: { openTime: 'asc' },
    select: { openTime: true, closeTime: true },
  })
  return slots
}

export async function getWeeklyHours() {
  const allSlots = await prisma.openingHours.findMany({
    orderBy: [{ dayOfWeek: 'asc' }, { openTime: 'asc' }],
  })

  const byDay: Record<number, typeof allSlots> = {}
  for (const slot of allSlots) {
    if (!byDay[slot.dayOfWeek]) byDay[slot.dayOfWeek] = []
    byDay[slot.dayOfWeek].push(slot)
  }

  return DAY_NAMES.map((name, index) => ({
    day: name,
    dayIndex: index,
    slots: byDay[index] ?? [],
    isOpen: (byDay[index] ?? []).some((s) => s.isOpen),
  }))
}
