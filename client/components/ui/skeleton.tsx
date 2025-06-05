"use client";

import { cn } from "@/lib/utils"; // Хэрвээ хэрэгтэй бол

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-200/20",
        className
      )}
      {...props}
    />
  );
}
