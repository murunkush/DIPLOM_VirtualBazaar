import { useState } from 'react';
import { placeOrder } from '@/app/actions/order-actions';
import { Button } from '@/components/ui/button';

const OrderForm = () => {
  const [orderData, setOrderData] = useState({ productId: '', quantity: 1 });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const order = await placeOrder(orderData);
      alert('Захиалга амжилттай үүсгэгдлээ!');
    } catch (error) {
      alert('Захиалга үүсгэхэд алдаа гарлаа!');
    }
  };

  return (
    <form onSubmit={handleOrderSubmit}>
      <input
        type="text"
        placeholder="Барааны ID"
        value={orderData.productId}
        onChange={(e) => setOrderData({ ...orderData, productId: e.target.value })}
        className="input-field"
      />
      <input
        type="number"
        placeholder="Тоо"
        value={orderData.quantity}
        onChange={(e) => setOrderData({ ...orderData, quantity: parseInt(e.target.value) })}
        className="input-field"
      />
      <Button type="submit">Захиалга өгөх</Button>
    </form>
  );
};

export default OrderForm;
