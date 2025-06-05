"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export type ItemCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
};

export const ItemCard: React.FC<ItemCardProps> = ({
  id,
  name,
  description,
  price,
  images,
}) => {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const imageUrl = images?.[0]
    ? `${process.env.NEXT_PUBLIC_API_URL}/${images[0]}`
    : "/no-image.png";

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    toast(liked ? "Wishlist-с хасагдлаа" : "Wishlist-д нэмэгдлээ");
  };

  return (
    <Card
      onClick={() => router.push(`/item/${id}`)}
      className="h-full flex flex-col backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
    >
      <div className="relative w-full h-48">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </AspectRatio>
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-1 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white"
        >
          <Heart
            className={`w-5 h-5 ${liked ? "text-pink-500" : "text-gray-600"}`}  
          />
        </button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="text-lg font-semibold text-gray-900 truncate"
            title={name}
          >
            {name}
          </h3>
          <p
            className="mt-1 text-sm text-gray-600 line-clamp-2"
            title={description || "Тайлбаргүй"}
          >
            {description || "Тайлбаргүй"}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2 flex items-center justify-between border-t border-white/20">
        <span className="text-lg font-bold text-gray-900">
          {price.toLocaleString()}₮
        </span>
      </CardFooter>
    </Card>
  );
};
