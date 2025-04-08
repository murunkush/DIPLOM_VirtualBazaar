import 'server-only'
 
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { decrypt } from './session'

export type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
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
