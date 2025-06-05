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
import { loginAction, type LoginFormState } from "@/app/actions/auth-actions";
import { loginSchema } from "@/lib/zod";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Нэвтэрч байна..." : "Нэвтрэх"}
    </Button>
  );
}

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const initialState: LoginFormState = { errors: {} };
  const [state, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.errors?.email) {
      form.setError("email", { message: state.errors.email[0] });
    }
    if (state.errors?.password) {
      form.setError("password", { message: state.errors.password[0] });
    }
  }, [state.errors, form]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Нэвтрэх
        </CardTitle>
        <CardDescription className="text-center">
          Бүртгэлдээ нэвтрэхийн тулд и-мэйл, нууц үгээ оруулна уу
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
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Нууц үгээ мартсан уу?
          </Link>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Бүртгэлгүй юу?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Бүртгэл үүсгэх
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}