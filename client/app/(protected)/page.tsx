import { getItems } from '@/lib/dal'
import { ItemCard } from '@/components/ItemCards'

export default async function MainPage() {
  const items = await getItems()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-semibold">Барааны жагсаалт</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            images={item.imageUrls}
          />
        ))}
      </div>
    </div>
  )
}