import { verifySession } from "@/lib/dal"
import type { Item } from "@/lib/dal"
import ItemClient from "./itemClient"

type ItemDetailPageProps = {
  params: { id: string }
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const session = await verifySession()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/${params.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    const errorMessage = error.message || "Тодорхойгүй алдаа гарлаа"
    return (
      <div className="min-h-screen bg-white text-black pt-20 p-4 text-center">
        ⚠️ Алдаа гарлаа: <br />
        {errorMessage}
      </div>
    )
  }

  const rawItem = await res.json()

  const sellerId =
    typeof rawItem.seller === "string"
      ? rawItem.seller
      : rawItem.seller?._id || null

  const item: Item = {
    id: rawItem._id,
    name: rawItem.name,
    description: rawItem.description,
    price: rawItem.price,
    images: rawItem.images || [],
    game: rawItem.game || "",
    imageUrls: rawItem.imageUrls || [],
    seller: sellerId
      ? {
          id: sellerId,
          username: rawItem.seller?.username || "",
          email: rawItem.seller?.email || "",
        }
      : null,
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <ItemClient item={item} token={session.token} />
    </div>
  )
}
