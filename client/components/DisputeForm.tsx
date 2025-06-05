'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createDispute } from '@/lib/disputeApi';

export default function DisputeForm({
  orderId,
  token,
  onDone,
}: {
  orderId: string;
  token: string;
  onDone: () => void;
}) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDispute(token, orderId, reason, description);
      onDone();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 p-4 bg-red-50 border border-red-200 rounded">
      <div>
        <label className="block font-medium text-sm">Шалтгаан</label>
        <input
          className="w-full border p-2 rounded"
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium text-sm">Дэлгэрэнгүй</label>
        <textarea
          className="w-full border p-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Илгээж байна...' : 'Маргаан үүсгэх'}
      </Button>
    </form>
  );
}
