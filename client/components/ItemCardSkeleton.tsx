"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function ItemCardSkeleton() {
  return (
    <Card className="h-full bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl overflow-hidden animate-pulse">
      <div className="relative w-full h-48 bg-gray-200/40" />
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="h-6 bg-gray-300/60 rounded w-3/4" />
        <div className="h-4 bg-gray-300/60 rounded w-full" />
      </div>
      <div className="p-6 pt-0 border-t border-white/30 flex items-center justify-between">
        <div className="h-4 bg-gray-300/60 rounded w-1/4" />
        <div className="h-6 bg-gray-300/60 rounded w-1/3" />
      </div>
    </Card>
  );
}