'use client'

import type { Item } from "@/lib/dal"
import Image from "next/image"
import { useState } from "react"
import { Dialog } from "@headlessui/react"
import { Mail, User, Heart, ShoppingBag, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createOrder } from "@/lib/dal"

type ItemClientProps = {
  item: Item
  token?: string
}

export default function ItemClient({ item, token }: ItemClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)

  const handleAddToWishlist = async () => {
    if (!token) return toast.error("⚠️ Нэвтэрнэ үү.")
    try {
      setWishlistLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: item.id }),
      })
      const data = await res.json()
      if (res.ok) toast.success("💖 Wishlist-д нэмэгдлээ")
      else toast.error(`⚠️ ${data.message || "Алдаа гарлаа"}`)
    } catch {
      toast.error("❌ Сүлжээний алдаа")
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleOrder = async () => {
    if (!token) return toast.error("⚠️ Нэвтэрнэ үү.")
    if (!item.seller?.id) return toast.error("⚠️ Борлуулагч тодорхойгүй")
    try {
      setOrderLoading(true)
      await createOrder(token, {
        seller: item.seller.id,
        item: item.id,
        price: item.price,
      })
      toast.success("🎉 Захиалга амжилттай илгээгдлээ")
    } catch (e: any) {
      toast.error(`❌ ${e.message || "Захиалж чадахгүй байлаа"}`)
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div className="pt-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto text-black font-sans bg-white">
      <div className="bg-white border border-gray-200 p-8 mb-20 rounded-3xl shadow-lg transition-all duration-500">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{item.name}</h1>
        <p className="text-base mb-6 leading-relaxed text-gray-700">{item.description}</p>
        <p className="text-3xl font-semibold text-gray-800 mb-8">
          {item.price.toLocaleString()}₮
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Захиалах товч */}
          <button
            onClick={handleOrder}
            disabled={orderLoading}
            className="bg-gray-800 hover:bg-black text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition duration-300"
          >
            {orderLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShoppingBag size={20} />
            )}
            Захиалах
          </button>

          {/* Wishlist товч */}
          <button
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition duration-300"
          >
            {wishlistLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart size={20} />
            )}
            Wishlist-д нэмэх
          </button>
        </div>

        <div className="mt-12 p-6 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm flex items-center gap-6">
          <Image
            src="/avatar-placeholder.png"
            alt="Seller avatar"
            width={72}
            height={72}
            className="rounded-full border border-gray-300 shadow"
          />
          <div>
            <h2 className="text-md font-semibold text-gray-700 mb-2">
              Борлуулагчийн мэдээлэл
            </h2>
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} /> {item.seller?.username || "Тодорхойгүй"}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={16} /> {item.seller?.email || "Тодорхойгүй"}
            </p>
          </div>
        </div>
      </div>

      {/* Зурагнууд */}
      {item.imageUrls?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {item.imageUrls.map((url, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-2xl overflow-hidden border border-gray-200 shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              onClick={() => setSelectedImage(`${process.env.NEXT_PUBLIC_API_URL}/${url}`)}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${url}`}
                alt={`Зураг ${index + 1}`}
                className="w-full h-56 object-cover brightness-95 hover:brightness-100 transition"
              />
            </div>
          ))}
        </div>
      )}

      {/* Том зураг (lightbox) */}
      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-red-400 transition"
          >
            ×
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Том зураг"
              className="w-full h-auto max-h-[90vh] rounded-2xl shadow-2xl border border-white/20"
            />
          )}
        </div>
      </Dialog>
    </div>
  )
}
