'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
      } else {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Parse error', error);
      router.push('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Menu className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-indigo-700">VirtualBazaar</h1>
        </div>

        {/* Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="/user.png" alt="User" />
              <AvatarFallback>VB</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-md rounded-md p-2">
            <div className="text-sm px-2 py-1 text-gray-700">
              <p><strong>Нэр:</strong> {user?.username}</p>
              <p><strong>И-мэйл:</strong> {user?.email}</p>
            </div>
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
              Гарах
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Navigation */}
      <nav className="bg-indigo-600 text-white px-6 py-3 flex space-x-6 text-sm font-medium">
        <button className="hover:underline">Нүүр</button>
        <button className="hover:underline">Бараанууд</button>
        <button className="hover:underline">Миний захиалга</button>
        <button className="hover:underline">Худалдан авалт</button>
        <button className="hover:underline">Харилцагчид</button>
        <button className="hover:underline">Маргаан</button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">Тавтай морил, {user?.username}!</h2>
        <p className="text-gray-600 mb-8">
          Энэ бол VirtualBazaar платформын таны хяналтын самбар юм. Эндээс та өөрийн бараа, захиалга, хэрэглэгчид болон маргаантай асуудлыг удирдах боломжтой.
        </p>

        {/* TODO: Add dashboard cards or components here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-4 shadow border">
            <h3 className="text-lg font-semibold mb-2">Шинэ бараа нэмэх</h3>
            <p className="text-sm text-gray-500">Та шинэ барааг энд дарж бүртгүүлнэ үү.</p>
            <Button className="mt-3">Бараа нэмэх</Button>
          </div>

          <div className="bg-white rounded-xl p-4 shadow border">
            <h3 className="text-lg font-semibold mb-2">Захиалгын хяналт</h3>
            <p className="text-sm text-gray-500">Захиалгын төлөв, хүргэлтийн мэдээлэл зэргийг шалгана уу.</p>
            <Button className="mt-3">Захиалгууд</Button>
          </div>

          <div className="bg-white rounded-xl p-4 shadow border">
            <h3 className="text-lg font-semibold mb-2">Маргаан шийдвэрлэх</h3>
            <p className="text-sm text-gray-500">Хэрэглэгчдийн маргаантай асуудлуудыг удирдана уу.</p>
            <Button className="mt-3">Маргаан харах</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
