"use server"

import { verifySession } from "@/lib/dal"
import { itemSchema } from "@/lib/zod"
import { redirect } from "next/navigation"

export const addItem = async (item: FormData) => {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const formData = {
    name: item.get('name'),
    description: item.get('description'),
    price: parseInt(item.get('price') as string),
    category: item.get('category'),
    game: item.get('game'),
    images: [item.get('images')],
  }
  const validatedFields = itemSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Маягт дахь алдааг засна уу.',
      success: false,
    }
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(validatedFields.data),
  })

  const data = await res.json()

  if (!res.ok) {
    return {message: 'Бараа нэмэхэд алдаа гарлаа: ' + data.message, success: false}
  }

  return {message: 'Бараа амжилттай нэмэгдлээ.', success: true} 
}

