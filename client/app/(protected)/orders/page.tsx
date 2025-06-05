// File: app/(protected)/orders/page.tsx

import type { Metadata } from 'next'
import OrdersTabs from '@/components/OrdersTabs'
import { verifySession, getUser, getAllOrders } from '@/lib/dal'

export const metadata: Metadata = {
  title: 'Захиалгууд | Your App Name',
  description: 'Manage your orders',
}

export default async function OrdersPage() {
  // 1️⃣ Сесс шалгах, токен авах
  const { token } = await verifySession()
  if (!token) throw new Error('Token олдсонгүй!')

  // 2️⃣ Хэрэглэгчийн мэдээллийг авах
  const user    = await getUser()
  const userId  = user.id
  const isAdmin = user.role === 'admin'

  // 3️⃣ Бүх захиалгуудыг татаж, худалдан авалт ба борлуулалтыг тусгаарлах
  const orders         = await getAllOrders(token)
  const purchaseOrders = orders.filter(o => o.buyer.id === userId)
  const salesOrders    = orders.filter(o => o.seller.id === userId)

  // 4️⃣ UI-д дамжуулах
  return (
    <div className="flex min-h-screen bg-slate-50 pt-16 pl-8">
      <OrdersTabs
        purchaseOrders={purchaseOrders}
        salesOrders={salesOrders}
        token={token}
        currentUserId={userId}
        isAdmin={isAdmin}
      />
    </div>
  )
}
