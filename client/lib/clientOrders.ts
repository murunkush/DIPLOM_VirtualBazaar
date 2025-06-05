'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Захиалга үүсгэх
export async function createOrderClient(token: string, data: { seller: string; item: string; price: number }) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Order creation failed');
  return res.json();
}

// Бүх захиалгыг авах (SSR/SSG-д ашиглана)
export async function getAllOrdersClient(token: string) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Fetching orders failed');
  return res.json();
}

// Нэг захиалгыг авах
export async function getOrderByIdClient(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Fetching order failed');
  return res.json();
}

// Захиалгын статус шинэчлэх
export async function updateOrderStatusClient(
  token: string,
  id: string,
  status: string,
  note?: string
) {
  const body = note ? { status, note } : { status };
  const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Status update failed');
  }
  return res.json();
}

// Захиалга цуцлах
export async function cancelOrderClient(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Cancel order failed');
  return res.json();
}

// Хүргэлтийн мэдээлэл илгээх
export async function deliverOrderClient(token: string, id: string, deliveryInfo: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/deliver`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ deliveryInfo })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Send delivery info failed');
  }
  return res.json();
}

// Баталгаажуулах (Verified)
export async function confirmDeliveryClient(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/confirm`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Confirm delivery failed');
  return res.json();
}

// Захиалгын устгах (cancelled only)
export async function deleteOrderClient(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/delete-cancelled`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Delete order failed');
  return res.json();
}

// Escrow lifecycle
export async function moveToEscrowClient(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/escrow`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Move to escrow failed');
  return res.json();
}

export async function confirmEscrowPaymentClient(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/escrow/confirm`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Confirm escrow payment failed');
  return res.json();
}

export async function completeEscrowClient(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/escrow/complete`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Complete escrow failed');
  return res.json();
}
