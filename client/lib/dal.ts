// src/lib/dal.ts
'use server'
import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { decrypt } from './session'

// --- Төрлүүд тодорхойлов ---
export type User = { id: string; username: string; email: string; role?: string }
export type Item = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  game: string
  imageUrls: string[]
  seller?: User | null
}
export type BasketItem = { id: string; name: string; price: number; imageUrl: string; quantity?: number }
export type OrderLog = { actor: string; from: string; to: string; note?: string }
export type Order = {
  id: string
  buyer: User
  seller: User
  item: Item
  price: number
  deliveryInfo?: { trackingNumber: string; message?: string }
  status:
    | 'Requested'
    | 'Approved'
    | 'PendingPayment'
    | 'Paid'
    | 'Delivered'
    | 'Verified'
    | 'Cancelled'
    | 'Disputed'
    | 'EscrowPending'
    | 'EscrowConfirmed'
    | 'EscrowCompleted'
  createdAt: string
  updatedAt: string
  logs: OrderLog[]
}

// --- Session шалгах ---
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session?.id) redirect('/login')
  return { token: cookie! }
})

// --- Хэрэглэгчийн мэдээлэл татах ---
export const getUser = cache(async (): Promise<User> => {
  const { token } = await verifySession()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) redirect('/login')
  const u = await res.json()
  return {
    id: u._id,
    username: u.username,
    email: u.email,
    role: u.role ?? 'user',
  }
})

// --- Бүх бараа татах ---
export const getItems = cache(async (): Promise<Item[]> => {
  const { token } = await verifySession()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Items fetch алдаа')
  const raw = await res.json()
  return raw.map((i: any) => ({
    id: i._id,
    name: i.name,
    description: i.description,
    price: i.price,
    images: i.images || [],
    game: i.game || '',
    imageUrls: i.imageUrls || [],
    seller: i.seller
      ? { id: i.seller._id || i.seller.id, username: i.seller.username, email: i.seller.email }
      : null,
  }))
})

// --- Wishlist ---
export const getWishlistItems = cache(async (token: string): Promise<Item[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Wishlist татахад алдаа гарлаа')
  const raw = await res.json()
  return raw.items.map((item: any) => ({
    id: item._id || item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    images: item.images || [],
    game: item.game || '',
    imageUrls: item.imageUrls || [],
    seller: item.seller
      ? { id: item.seller._id, username: item.seller.username, email: item.seller.email }
      : null,
  }))
})

export const removeFromWishlist = cache(async (token: string, itemId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${itemId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Wishlist-ээс устгахад алдаа гарлаа')
})

// **Шинээр нэмэх: Wishlist цэвэрлэх функц**
export const clearWishlist = cache(async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Wishlist цэвэрлэхэд алдаа гарлаа')
})

// --- Захиалга ---
export const createOrder = cache(async (token: string, data: { seller: string; item: string; price: number }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Захиалга үүсгэхэд алдаа гарлаа')
  return await res.json()
})

// --- Бүх захиалгыг татах ---
export const getAllOrders = cache(async (token: string): Promise<Order[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Захиалгуудыг авахад алдаа гарлаа')
  const raw: any[] = await res.json()

  return raw.map(o => {
    const buyer = o.buyer || {}
    const seller = o.seller || {}
    const item = o.item   || {}
    // map logs
    const logs: OrderLog[] = Array.isArray(o.logs)
      ? o.logs.map((l: any) => ({
          actor: l.actor,
          from:  l.from,
          to:    l.to,
          note:  l.note || undefined
        }))
      : []

    return {
      id:        o._id,
      buyer:     { id: buyer._id || '', username: buyer.username, email: buyer.email },
      seller:    { id: seller._id || '', username: seller.username, email: seller.email },
      item:      {
        id:        item._id            || '',
        name:      item.name           || '',
        description:item.description    || '',
        price:     item.price          || 0,
        images:    item.images         || [],
        game:      item.game           || '',
        imageUrls: item.imageUrls      || [],
      },
      price:     o.price,
      status:    o.status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      logs,     // ← энд дамжуулна
    }
  })
})

// --- Нэг захиалгын мэдээлэл авах ---
export const getOrderById = cache(async (token: string, id: string): Promise<Order> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Order fetch алдаа')
  const o: any = await res.json()
  const buyer = o.buyer || {}
  const seller = o.seller || {}
  const item   = o.item   || {}
  const logs: OrderLog[] = Array.isArray(o.logs)
    ? o.logs.map((l: any) => ({
        actor: l.actor,
        from:  l.from,
        to:    l.to,
        note:  l.note || undefined
      }))
    : []

  return {
    id:        o._id,
    buyer:     { id: buyer._id || '', username: buyer.username, email: buyer.email },
    seller:    { id: seller._id || '', username: seller.username, email: seller.email },
    item:      {
      id:        item._id         || '',
      name:      item.name        || '',
      description:item.description || '',
      price:     item.price       || 0,
      images:    item.images      || [],
      game:      item.game        || '',
      imageUrls: item.imageUrls   || [],
    },
    price:     o.price,
    status:    o.status,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    logs,     // ← энд нэмэгдлээ
  }
})

// --- Захиалгын төлөв шинэчлэх ---
export const updateOrderStatus = cache(async (
  token: string,
  id: string,
  status: string,
  note?: string
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status, note }), // note-ийг дамжуулж байна
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('⚠️ Захиалгын төлөв шинэчлэхэд backend-с ирсэн алдаа:', text)
    throw new Error('Order status update алдаа')
  }
  return await res.json()
})

// --- Захиалга цуцлах ---
export const cancelOrder = cache(async (token: string, id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/cancel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Order cancel алдаа')
  return await res.json()
})

// --- Хүргэлт баталгаажуулах ---
export const confirmDelivery = cache(async (token: string, id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/confirm`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Order confirm алдаа')
  return await res.json()
})
