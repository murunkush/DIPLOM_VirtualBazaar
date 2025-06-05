const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createDispute(
  token: string,
  orderId: string,
  reason: string,
  message: string
) {
  const res = await fetch(`${API_BASE}/api/disputes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order: orderId, reason, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Маргаан үүсгэхэд алдаа гарлаа');
  }
  return await res.json();
}

export async function getOrderDisputes(
  token: string,
  orderId: string
) {
  const res = await fetch(`${API_BASE}/api/disputes/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Маргаануудыг татахад алдаа гарлаа');
  }
  return await res.json();
}

export async function addDisputeMessage(
  token: string,
  disputeId: string,
  message: string
) {
  const res = await fetch(`${API_BASE}/api/disputes/${disputeId}/message`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    throw new Error('Message нэмэхэд алдаа гарлаа');
  }
  return await res.json();
}

export async function resolveDispute(
  token: string,
  disputeId: string,
  resolution: 'buyer' | 'seller'
) {
  const res = await fetch(`${API_BASE}/api/disputes/${disputeId}/resolve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resolution }),
  });
  if (!res.ok) {
    throw new Error('Маргаан шийдвэрлэхэд алдаа гарлаа');
  }
  return await res.json();
}
