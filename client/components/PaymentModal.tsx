'use client'

import React, { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaymentModalProps {
  amount: number
  itemName: string
  buyerName?: string
  onClose: () => void
  onPaid: () => Promise<void>
}

export default function PaymentModal({ amount, itemName, buyerName, onClose, onPaid }: PaymentModalProps) {
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePay = async () => {
    setProcessing(true)
    try {
      await onPaid()
      setSuccess(true)
      setTimeout(() => {
        setProcessing(false)
        onClose()
      }, 1200)
    } catch (e) {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-8 flex flex-col items-center space-y-6 relative">
        {!success ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Төлбөр төлөх</h2>
            {buyerName && (
              <div className="text-gray-500 text-sm">Худалдан авагч: <span className="font-medium">{buyerName}</span></div>
            )}
            <div className="w-full flex flex-col items-center">
              <p className="mb-1 text-gray-600">Бараа:</p>
              <div className="font-medium text-lg text-gray-900 mb-2">{itemName}</div>
              <p className="text-gray-700">Төлөх дүн:</p>
              <div className="text-2xl font-bold text-blue-700 mb-4">{amount.toLocaleString()}₮</div>
            </div>
            <div className="flex justify-center gap-3 w-full">
              <Button onClick={handlePay} className="w-32" disabled={processing}>
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Төлбөр төлөх'}
              </Button>
              <Button variant="ghost" onClick={onClose} disabled={processing}>
                Болих
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4 py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
            <div className="text-xl font-semibold text-green-600">Амжилттай!</div>
            <div className="text-gray-700">Таны төлбөр хүлээн авлаа.</div>
          </div>
        )}
      </div>
    </div>
  )
}
