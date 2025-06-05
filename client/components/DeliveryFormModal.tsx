'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onDeliver: (deliveryInfo: { trackingNumber: string; message?: string }) => Promise<void>;
}

export default function DeliveryFormModal({ open, onClose, onDeliver }: Props) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!trackingNumber) {
      setError("Хүргэлтийн дугаар заавал!");
      return;
    }
    setLoading(true);
    try {
      await onDeliver({ trackingNumber, message });
      setTrackingNumber("");
      setMessage("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Барааны хүргэлтийн мэдээлэл</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-gray-700">Хүргэлтийн дугаар <span className="text-red-500">*</span></label>
            <input
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
              type="text"
              placeholder="..."
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Тайлбар / Мессеж (заавал биш)</label>
            <textarea
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Тоглогчид зориулсан мессеж..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={2}
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Болих
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Хүргэлт илгээх"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
