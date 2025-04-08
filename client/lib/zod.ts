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

export const itemSchema = z.object({
  name: z.string().min(1, { message: "Нэр оруулна уу" }),
  description: z.string().min(1, { message: "Тайлбар оруулна уу" }),
  price: z
    .number()
    .min(0, { message: "Үнэ 0-ээс их байх ёстой" })
    .max(1000000, { message: "Үнэ 1000000-ээс бага байх ёстой" }),
  images: z.array(z.instanceof(File)).min(1, { message: "Зураг оруулна уу" }),
  game: z.string().min(1, { message: "Тоглоом сонгоно уу" }),
});
