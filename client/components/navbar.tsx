"use client";
import { useRouter } from "next/navigation";
import { Menu, ShoppingCart, Heart, Package, Plus, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { logoutAction } from "@/app/actions/auth-actions";

type Props = {
  user: {
    username: string;
    email: string;
  };
};

const Navbar = ({ user }: Props) => {
  const router = useRouter();

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-lg p-4 flex justify-between items-center">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="/logo.png"
          alt="лого"
          className="object-contain rounded-full shadow-md"
          width={70}
          height={50}
        />
        <h1 className="text-3xl font-bold text-white hover:text-indigo-200 transition-all">
          VirtualBazaar
        </h1>
      </div>

      <div className="hidden md:flex gap-3">
        <Button
          onClick={() => router.push("/add-item")}
          variant="secondary"
          className="font-semibold bg-indigo-600 hover:bg-indigo-500 text-white hover:text-white transition-all transform hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" />
          Бараа нэмэх
        </Button>

        <Button
          onClick={() => router.push("/orders")}
          variant="secondary"
          className="font-semibold bg-indigo-600 hover:bg-indigo-500 text-white hover:text-white transition-all transform hover:scale-105"
        >
          <Package className="mr-2 h-4 w-4" />
          Захиалгууд
        </Button>

        <Button
          onClick={() => router.push("/basket")}
          variant="secondary"
          className="font-semibold bg-indigo-600 hover:bg-indigo-500 text-white hover:text-white transition-all transform hover:scale-105"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Сагс
        </Button>

        <Button
          onClick={() => router.push("/wishlist")}
          variant="secondary"
          className="font-semibold bg-indigo-600 hover:bg-indigo-500 text-white hover:text-white transition-all transform hover:scale-105"
        >
          <Heart className="mr-2 h-4 w-4" />
          Хүслийн жагсаалт
        </Button>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-indigo-600"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>VirtualBazaar</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={() => router.push("/add-item")}
                variant="outline"
                className="justify-start"
              >
                <Plus className="mr-2 h-4 w-4" />
                Бараа нэмэх
              </Button>

              <Button
                onClick={() => router.push("/orders")}
                variant="outline"
                className="justify-start"
              >
                <Package className="mr-2 h-4 w-4" />
                Захиалгууд
              </Button>

              <Button
                onClick={() => router.push("/basket")}
                variant="outline"
                className="justify-start"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Сагс
              </Button>

              <Button
                onClick={() => router.push("/wishlist")}
                variant="outline"
                className="justify-start"
              >
                <Heart className="mr-2 h-4 w-4" />
                Хүслийн жагсаалт
              </Button>

              <Button
                onClick={() => router.push("/profile")}
                variant="outline"
                className="justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Профайл
              </Button>

              <Button
                onClick={async () => await logoutAction()}
                variant="destructive"
                className="justify-start mt-4"
              >
                Гарах
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-white hover:bg-indigo-600"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" alt={user.username} />
                <AvatarFallback className="bg-indigo-800 text-white">
                  {user.username?.at(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">Профайл</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col items-center p-4">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src="/avatar.png" alt={user.username} />
                <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xl">
                  {user.username.at(0)}
                </AvatarFallback>
              </Avatar>
              <p className="text-lg font-semibold">{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              Профайл харах
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={async () => await logoutAction()}
            >
              Гарах
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;

