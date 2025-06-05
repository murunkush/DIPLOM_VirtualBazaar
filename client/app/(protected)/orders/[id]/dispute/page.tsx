// src/app/orders/[id]/dispute/page.tsx
import DisputeViewer from '@/components/DisputeViewer'
import { verifySession, getUser } from '@/lib/dal'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

type Props = {
  params: { id: string }
}

export default async function OrderDisputePage({ params }: Props) {
  const { token } = await verifySession()
  const user = await getUser()
  const isAdmin = user.role === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back navigation */}
      <Link
        href="/orders"
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Захиалгууд руу буцах
      </Link>

      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-900">
        Захиалга #{params.id} — Маргаан удирдах
      </h1>

      {/* Divider */}
      <hr className="border-t border-gray-200" />

      {/* Dispute Viewer Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Маргаан удирдах самбар
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DisputeViewer
            orderId={params.id}
            token={token}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
    </div>
  )
}
