import 'server-only'
 
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { decrypt } from './session'

export type User = {
  id: string
  username: string
  email: string
  isAdmin: boolean
}

export type Item = {
  id: string
  name: string
  description: string
  price: number
  images: File[]
  game: string
  imageUrls: string[]
}

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.id) {
    redirect('/login')
  }
 
  return { isAuth: true, token: cookie }
})

export const getUser = cache(async () => {
  const session = await verifySession()
 
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
  })

  if (!res.ok) {
    redirect('/login')
  }

  const user: User = await res.json()
  return user
})

export const getItems = cache(async () => {
  const session = await verifySession()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Items татаж чадсангүй.')
  }

  const items: Item[] = await res.json()
  return items
})