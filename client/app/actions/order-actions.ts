"use server"

export const addOrder = async (itemId: string, quantity: number, token: string) => {
  try {
    // API руу захиалга илгээх
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        itemId,
        quantity,
      }),
    });

    // Хариу код шалгах
    if (!response.ok) {
      // Хэрэв хариу амжилтгүй бол
      throw new Error('Захиалга үүсгэж чадсангүй, дахин оролдоно уу.');
    }

    const order = await response.json();
    
    return order;
  } catch (error) {
    // Алдаа гарсан тохиолдолд
    console.error('Захиалга үүсгэхэд алдаа гарлаа:', error);
    throw new Error('Алдаа гарлаа. Дахин оролдож үзнэ үү.');
  }
};
