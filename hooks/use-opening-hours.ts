'use client'

import { useEffect, useState } from 'react'
import { getOpenStatus, type OpenStatus } from '@/lib/opening-hours'

export function useOpeningHours() {
  const [status, setStatus] = useState<OpenStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('/api/opening-hours/check')
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        console.error('Failed to check opening hours:', error)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return { status, loading }
}
