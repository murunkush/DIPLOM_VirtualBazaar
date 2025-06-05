import { AddItemForm } from "@/components/item-form"
import BackgroundPaths from "@/components/BackgroundPaths"

export const metadata = {
  title: "Бараа нэмэх",
  description: "Шинэ бараа нэмэх хуудас",
}

export default function AddItemPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Paths компонент */}
      <BackgroundPaths />

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Шинэ бараа бүртгэх
          </h1>
          <p className="text-gray-500 text-lg">
            Барааны мэдээллийг бүрэн бөглөнө үү
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 backdrop-blur-sm bg-opacity-50">
          <AddItemForm />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Барааны мэдээллийг өөрчлөх боломжгүйг анхаарна уу</p>
        </div>
      </div>
    </div>
  )
}