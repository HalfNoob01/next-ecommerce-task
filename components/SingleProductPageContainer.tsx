'use client';

import { HeartIcon, Star, StarHalf } from "lucide-react";
import { toast } from 'react-toastify';
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductProps {
  product: any;
  related: any[];
  userId: string
}

export default function SignleProductPageContainer({ product, related, userId }: ProductProps) {
  const [wishlist, setWishlist] = useState<number[]>([])

  const handleAddToCart = (item: any) => {
    try {
      const newItem = {
        id: item.id,
        userId: userId,
        name: item.title,
        description: item.description,
        price: item.price,
        image: item.image,
        quantity: 1,
      };

      const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');

      const itemIndex = existingCart.findIndex(
        (cartItem: any) => cartItem.userId === userId && cartItem.id === item.id
      );

      let updatedCart;

      if (itemIndex !== -1) {

        existingCart[itemIndex].quantity += 1;
        updatedCart = [...existingCart];
      } else {
        updatedCart = [...existingCart, newItem];
      }

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      toast.success("Item added successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const toggleWishlist = (item: any) => {

    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");


    const isInWishlist = storedWishlist.some(
      (w: any) => w.id === item.id && w.userId === userId
    );

    let updatedWishlist;

    if (isInWishlist) {

      updatedWishlist = storedWishlist.filter(
        (w: any) => !(w.id === item.id && w.userId === userId)
      );
      toast.success("Removed from wishlist!");
    } else {

      updatedWishlist = [
        ...storedWishlist,
        {
          id: item.id,
          userId: userId,
          ...item,
        },
      ];
      toast.success("Added to wishlist.");
    }


    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));


    const filtered = updatedWishlist.filter((w: any) => w.userId === userId);
    setWishlist(filtered);
  };

    useEffect(() => {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        const allWishlist = JSON.parse(stored);
        const userWishlist = allWishlist.filter((item: any) => item.userId === userId);
        setWishlist(userWishlist);
      }
    }, [userId]);
  return (
    <div className="min-h-screen bg-base-200 px-4 py-10 flex flex-col items-center gap-10">
      {/* Main Product */}
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-5xl w-full">
        <div className="lg:w-1/2 flex items-center justify-center p-4">
          <img
            src={product.image || ""}
            alt={product.title}
            className="max-h-[350px] w-full h-auto object-contain"
          />
        </div>

        <div className="card-body w-full lg:w-1/2">
          <div className="flex justify-between items-start">
            <h2 className="card-title text-2xl">{product.title}</h2>
            <button  onClick={() => toggleWishlist(product)} className="text-error hover:scale-110 transition-all">
              <HeartIcon fill={wishlist.some((w: any) => w.id === product.id && w.userId === userId) ? "red" : "none"} className="w-6 h-6" />
            </button>
          </div>

          {product.category && (
            <div className="badge badge-secondary w-fit mb-2">
              {product.category}
            </div>
          )}

          <p className="text-sm text-gray-600">{product.description}</p>

          <div className="text-xl font-bold text-primary mt-2 mb-2">
            ${product.price}
          </div>

          {/* Rating + Stock */}
          {product.rating && (
            <div className="flex items-center justify-between mt-1 text-sm">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => {
                  const rate = product.rating.rate;
                  const isFull = rate >= i + 1;
                  const isHalf = rate >= i + 0.5 && rate < i + 1;

                  return (
                    <span key={i}>
                      {isFull ? (
                        <Star size={16} fill="currentColor" strokeWidth={0} />
                      ) : isHalf ? (
                        <StarHalf size={16} fill="currentColor" strokeWidth={0} />
                      ) : (
                        <Star size={16} strokeWidth={1.5} />
                      )}
                    </span>
                  );
                })}
                <span className="text-gray-500 text-xs ml-1">
                  ({product.rating.rate.toFixed(1)})
                </span>
              </div>
              <span className="text-green-600 text-xs">
                {product.rating.count > 0
                  ? `${product.rating.count} in stock`
                  : "Out of stock"}
              </span>
            </div>
          )}

          <div className="flex gap-4 flex-wrap mt-4">
            <button onClick={() => handleAddToCart(product)} className="btn btn-primary btn-sm">
              Add to Cart
            </button>
            <Link href={`/buy-now?id=${product.id}&userId=${userId}`}><button className="btn btn-outline btn-sm">Buy Now</button></Link>
            
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="w-full max-w-6xl">
        <h3 className="text-2xl font-semibold mb-6 text-center">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {related.map((item) => (
            <div
              key={item.id}
              className="card bg-base-100 shadow-md border border-base-300 rounded-lg transition-transform hover:scale-[1.02]"
            >
              <Link href={`/product/${item.id}`} className="block p-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-44 w-full object-contain mx-auto"
                />
              </Link>
              <div className="card-body px-4 pt-2 pb-4 space-y-1">
                <Link href={`/product/${item.id}`} >
                  <h2 className="text-base font-semibold line-clamp-1">{item.title}</h2>
                  <p className="text-sm text-gray-500 line-clamp-1">{item.category}</p>
                  <p className="text-lg font-bold text-primary">${item.price}</p>
                </Link>
                {/* Rating + Stock */}
                {item.rating && (
                  <Link href={`/product/${item.id}`} >
                    <div className="flex items-center justify-between mt-1 text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => {
                          const rate = item.rating.rate;
                          const isFull = rate >= i + 1;
                          const isHalf = rate >= i + 0.5 && rate < i + 1;

                          return (
                            <span key={i}>
                              {isFull ? (
                                <Star size={16} fill="currentColor" strokeWidth={0} />
                              ) : isHalf ? (
                                <StarHalf size={16} fill="currentColor" strokeWidth={0} />
                              ) : (
                                <Star size={16} strokeWidth={1.5} />
                              )}
                            </span>
                          );
                        })}
                        <span className="text-gray-500 text-xs ml-1">
                          ({item.rating.rate.toFixed(1)})
                        </span>
                      </div>
                      <span className="text-green-600 text-xs">
                        {item.rating.count > 0
                          ? `${item.rating.count} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </Link>
                )}

                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn btn-sm btn-primary"
                  >
                    Add to Cart
                  </button>
                  <button  onClick={() => toggleWishlist(item)} className="text-red-500 hover:scale-110 transition-transform">
                    <HeartIcon fill={wishlist.some((w: any) => w.id === item.id && w.userId === userId) ? "red" : "none"} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
