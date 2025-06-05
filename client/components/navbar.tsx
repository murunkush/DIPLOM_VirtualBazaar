"use client";

import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, Menu, Package, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/app/actions/auth-actions";

// Translated navigation items
const navItems = [
  { icon: Plus, label: "Бараа нэмэх", href: "/add-item" },
  { icon: Package, label: "Захиалга", href: "/orders" },
  { icon: Heart, label: "Хүслийн жагсаалт", href: "/wishlist" },
];

type Props = {
  user: {
    username: string;
    email: string;
  };
};

export default function Navbar({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => router.push(href);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-black/10 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <div
          onClick={() => handleNavigation("/")}
          className="cursor-pointer text-2xl font-bold text-black transition-opacity hover:opacity-80"
        >
          VirtualBazaar
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="h-auto px-4 py-2 text-black"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        {/* Right-side actions: Profile and Mobile Menu */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative text-black h-10 w-10 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="/avatar.png"
                    alt={`${user.username}-ийн зураг`}
                  />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleNavigation("/profile")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Профайл</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => await logoutAction()}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Гарах</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Цэс нээх</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-2 pt-6">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Button
                        onClick={() => handleNavigation(item.href)}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="justify-start text-base"
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
