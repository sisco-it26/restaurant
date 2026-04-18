'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { PostalCodeCheck } from '@/components/home/PostalCodeCheck'
import { FulfillmentSwitch } from '@/components/menu/FulfillmentSwitch'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroOrderEntry() {
  const router = useRouter()
  const { orderType, setOrderType } = useCart()

  return (
    <div className="space-y-3 pt-1">
      {/* Big fulfillment switch */}
      <div className="max-w-[320px]">
        <FulfillmentSwitch value={orderType} onChange={setOrderType} />
      </div>

      {/* Conditional PLZ input */}
      {orderType === 'DELIVERY' && (
        <div className="max-w-[400px] animate-fade-in">
          <PostalCodeCheck />
        </div>
      )}

      <Button size="lg" className="mt-1" onClick={() => router.push('/menu')}>
        {orderType === 'DELIVERY' ? 'Essen finden' : 'Weiter zur Speisekarte'}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
