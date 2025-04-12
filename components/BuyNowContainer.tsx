'use client'


import { useEffect, useState } from 'react';
import {  useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default  function BuyNowContainerPage({id,userId} : {id : string; userId : string}) {

  const productId = id;
  const router = useRouter();
  
 
  interface Product {
    id: number;
    title: string;
    price: number;
    quantity?: number;
    userId?:string
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    payment: 'paypal',
    cardNumber: '',
  });

  useEffect(() => {
    if (productId) {
      fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          const productWithUser = { ...data, quantity: 1, userId }; // add userId here
          setProducts([productWithUser]);
        });
    } else {
      const cartItems: Product[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const filteredCart = cartItems.filter(item => item.userId === userId);
      setProducts(filteredCart);
    }
  }, [productId, userId]);
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const goBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  const placeOrder = () => {
    const userProducts = products.filter(p => p.userId === userId);
  
    const totalPrice = userProducts.reduce((sum, product) => sum + product.price * (product.quantity ?? 1), 0);
  
    const order = {
      userId,
      products: userProducts,
      formData,
      price: totalPrice,
      date: new Date().toISOString(),
    };
  
   
    const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    localStorage.setItem('orderHistory', JSON.stringify([...history, order]));
  

    const cartItems: Product[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = cartItems.filter(item => item.userId !== userId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  
    setStep(4);
  };
  
  

  const steps = ['Product', 'Info', 'Payment', 'Success'];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="card bg-base-100 shadow-md p-6">
              {/* Header */}
              <div className="font-bold text-2xl text-center mb-4">Receipt</div>

              {/* Product Details */}
              {products.map((product,index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">{product.title}</span>
                    <span className="font-semibold text-lg">x{product.quantity || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-sm text-gray-800">${product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm text-gray-800">{product.quantity || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm text-gray-600">Total:</span>
                    <span className="font-semibold text-sm text-gray-800">${(product.price * (product.quantity || 1)).toFixed(2)}</span>
                  </div>
                </div>
              ))}

              {/* Total Price */}
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${products.reduce((acc, product) => acc + (product.price * (product.quantity || 1)), 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button className="btn btn-outline" onClick={goBack}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Next</button>
              </div>
            </div>
          </div>

        );
      case 2:
        return (
          <div>
            <form className="form-control w-full max-w-lg space-y-2">
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="input input-bordered w-full"
                required
              />
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your Address"
                className="input input-bordered w-full"
                required
              />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="input input-bordered w-full"
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="input input-bordered w-full"
                required
              />
            </form>
            <div className="flex justify-between mt-4">
              <button className="btn btn-outline" onClick={goBack}>Back</button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={!formData.name || !formData.address || !formData.phone || !formData.email}
              >
                Next
              </button>
            </div>
          </div>

        );
      case 3:
        return (
          <div>
            <div className="form-control w-full max-w-lg space-y-6">
              {/* PayPal Radio Button */}
              <label className="label cursor-pointer flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={formData.payment === 'paypal'}
                  onChange={handleChange}
                  className="radio checked:bg-blue-500"
                />
                <span className="label-text text-lg font-semibold">PayPal</span>
              </label>

              {/* Credit/Debit Card Radio Button */}
              <label className="label cursor-pointer flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={formData.payment === 'credit'}
                  onChange={handleChange}
                  className="radio checked:bg-blue-500"
                />
                <span className="label-text text-lg font-semibold">Credit/Debit Card</span>
              </label>

              {/* Conditional Card Number Input */}
              {formData.payment === 'credit' && (
                <div className="mt-4">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="Enter your Card Number"
                    className="input input-bordered w-full rounded-lg px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                className="btn btn-outline w-1/3 py-2 px-6 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500"
                onClick={goBack}
              >
                Back
              </button>

              <button
                className="btn btn-primary w-1/3 py-2 px-6 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                onClick={placeOrder}
              >
                Place Order
              </button>
            </div>
          </div>

        );
      case 4:
        return (
          <>
            <div className="flex justify-center items-center mt-10">
              <motion.div
                className="alert alert-success shadow-lg w-fit rounded-lg p-6 bg-green-100 border border-green-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-semibold text-lg">
                    Your order has been placed successfully!
                  </span>
                </div>
                <motion.div
                  className="mt-4 flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                </motion.div>
              </motion.div>
            </div>


            <div className="flex justify-center mt-6">
              <button
                onClick={() => window.location.href = '/'} // Assuming you want to navigate to the homepage
                className="btn btn-primary py-2 px-6 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              >
                Go to Home
              </button>
            </div>

          </>
        );
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Animated Custom Step Progress */}
      <div className="relative w-full flex justify-between items-center mb-6">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 z-0 rounded-full" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 z-10 rounded-full"
          initial={false}
          animate={{ width: `${(step - 1) / (steps.length - 1) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
        {steps.map((label, index) => (
          <div key={index} className="relative z-20 flex flex-col items-center w-1/4">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors duration-300 ${index + 1 <= step ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-300'
              }`}>
              {index + 1}
            </div>
            <span className="text-xs mt-1">{label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {renderStepContent()}
      </AnimatePresence>
    </div>
  );
}
