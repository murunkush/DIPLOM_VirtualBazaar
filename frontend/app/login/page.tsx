'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Нэвтрэхэд алдаа гарлаа');

      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(data));
      }

      router.push('/main');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-pink-100 px-4">
      <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Нэвтрэх</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="И-мэйл"
            className="w-full p-3 rounded-md border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Нууц үг"
              className="w-full p-3 rounded-md border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-sm text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Сануулах</span>
            </label>
            <button
              className="text-blue-500 text-sm"
              onClick={() => router.push('/register')}
            >
              Бүртгүүлэх?
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    </div>
  );
}
