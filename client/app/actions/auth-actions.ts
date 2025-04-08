"use server"

import { cookies } from "next/headers" // Import cookies here
import { redirect } from "next/navigation"
import { loginSchema } from "@/lib/zod"

export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors in the form.",
      success: false,
    }
  }

  const { email, password } = validatedFields.data

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        errors: {
          _form: [data.message || "Invalid credentials. Please try again."],
        },
        success: false,
      }
    }

    const cookieStore = await cookies()
    cookieStore.set("session", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "lax",
      path: "/",
    })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error // Re-throw the redirect error
    }
    console.error("Login Action Error:", error) // Log the actual error
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      success: false,
    }
  }

  redirect("/")
}

