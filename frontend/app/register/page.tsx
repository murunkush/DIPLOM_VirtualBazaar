'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Бүртгэхэд алдаа гарлаа');

      localStorage.setItem('user', JSON.stringify(data));
      router.push('/main');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-yellow-100 px-4">
      <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Бүртгүүлэх</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Хэрэглэгчийн нэр"
            className="w-full p-3 rounded-md border"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="И-мэйл"
            className="w-full p-3 rounded-md border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Нууц үг"
            className="w-full p-3 rounded-md border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Нууц үг давтах"
            className="w-full p-3 rounded-md border"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <button
              className="text-blue-500 text-sm"
              onClick={() => router.push('/login')}
            >
              Нэвтрэх?
            </button>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-md"
          >
            Бүртгүүлэх
          </button>
        </div>
      </div>
    </div>
  );
}
