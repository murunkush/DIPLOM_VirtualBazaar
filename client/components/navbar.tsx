"use client";

import { useRouter } from "next/navigation";
import { Heart, Package, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/app/actions/auth-actions";

const navItems = [
  { icon: Plus, label: "Add Item", href: "/add-item" },
  { icon: Package, label: "Orders", href: "/orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
];

type Props = {
  user: {
    username: string;
    email: string;
  };
};

export default function Navbar({ user }: Props) {
  const router = useRouter();

  const handleNavigation = (href: string) => router.push(href);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 space-x-6">
        {/* Logo */}
        <div
          onClick={() => handleNavigation("/")}
          className="cursor-pointer text-2xl font-bold text-black"
        >
          VirtualBazaar
        </div>

        {/* Nav buttons */}
        <div className="flex items-center space-x-3 ml-auto">
          {navItems.map((item) => (
            <Button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              variant="ghost"
              className="flex items-center space-x-1 text-black hover:text-teal-600"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          ))}

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-black">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white rounded-md shadow-lg p-2">
              <div className="flex flex-col items-center p-4">
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarImage src="/avatar.png" alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-black">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation("/profile")} className="text-black">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={async () => await logoutAction()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
