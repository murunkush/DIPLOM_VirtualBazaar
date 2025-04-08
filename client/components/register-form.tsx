"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  signupAction,
  type RegisterFormState,
} from "@/app/actions/auth-actions";
import { registerSchema } from "@/lib/zod";

function SubmitButton({ pendingText = "Илгээж байна...", text = "Илгээх" }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? pendingText : text}
    </Button>
  );
}

export function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const initialState: RegisterFormState = { errors: {} };
  const [state, formAction] = useActionState(signupAction, initialState);

  useEffect(() => {
    if (state.errors?.username) {
      form.setError("username", { message: state.errors.username[0] });
    }
    if (state.errors?.email) {
      form.setError("email", { message: state.errors.email[0] });
    }
    if (state.errors?.password) {
      form.setError("password", { message: state.errors.password[0] });
    }
    if (state.errors?.confirmPassword) {
      form.setError("confirmPassword", {
        message: state.errors.confirmPassword[0],
      });
    }
    if (state.errors?._form || state.errors?.confirmPassword) {
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
    }
  }, [state.errors, form]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Бүртгэл үүсгэх
        </CardTitle>
        <CardDescription className="text-center">
          Бүртгүүлэхийн тулд доорх мэдээллийг оруулна уу
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.errors?._form && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{state.errors._form[0]}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Хэрэглэгчийн нэр</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Таны хэрэглэгчийн нэр"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>И-мэйл</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="yourmail@example.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нууц үг</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нууц үг баталгаажуулах</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton text="Бүртгэл үүсгэх" pendingText="Үүсгэж байна..." />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Бүртгэлтэй юу?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Нэвтрэх
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

