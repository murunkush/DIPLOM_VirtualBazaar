"use server";

import { loginSchema, registerSchema } from "@/lib/zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
};

export type RegisterFormState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Маягт дахь алдааг засна уу.",
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: {
          _form: [
            data.message ||
              "Нэвтрэх мэдээлэл буруу байна. Дахин оролдоно уу.",
          ],
        },
        success: false,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("session", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Нэвтрэх үйлдлийн алдаа:", error);
    return {
      errors: {
        _form: ["Гэнэтийн алдаа гарлаа. Дахин оролдоно уу."],
      },
      success: false,
    };
  }

  redirect("/");
}

export async function signupAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const validatedFields = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Маягт дахь алдааг засна уу.",
      success: false,
    };
  }

  const { username, email, password } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: {
          _form: [
            data.message || "Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу.",
          ],
        },
        success: false,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("session", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("Бүртгүүлэх үйлдлийн алдаа:", error);
    return {
      errors: {
        _form: ["Гэнэтийн алдаа гарлаа. Дахин оролдоно уу."],
      },
      success: false,
    };
  }

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

