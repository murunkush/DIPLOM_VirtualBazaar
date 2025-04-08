'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle } from 'lucide-react';


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Жишээ хэрэглэгчийн мэдээлэл
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-lg p-4 flex justify-between items-center">
      {/* Лого */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
        <img
          src="logo.png"
          alt="logo"
          className="w-12 h-12 object-contain rounded-full shadow-md"
        />
        <h1 className="text-3xl font-bold text-white hover:text-indigo-200 transition-all">VirtualBazaar</h1>
      </div>

      {/* Навигацийн линкүүд */}
      <div className="hidden md:flex gap-8">
        {/* Add Item */}
        <button
          onClick={() => router.push('/add-item')}
          className="relative group text-white text-lg font-semibold px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 shadow-lg transition-all transform hover:scale-105">
          Add Item
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-all"></span>
        </button>

        {/* Orders */}
        <button
          onClick={() => router.push('/orders')}
          className="relative group text-white text-lg font-semibold px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 shadow-lg transition-all transform hover:scale-105">
          Orders
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-all"></span>
        </button>

        {/* Basket */}
        <button
          onClick={() => router.push('/basket')}
          className="relative group text-white text-lg font-semibold px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 shadow-lg transition-all transform hover:scale-105">
          Basket
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-all"></span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => router.push('/wishlist')}
          className="relative group text-white text-lg font-semibold px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 shadow-lg transition-all transform hover:scale-105">
          Wishlist
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-all"></span>
        </button>
      </div>

      {/* Профайл Dropdown */}
      <div className="relative">
        <div
          className="flex items-center gap-2 cursor-pointer text-white hover:text-indigo-200 transition-all"
          onClick={handleDropdownToggle}
        >
          <UserCircle className="text-3xl" />
          <span className="font-medium">Профайл</span>
        </div>

        {/* Dropdown цэс */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-4 w-60 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-10">
            {/* Хэрэглэгчийн мэдээлэл */}
            <div className="flex flex-col items-center mb-4">
              <div className="text-xl font-semibold text-gray-800">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>

            {/* Dropdown товчлуурууд */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push('/profile')}
                className="w-full text-left py-2 px-4 rounded-lg text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all"
              >
                View Profile
              </button>
              <button
                onClick={() => router.push('/logout')}
                className="w-full text-left py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 focus:outline-none transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
