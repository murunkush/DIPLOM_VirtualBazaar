import { AddItemForm } from "@/components/item-form"

export const metadata = {
  title: "Бараа нэмэх",
  description: "Шинэ бараа нэмэх хуудас",
}

export default function AddItemPage() {
  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="container mx-auto">
        <AddItemForm />
      </div>
    </div>
  )
}
