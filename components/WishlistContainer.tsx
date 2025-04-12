'use client'

import { useEffect, useState } from 'react';
import { Heart, Star, StarHalf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const WishlistContainer = ({ userId }: { userId: string }) => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const filteredWishlist = storedWishlist.filter((item: any) => item.userId === userId);
    setWishlist(filteredWishlist);
  }, [userId]);

  const handleNavigateToProduct = (id: string) => {
    router.push(`/product/${id}`);
  };

  const toggleWishlist = (item: any) => {
    const stored = localStorage.getItem("wishlist");
    if (!stored) return;
  
    const allWishlist = JSON.parse(stored);
  
    const updatedWishlist = allWishlist.filter(
      (w: any) => !(w.id === item.id && w.userId === userId)
    );
  
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    const userWishlist = updatedWishlist.filter((w: any) => w.userId === userId);
    setWishlist(userWishlist);
    toast.success("Item removed!")
  };
  

  const removeAllWishlist = () => {
    const stored = localStorage.getItem("wishlist");
    if (!stored) return;
  
    const allWishlist = JSON.parse(stored);
    const updatedWishlist = allWishlist.filter((item: any) => item.userId !== userId);
  
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist([]);

    toast.success("All items removed!")
  };
  

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, idx) => (
          <Star key={`full-${idx}`} className="w-4 h-4 text-yellow-500" />
        ))}
        {halfStar && <StarHalf className="w-4 h-4 text-yellow-500" />}
        {[...Array(emptyStars)].map((_, idx) => (
          <Star key={`empty-${idx}`} className="w-4 h-4 text-gray-300" />
        ))}
      </>
    );
  };

  return (
    <div className="wishlist-container mt-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Wishlist</h2>
      
      {/* Remove All Button */}
      {wishlist.length > 0 && (
        <div className="text-center mb-6">
          <button
            onClick={removeAllWishlist}
            className="btn btn-error btn-sm px-6 py-2 rounded-lg transition-all transform hover:scale-105"
          >
            Remove All
          </button>
        </div>
      )}
      
      {/* Wishlist Items */}
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item: any) => (
            <div
              key={item.id}
              className="card bg-base-100 shadow-md border border-base-300 rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-44 w-full object-contain mx-auto"
                />
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 transition-all"
                >
                  <Heart className='w-6 h-6'  fill={wishlist.some((w: any) => w.id === item.id) ? "red" : "none"} />
                </button>
              </div>

              <div className="card-body p-4 space-y-2">
                <h3
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => handleNavigateToProduct(item.id)}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-lg font-bold text-primary">${item.price}</p>

                {/* Rating and Stock */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {renderStars(item.rating.rate)}
                  </div>
                  <span className="text-sm ml-2">Stock: {item.rating.count} items</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistContainer;