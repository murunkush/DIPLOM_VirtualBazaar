'use client'
import React from 'react'

export default function IllustrationEmptyOrders({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="#F3F4F6" />
      <path d="M60 90h80v20H60z" fill="#E5E7EB" />
      <path d="M80 60h40v20H80z" fill="#E5E7EB" />
    </svg>
  )
}
