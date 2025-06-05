'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Tag } from 'lucide-react'
import StatCard from '@/components/StatCard'
import OrderCard from '@/components/OrderCard'
import IllustrationEmptyOrders from '@/components/IllustrationEmptyOrders'
import type { Order } from '@/lib/dal'

interface OrdersTabsProps {
  purchaseOrders: Order[]
  salesOrders:    Order[]
  token:          string
  currentUserId:  string
  isAdmin:        boolean
}

type Tab = 'purchase' | 'sales'
const tabs: { key: Tab; label: string; icon: React.FC<any> }[] = [
  { key: 'purchase', label: 'Худалдан авалт', icon: ShoppingCart },
  { key: 'sales',    label: 'Борлуулалт',     icon: Tag },
]

export default function OrdersTabs({
  purchaseOrders,
  salesOrders,
  token,
  currentUserId,
  isAdmin
}: OrdersTabsProps) {
  const [tab, setTab] = useState<Tab>('purchase')
  const list = (tab === 'purchase' ? purchaseOrders : salesOrders).map(o => ({
    ...o,
    // deliveryInfo нь backend-с шууд string ирж байвал
    deliveryInfo: typeof o.deliveryInfo === 'string'
      ? o.deliveryInfo
      : '' 
  }))

  const emptyMsg =
    tab === 'purchase'
      ? 'Та худалдан авалтгүй байна.'
      : 'Та борлуулалтгүй байна.'
  const pendingCount = list.filter(o => o.status === 'PendingPayment').length

  return (
    <div className="flex space-x-4 w-full">
      <nav
        aria-label="Orders Tabs"
        className="flex flex-col space-y-2 p-4 bg-white/50 backdrop-blur-md rounded-xl shadow w-60"
      >
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = tab === key
          const count = key === 'purchase' ? purchaseOrders.length : salesOrders.length
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                isActive ? 'bg-blue-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 text-gray-600" />
              <span>{label} ({count})</span>
            </button>
          )
        })}
      </nav>

      <section className="flex-1">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            {tab === 'purchase' ? 'Худалдан авалт' : 'Борлуулалт'}
          </h1>
          <div className="flex gap-4 mt-4">
            <StatCard icon={ShoppingCart} label="Total"   value={list.length} />
            <StatCard icon={Tag}          label="Pending" value={pendingCount}  />
          </div>
        </header>

        {list.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 space-y-6">
            <IllustrationEmptyOrders className="w-64 h-64 animate-fade-in" />
            <p className="text-gray-500 text-lg">{emptyMsg}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {list.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  token={token}
                  currentUserId={currentUserId}
                  //isAdmin={isAdmin}        // ✔ энд дамжууллаа
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}
