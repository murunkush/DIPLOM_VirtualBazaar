'use client';
import { useEffect, useState } from 'react';
import {
  getOrderDisputes,
  addDisputeMessage,
  resolveDispute,
} from '@/lib/disputeApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DisputeViewer({
  orderId,
  token,
  isAdmin,
}: {
  orderId: string;
  token: string;
  isAdmin: boolean;
}) {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const data = await getOrderDisputes(token, orderId);
      setDisputes(data);
    } catch {
      toast.error('Маргаануудыг татахад алдаа');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendMsg = async (id: string) => {
    if (!msg.trim()) return;
    try {
      await addDisputeMessage(token, id, msg);
      setMsg('');
      load();
    } catch {
      toast.error('Message илгээхэд алдаа');
    }
  };

  const resolve = async (id: string, who: 'buyer' | 'seller') => {
    try {
      await resolveDispute(token, id, who);
      toast.success('Маргаан шийдэгдлээ');
      load();
    } catch {
      toast.error('Шийдвэрлэхэд алдаа');
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded border">
      {disputes.map(d => (
        <div key={d._id} className="border p-3 rounded space-y-2">
          <div>
            <strong>Шалтгаан:</strong> {d.reason}
          </div>
          <div>
            <strong>Төлөв:</strong> {d.status}
          </div>
          <div className="space-y-1">
            {d.messages.map((m: any, i: number) => (
              <div key={i} className="text-sm">
                <strong>{m.sender.username}:</strong> {m.message}
              </div>
            ))}
          </div>

          {/* Reply */}
          <div className="flex gap-2">
            <input
              className="flex-1 border p-1 rounded"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="Reply..."
            />
            <Button onClick={() => sendMsg(d._id)}>Send</Button>
          </div>

          {/* Admin actions */}
          {isAdmin && d.status === 'Open' && (
            <div className="flex gap-2">
              <Button onClick={() => resolve(d._id, 'buyer')}>Buyer талд</Button>
              <Button variant="destructive" onClick={() => resolve(d._id, 'seller')}>
                Seller талд
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
