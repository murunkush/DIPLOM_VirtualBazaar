"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Item } from "@/lib/dal";
import { getWishlistItems, removeFromWishlist, clearWishlist } from "@/lib/dal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Trash2, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

type Props = { token: string };

export default function WishlistClient({ token }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getWishlistItems(token);
        setItems(res);
      } catch {
        toast.error("Алдаа: Wishlist татахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const onRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await removeFromWishlist(token, id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Бараа амжилттай устгагдлаа");
    } catch {
      toast.error("Алдаа: Бараа устгахад алдаа гарлаа");
    } finally {
      setRemovingId(null);
    }
  };

  const onClearAll = async () => {
    if (items.length === 0) return;
    if (!confirm("Бүх wishlist-ээ устгах уу?")) return;
    setClearing(true);
    try {
      await clearWishlist(token);
      setItems([]);
      toast.success("Wishlist цэвэрлэгдлээ");
    } catch {
      toast.error("Алдаа: Wishlist цэвэрлэхэд алдаа гарлаа");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-72 bg-white/20 backdrop-blur-lg rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Heart className="w-20 h-20 text-gray-300 mb-4 animate-pulse" />
        <h2 className="text-3xl font-semibold text-gray-700 mb-2">
          Таны Wishlist хоосон байна
        </h2>
        <p className="text-lg text-gray-500 text-center max-w-md">
          Дуртай бараагаа энд нэмээрэй, тэндээсээ удахгүй эргэн хараарай.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={onClearAll}
          disabled={clearing}
          className="bg-red-600 text-white"
        >
          {clearing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Бүхийг устгах"
          )}
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item) => {
            const img = item.imageUrls[0]
              ? `${process.env.NEXT_PUBLIC_API_URL}/${item.imageUrls[0]}`
              : "/no-image.png";

            return (
              <motion.div
                key={item.id}
                layout
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl overflow-hidden">
                  <div className="relative w-full h-64">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={img}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </AspectRatio>
                    <button
                      onClick={() => onRemove(item.id)}
                      disabled={removingId === item.id}
                      className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
                    >
                      {removingId === item.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                      ) : (
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-gray-700 text-base">
                        {item.description || "Тайлбаргүй"}
                      </p>
                    </div>
                    <CardFooter className="mt-4 flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{item.game}</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {item.price.toLocaleString()}₮
                      </span>
                    </CardFooter>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}