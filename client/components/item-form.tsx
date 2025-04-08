"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { addItem } from "@/app/actions/item-actions"

const formSchema = z.object({
  name: z.string().min(1, { message: "Нэр оруулна уу" }),
  description: z.string().min(1, { message: "Тайлбар оруулна уу" }),
  price: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num <= 1000000
    },
    { message: "Үнэ 0-ээс их, 1000000-ээс бага байх ёстой" },
  ),
  game: z.string().min(1, { message: "Тоглоом сонгоно уу" }),
})

export function AddItemForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      game: "MLBB",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) {
      setFileError("Зураг оруулна уу")
      setFiles([])
      return
    }

    const fileArray = Array.from(selectedFiles)
    setFiles(fileArray)
    setFileError(null)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (files.length === 0) {
      setFileError("Зураг оруулна уу")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("description", values.description)
      formData.append("price", values.price)
      formData.append("game", values.game)

      // Add files
      files.forEach((file) => {
        formData.append("images", file)
      })

      const result = await addItem(formData)

      if (result.success) {
        toast.success("Амжилттай",)
        router.push("/")
      } else {
        toast.error("Алдаа",{
          description: result.message,
        })
      }
    } catch (error) {
      toast.error("Алдаа", {
        description: "Сервертэй холбогдох үед алдаа гарлаа.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Бараа нэмэх</CardTitle>
        <CardDescription className="text-center">Барааны мэдээллийг бөглөнө үү</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нэр</FormLabel>
                  <FormControl>
                    <Input placeholder="Барааны нэр" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тайлбар</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Барааны тайлбар" className="resize-none" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Үнэ (₮)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>Үнэ 0-ээс их, 1,000,000-ээс бага байх ёстой</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="game"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тоглоом</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Тоглоом сонгоно уу" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MLBB">MLBB</SelectItem>
                      <SelectItem value="DOTA2">DOTA2</SelectItem>
                      <SelectItem value="CS2">CS2</SelectItem>
                      <SelectItem value="PUBGmobile">PUBGmobile</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Зураг</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </FormControl>
              {fileError && <p className="text-sm font-medium text-destructive mt-2">{fileError}</p>}
              {files.length > 0 && <FormDescription>{files.length} зураг сонгогдсон</FormDescription>}
            </FormItem>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Нэмэгдэж байна...
                </>
              ) : (
                "Нэмэх"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

