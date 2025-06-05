'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PaymentModal from '@/components/PaymentModal'
import DisputeForm from '@/components/DisputeForm'
import {
  cancelOrderClient,
  confirmDeliveryClient,
  updateOrderStatusClient,
  deleteOrderClient,
} from '@/lib/clientOrders'
import { toast } from 'sonner'
import type { Order } from '@/lib/dal'
import {
  Loader2,
  Clock2,
  CreditCard,
  Package,
  CheckCircle,
  XCircle,
  ChevronDown,
} from 'lucide-react'

// Степперийн статусууд ба иконнууд
const steps = [
  { key: 'Requested',       icon: Clock2 },
  { key: 'Approved',        icon: CreditCard },
  { key: 'PendingPayment',  icon: Clock2 },
  { key: 'Paid',            icon: Package },
  { key: 'Delivered',       icon: Package },
  { key: 'Verified',        icon: CheckCircle },
  { key: 'Cancelled',       icon: XCircle },
  { key: 'Disputed',        icon: XCircle },
  { key: 'EscrowPending',   icon: CreditCard },
  { key: 'EscrowConfirmed', icon: CreditCard },
  { key: 'EscrowCompleted', icon: CheckCircle },
] as const

type Status = typeof steps[number]['key']

const statusLabel: Record<Status, string> = {
  Requested:       'Захиалга илгээгдсэн',
  Approved:        'Зөвшөөрсөн',
  PendingPayment:  'Төлбөр хүлээгдэж байна',
  Paid:            'Төлбөр хийгдсэн',
  Delivered:       'Хүргэлт илгээгдсэн',
  Verified:        'Баталгаажсан',
  Cancelled:       'Цуцлагдсан',
  Disputed:        'Маргаантай',
  EscrowPending:   'Escrow → Pending',
  EscrowConfirmed: 'Escrow → Confirmed',
  EscrowCompleted: 'Escrow дууссан',
}

const statusClasses: Record<Status, string> = {
  Requested:       'text-gray-700 bg-gray-100',
  Approved:        'text-blue-700 bg-blue-100',
  PendingPayment:  'text-yellow-700 bg-yellow-100',
  Paid:            'text-purple-700 bg-purple-100',
  Delivered:       'text-green-700 bg-green-100',
  Verified:        'text-green-800 bg-green-200',
  Cancelled:       'text-red-700 bg-red-100',
  Disputed:        'text-red-700 bg-red-100',
  EscrowPending:   'text-yellow-700 bg-yellow-100',
  EscrowConfirmed: 'text-blue-700 bg-blue-100',
  EscrowCompleted: 'text-green-700 bg-green-100',
}

interface OrderLog {
  actor: string
  from:  string
  to:    string
  note?: string
}
interface OrderCardProps {
  order: Order & { logs: OrderLog[] }
  token: string
  currentUserId: string
}

export default function OrderCard({
  order,
  token,
  currentUserId,
}: OrderCardProps) {
  // Initial status
  const initStatus = (steps.map(s => s.key).includes(order.status as Status)
    ? order.status
    : 'Requested') as Status
  const [status, setStatus] = useState<Status>(initStatus)
  const [loading, setLoading] = useState(false)
  const [showLogs, setShowLogs] = useState(false)

  // Payment modal контрол
  const [showSimulator, setShowSimulator]     = useState(false)
  // Delivery form контрол
  const [deliveryMessage, setDeliveryMessage] = useState('')
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  // DisputeForm контрол
  const [showDisputeForm, setShowDisputeForm] = useState(false)

  const isBuyer  = order.buyer.id === currentUserId
  const isSeller = order.seller.id === currentUserId

  // Хамгийн сүүлийн Delivered лог
  const deliveredLog = [...order.logs]
    .reverse()
    .find(l => l.to === 'Delivered' && l.note)
  const hasDelivery = !!deliveredLog?.note

  // Permissions
  const canApprove = isSeller && status === 'Requested'
  const canPay     = isBuyer  && status === 'Approved'
  const canCancel  = isBuyer  && ['Requested','Approved','PendingPayment'].includes(status)
  const canDeliver = isSeller && status === 'Paid'
  const canConfirm = isBuyer  && status === 'Delivered' && hasDelivery
  const canDispute = isBuyer  && status === 'Delivered' && hasDelivery
  const canDelete  = (isBuyer||isSeller) && status === 'Cancelled'

  // Action handler
  const handleAction = async (
    action:
      | 'approve'
      | 'cancel'
      | 'markPaid'
      | 'confirm'
      | 'deliver'
      | 'delete'
  ) => {
    setLoading(true)
    try {
      let newStatus: Status|undefined
      if (action === 'approve') {
        const res = await updateOrderStatusClient(token, order.id, 'Approved')
        newStatus = res.order?.status as Status
        toast.success('Зөвшөөрөл амжилттай!')
      }
      if (action === 'cancel') {
        const res = await cancelOrderClient(token, order.id)
        newStatus = res.order?.status as Status
        toast.success('Захиалга цуцлагдлаа')
      }
      if (action === 'markPaid') {
        const res = await updateOrderStatusClient(token, order.id, 'Paid')
        newStatus = res.order?.status as Status
        toast.success('Төлбөр амжилттай хийгдлээ')
      }
      if (action === 'confirm') {
        const res = await confirmDeliveryClient(token, order.id)
        newStatus = res.order?.status as Status
        toast.success('Баталгаажууллаа')
      }
      if (action === 'deliver') {
        if (!deliveryMessage.trim()) {
          toast.error('Хүргэлтийн мэдээлэл хоосон байна')
        } else {
          const res = await updateOrderStatusClient(
            token,
            order.id,
            'Delivered',
            deliveryMessage
          )
          newStatus = res.order?.status as Status
          setShowDeliveryForm(false)
          toast.success('Хүргэлтийн мэдээлэл илгээгдлээ')
        }
      }
      if (action === 'delete') {
        if (confirm('Устгахдаа итгэлтэй байна уу?')) {
          await deleteOrderClient(token, order.id)
          toast.success('Устгагдлаа')
        }
      }
      if (newStatus) setStatus(newStatus)
    } catch (e: any) {
      toast.error(e.message || 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  // Зурагны src
  const raw = order.item.imageUrls?.[0] || ''
  const norm = raw.replace(/\\/g,'/').replace(/^\//,'')
  const src = raw
    ? `${process.env.NEXT_PUBLIC_API_URL}/${norm}`
    : '/no-image.png'

  return (
    <>
      {/* Payment Modal */}
      <AnimatePresence>
        {showSimulator && (
          <PaymentModal
            amount={order.price}
            itemName={order.item.name}
            buyerName={order.buyer.username}
            onClose={() => setShowSimulator(false)}
            onPaid={async () => {
              await handleAction('markPaid')
              setShowSimulator(false)
            }}
          />
        )}
      </AnimatePresence>

      <motion.div layout className="mb-8">
        <Card className="rounded-2xl border hover:shadow-lg">
          {/* Header */}
          <CardHeader className="flex justify-between px-6 py-4 bg-white border-b">
            <div>
              <span className="text-sm text-gray-600 mr-4"># {order.id.slice(-6)}</span>
              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              {isSeller ? 'Buyer:' : 'Seller:'}{' '}
              <span className="font-medium">
                {isSeller ? order.buyer.username : order.seller.username}
              </span>
            </div>
          </CardHeader>

          {/* Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Зураг */}
            <div className="relative w-full lg:w-1/2 h-64">
              <Image src={src} alt={order.item.name} fill className="object-contain bg-gray-50" unoptimized/>
            </div>

            <CardContent className="p-6 flex-1 space-y-4">
              {/* Buyer хүргэлтийн мэдээлэл */}
              {isBuyer && deliveredLog?.note && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded p-3">
                  <strong>Хүргэлтийн мэдээлэл:</strong>
                  <div className="whitespace-pre-line">{deliveredLog.note}</div>
                </div>
              )}

              {/* Seller хүргэлтийн форм */}
              {canDeliver && (
                <>
                  {!showDeliveryForm ? (
                    <Button
                      variant="outline"
                      className="!text-gray-900 !border-gray-300"
                      onClick={() => setShowDeliveryForm(true)}
                    >
                      Хүргэлтийн мэдээлэл илгээх
                    </Button>
                  ) : (
                    <form className="bg-gray-50 border p-4 rounded space-y-2" onSubmit={e => { e.preventDefault(); handleAction('deliver') }}>
                      <textarea
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        placeholder="Steam key, линк, заавар..."
                        value={deliveryMessage}
                        onChange={e => setDeliveryMessage(e.target.value)}
                        rows={3}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading || !deliveryMessage.trim()}>
                          {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Илгээх'}
                        </Button>
                        <Button variant="ghost" onClick={() => setShowDeliveryForm(false)}>Болих</Button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* DisputeForm */}
              {canDispute && showDisputeForm && (
                <DisputeForm
                  orderId={order.id}
                  token={token}
                  onDone={() => {
                    setShowDisputeForm(false)
                    setStatus('Disputed')
                    toast.success('Маргаан үүсгэгдлээ')
                  }}
                />
              )}  

              {/* Гоёр ямар ч үед Dispute харах товч */}
              {status === 'Disputed' && (
                <Link href={`/orders/${order.id}/dispute`}>
                  <Button variant="outline">Маргаан харах</Button>
                </Link>
              )}

              {/* Гарчиг ба статус*/}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800 truncate">
                  {order.item.name}
                </h2>
                <motion.div
                  key={status}
                  initial={{opacity:0,scale:0.8}}
                  animate={{opacity:1,scale:1}}
                  exit={{opacity:0,scale:0.8}}
                  className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusClasses[status]}`}
                >
                  {React.createElement(
                    steps.find(s => s.key === status)?.icon || Clock2,
                    { className:'w-4 h-4' }
                  )}
                  {statusLabel[status]}
                </motion.div>
              </div>

              <p className="text-lg text-gray-700">
                Үнэ:{' '}
                <span className="font-semibold text-gray-900">
                  {order.price.toLocaleString()}₮
                </span>
              </p>

              {/* Stepper */}
              <div className="flex items-center space-x-4">
                {steps.map((step,idx) => {
                  const done = steps.findIndex(s => s.key === status) >= idx
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${done?'bg-blue-600 text-white':'bg-gray-200 text-gray-500'}`}>
                          {React.createElement(step.icon, {className:'w-5 h-5'})}
                        </div>
                        <span className="mt-1 text-xs">{statusLabel[step.key]}</span>
                      </div>
                      {idx < steps.length-1 && (
                        <div className={`flex-1 h-0.5 ${done?'bg-blue-600':'bg-gray-200'}`}/>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>

              {/* Лог toggle */}
              <button
                onClick={() => setShowLogs(v => !v)}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                Лог {showLogs?'хаах':'үзэх'}
                <ChevronDown className={`ml-1 transition-transform ${showLogs?'rotate-180':''}`} size={14}/>
              </button>
              <AnimatePresence>
                {showLogs && (
                  <motion.ul
                    initial={{height:0,opacity:0}}
                    animate={{height:'auto',opacity:1}}
                    exit={{height:0,opacity:0}}
                    className="overflow-hidden text-sm text-gray-700 pl-4 list-disc space-y-1"
                  >
                    {order.logs.map((log,i) => (
                      <li key={i}>
                        <strong>{log.actor}</strong>: {statusLabel[log.from as Status]} → {statusLabel[log.to as Status]}
                        {log.note && ` (${log.note})`}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </CardContent>
          </div>

          {/* Footer */}
        <CardFooter className="flex justify-end gap-4 px-6 py-5 bg-white border-t">
          {canApprove && (
            <Button onClick={() => handleAction('approve')} disabled={loading}>
              Approve
            </Button>
          )}
          {canPay && (
            <Button onClick={() => setShowSimulator(true)} disabled={loading}>
              Pay
            </Button>
          )}
          {canCancel && (
            <Button variant="destructive" onClick={() => handleAction('cancel')} disabled={loading}>
              Cancel
            </Button>
          )}
          {canDeliver && (
            <Button
              variant="outline"
              onClick={() => setShowDeliveryForm(true)}
              disabled={loading}
            >
              Хүргэлтийн мэдээлэл илгээх
            </Button>
          )}
          {canConfirm && (
            <Button onClick={() => handleAction('confirm')} disabled={loading}>
              Баталгаажуулах
            </Button>
          )}
          {canDispute && (
            <Button variant="destructive" onClick={() => setShowDisputeForm(v => !v)} disabled={loading}>
              Маргаан үүсгэх
            </Button>
          )}

          {/* Тод шар өнгөөр харагдах “хүлээж байна” товч */}
          {(isBuyer && status === 'Paid' && !hasDelivery) && (
            <Button
              disabled
              className="bg-yellow-100 text-yellow-900 cursor-not-allowed"
            >
              Хүргэлтийн мэдээлэл хүлээж байна...
            </Button>
          )}

          {canDelete && (
            <Button variant="destructive" onClick={() => handleAction('delete')} disabled={loading}>
              Delete
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
    </>
  )
}
