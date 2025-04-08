// components/Logo.tsx
import { useRouter } from 'next/navigation';

export default function Logo() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
      <img
        src="/logo.png"
        alt="logo"
        className="w-8 h-8 object-contain"
      />
      <h1 className="text-xl font-bold text-indigo-700">
        VirtualBazaar
      </h1>
    </div>
  );
}
