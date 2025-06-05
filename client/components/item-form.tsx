"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, X, ImagePlus } from "lucide-react"
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
    { message: "Үнэ 0-ээс их, 1000000-ээс бага байх ёстой" }
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
    setFiles((prevFiles) => [...prevFiles, ...fileArray])
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

      files.forEach((image) => {
        formData.append("images", image)
      })

      const result = await addItem(formData)

      if (result.success) {
        toast.success("Амжилттай нэмэгдлээ!")
        form.reset()
        setFiles([])
        router.push("/")
      } else {
        toast.error("Алдаа", { description: result.message })
      }
    } catch (error) {
      toast.error("Сервер алдаа", {
        description: "Сервертэй холбогдох үед алдаа гарлаа.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-background shadow-sm rounded-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold text-gray-900 text-center">
          Шинэ бараа нэмэх
        </CardTitle>
        <CardDescription className="text-center text-gray-500">
          Барааны бүрдүүлэлтийг бөглөнө үү
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Нэр</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Барааны нэр"
                        className="rounded-lg border-gray-300 focus:ring-1 focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Үнэ (₮)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={1000000}
                        placeholder="0"
                        className="rounded-lg border-gray-300 focus:ring-1 focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Тайлбар</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Барааны дэлгэрэнгүй тайлбар"
                      className="rounded-lg border-gray-300 focus:ring-1 focus:ring-primary resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Game Selector */}
            <FormField
              control={form.control}
              name="game"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Тоглоом</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg border-gray-300 focus:ring-1 focus:ring-primary text-gray-900">
                        <SelectValue 
                          placeholder="Тоглоом сонгох" 
                          className="placeholder:text-gray-400"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-lg shadow-lg border border-gray-100">
                      <SelectItem 
                        value="MLBB" 
                        className="hover:bg-gray-50 text-gray-900"
                      >
                        <span className="font-medium">Mobile Legends: Bang Bang</span>
                      </SelectItem>
                      <SelectItem 
                        value="DOTA2" 
                        className="hover:bg-gray-50 text-gray-900"
                      >
                        <span className="font-medium">DOTA 2</span>
                      </SelectItem>
                      <SelectItem 
                        value="CS2" 
                        className="hover:bg-gray-50 text-gray-900"
                      >
                        <span className="font-medium">Counter-Strike 2</span>
                      </SelectItem>
                      <SelectItem 
                        value="PUBGmobile" 
                        className="hover:bg-gray-50 text-gray-900"
                      >
                        <span className="font-medium">PUBG Mobile</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            {/* Image Upload */}
            <FormItem>
              <FormLabel className="text-gray-700">Зураг</FormLabel>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {files.map((file, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="image-upload"
                    className="aspect-square cursor-pointer flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors bg-gray-50"
                  >
                    <ImagePlus className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-500">Зураг нэмэх</span>
                  </label>
                </div>

                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  id="image-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {fileError && (
                  <p className="text-sm text-red-500">{fileError}</p>
                )}
                {files.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {files.length} зураг сонгогдсон
                  </p>
                )}
              </div>
            </FormItem>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-lg py-6 text-base font-medium transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Хадгалж байна...
                </>
              ) : (
                "Бараа нэмэх"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}