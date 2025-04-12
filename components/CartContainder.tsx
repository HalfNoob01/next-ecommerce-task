'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Link from "next/link";

interface CartItem {
  id: string;
  userId: string;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

const CartContainer = ({ userId }: { userId: string }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    if (stored) {
      const allItems: CartItem[] = JSON.parse(stored);
      const userItems = allItems.filter((item) => item.userId === userId);


      const mergedItems: CartItem[] = [];

      userItems.forEach((item) => {
        const existing = mergedItems.find((i) => i.id === item.id);
        if (existing) {
          existing.quantity += item.quantity || 1;
        } else {
          mergedItems.push({ ...item, quantity: item.quantity || 1 });
        }
      });

      setCartItems(mergedItems);
    }
  }, [userId]);

  const updateLocalStorage = (items: CartItem[]) => {
    const stored = localStorage.getItem('cartItems');
    if (!stored) return;

    const allItems = JSON.parse(stored);

    const updatedAllItems = allItems.map((item: CartItem) => {
      const match = items.find(
        (i) => i.id === item.id && i.userId === item.userId && i.userId === userId
      );
      return match ? { ...item, quantity: match.quantity } : item;
    });

    const finalItems = [
      ...updatedAllItems.filter((item: CartItem) => item.userId !== userId),
      ...items,
    ];

    localStorage.setItem('cartItems', JSON.stringify(finalItems));
  };

  const handleQuantityChange = (id: string, type: 'inc' | 'dec') => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = type === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedUserItems = cartItems.filter((item) => item.id !== id);

    setCartItems(updatedUserItems);
    updateLocalStorage(updatedUserItems);

    toast.success('Item removed from cart.');
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container p-4 max-w-7xl mx-auto relative min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">No items in cart.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-24">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg border border-gray-200 rounded-xl p-4 relative dark:bg-gray-800 dark:border-gray-700"
              >
                <figure className="mb-4 bg-gray-100 rounded-xl overflow-hidden dark:bg-gray-700">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-40 w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                    }}
                  />
                </figure>
                <div className="p-0">
                  <h3 className="font-semibold text-lg dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{item.category}</p>
                  <p className="text-indigo-600 font-bold text-lg">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleQuantityChange(item.id, 'dec')}
                      className="btn btn-sm btn-outline rounded-full dark:bg-gray-700 dark:text-white dark:border-gray-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 'inc')}
                      className="btn btn-sm btn-outline rounded-full dark:bg-gray-700 dark:text-white dark:border-gray-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 btn btn-xs btn-error text-white dark:btn-error dark:bg-red-700 dark:border-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-4 right-4 bg-white/30 backdrop-blur-lg hover:bg-white/50 hover:backdrop-blur-xl transition-all ease-in-out duration-300 shadow-2xl p-4 rounded-lg w-72 z-50 border border-gray-300 dark:bg-gray-800/30 dark:border-gray-700 dark:hover:bg-gray-800/50 dark:hover:backdrop-blur-xl transform hover:scale-105">
            <p className="text-lg font-bold mb-2 text-center text-gray-800 dark:text-white">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <Link href={`/buy-now?userId=${userId}`}>
            <button
              className="btn btn-success w-full shadow-md dark:bg-green-700 dark:text-white"
            >
              Checkout
            </button>
            </Link>
          </div>
        </>
      )}
    </div>



  );
};

export default CartContainer;
