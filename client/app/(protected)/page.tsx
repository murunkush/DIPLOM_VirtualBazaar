import { getItems } from "@/lib/dal";
import { ItemCard } from "@/components/ItemCards";
import { PackageOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default async function MainPage() {
  const items = await getItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 py-10 px-6 sm:px-8 lg:px-12">
      {/* Add top padding so header isn't hidden by navbar */}
      <div className="pt-20">
        {/* Header */}
        <header className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Барааны каталог
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Input placeholder="Хайх нэрээр..." className="flex-1" />
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Ширхэглэ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="new">Шинэ(arr)</SelectItem>
                    <SelectItem value="priceLow">Үнэ багаас их</SelectItem>
                    <SelectItem value="priceHigh">Үнэ ихээс бага</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button>Хайх</Button>
            </div>
          </div>
        </header>

        {/* Grid */}
        <main className="max-w-7xl mx-auto">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          ) : (
            <div className="text-center py-24">
              <div className="mx-auto h-28 w-28 text-gray-400 mb-6">
                <PackageOpen className="w-full h-full animate-pulse" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">
                Бараа олдсонгүй
              </h3>
              <p className="mt-2 text-gray-700 max-w-md mx-auto">
                Уг ангилалд бараа байхгүй байна. Дараа дахин шалгана уу.
              </p>
              <Button className="mt-6" variant="outline">
                Бидэнтэй холбогдох
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
