'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AddItem = () => {
  const router = useRouter();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [game, setGame] = useState('MLBB');
  const [images, setImages] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setSellerId(parsed._id || parsed.id || null);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !game || !images || images.length === 0) {
      alert('Бүх талбар болон зургаа оруулна уу.');
      return;
    }

    if (!sellerId) {
      alert('Хэрэглэгчийн мэдээлэл олдсонгүй.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('game', game);
    formData.append('seller', sellerId);

    // Add multiple images
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Бараа амжилттай нэмэгдлээ!');
        router.push('/main');
      } else {
        const error = await res.json();
        alert(`Алдаа: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Сервертэй холбогдох үед алдаа гарлаа.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">Бараа нэмэх</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" placeholder="Нэр" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={3} placeholder="Тайлбар" />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" placeholder="Үнэ ₮" />
          <select value={game} onChange={(e) => setGame(e.target.value)} className="w-full p-2 border rounded">
            <option value="MLBB">MLBB</option>
            <option value="DOTA2">DOTA2</option>
            <option value="CS2">CS2</option>
            <option value="PUBGmobile">PUBGmobile</option>
          </select>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full p-2 border rounded" />
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500">
            {isLoading ? 'Нэмэгдэж байна...' : 'Нэмэх'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
