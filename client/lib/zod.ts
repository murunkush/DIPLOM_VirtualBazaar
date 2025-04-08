import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Хүчинтэй и-мэйл хаяг оруулна уу" }),
  password: z
    .string()
    .min(6, { message: "Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой" }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Хэрэглэгчийн нэр дор хаяж 3 тэмдэгттэй байх ёстой" }),
    email: z.string().email({ message: "Хүчинтэй и-мэйл хаяг оруулна уу" }),
    password: z
      .string()
      .min(6, { message: "Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"], // Алдааг баталгаажуулах нууц үгийн талбарт хамааруулна
  });

