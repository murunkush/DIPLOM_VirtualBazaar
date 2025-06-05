// components/StatCard.tsx
'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
}

export default function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4 shadow">
      <div className="p-2 bg-blue-100 rounded-full">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <CardContent className="p-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </CardContent>
    </Card>
  )
}
