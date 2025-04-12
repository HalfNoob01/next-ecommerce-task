'use client'

import { useEffect, useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity?: number;
}

interface Order {
  userId: string;
  products: Product[];
  formData: {
    name: string;
    address: string;
    phone: string;
    email: string;
    payment: string;
    cardNumber: string;
  };
  price: number;
  date: string;
}

const OrderHistoryContainer = ({ userId }: { userId: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const history: Order[] = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const userOrders = history.filter(order => order.userId === userId);
    setOrders(userOrders);
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧾 Your Orders</h2>

      {orders.length === 0 ? (
        <div className="text-sm text-gray-500">You have no previous orders.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, idx) => (
            <div key={idx} className="card card-compact bg-base-100 shadow-md border border-base-200">
              <div className="card-body">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">Order #{idx + 1}</h3>
                  <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                </div>

                <div className="text-sm">
                  {order.products.map((product, i) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b py-1">
                      <span className="truncate max-w-[60%]">{product.title}</span>
                      <span>${(product.price * (product.quantity ?? 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  <p><strong>Total:</strong> ${order.price.toFixed(2)}</p>
                  <p><strong>Payment:</strong> {order.formData.payment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryContainer;
