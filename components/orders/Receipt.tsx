'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, Download } from 'lucide-react'

type ReceiptProps = {
  orderId: string
}

export function Receipt({ orderId }: ReceiptProps) {
  const handlePrint = () => {
    window.open(`/api/orders/${orderId}/receipt`, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quittung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Quittung drucken
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
