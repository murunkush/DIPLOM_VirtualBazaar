// app/(protected)/wishlist/page.tsx

import type { Metadata } from "next";
import BackgroundPaths from "@/components/BackgroundPaths";
import WishlistClient from "@/components/wishlist-client";
import { verifySession } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Wishlist | Your App Name",
  description: "View and manage your wishlist",
};

export default async function WishlistPage() {
  const session = await verifySession();
  if (!session?.token) throw new Error("Token олдсонгүй!");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-300">
      {/* Ар талд хөдөлгөөнт зураасууд */}
      <BackgroundPaths />

      {/* Гол контент */}
      <main className="relative z-10 pt-36 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Таны Wishlist
          </h1>
          <WishlistClient token={session.token} />
        </div>
      </main>
    </div>
  );
}
