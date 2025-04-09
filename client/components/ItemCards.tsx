"use client"

import type React from "react"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CircleDollarSign } from "lucide-react"

type ItemCardProps = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
}

export const ItemCard: React.FC<ItemCardProps> = ({ id, name, description, price, images }) => {
  const imageUrl =
    images && images.length > 0
      ? `${process.env.NEXT_PUBLIC_API_URL}/${images[0]}`
      : "https://via.placeholder.com/300x200?text=No+Image"

  return (
    <Card key={id} className="overflow-hidden max-w-[280px] bg-white gap-3 border-gray-200 shadow-sm relative">
      {/* Ocean blue gradient border on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 280px"
          />
          <div className="absolute inset-0 p-3 flex flex-col justify-between bg-gradient-to-t from-black/70 to-transparent">
          <div className="text-right"><span className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-semibold px-3 py-0.5 rounded-full shadow-md hover:scale-105 transition-transform duration-300 animate-pulse">{price.toLocaleString()}₮</span></div>

            <div className="mt-auto">
              <h3 className="font-bold text-lg text-[#e4f1a9] uppercase">{name}</h3>
            </div>
          </div>
        </AspectRatio>
      </div>

      <CardContent className="px-3 py-0 flex items-center gap-2">
        <span className="font-medium text-gray-800">{description}</span>
      </CardContent>
    </Card>
  )
}
