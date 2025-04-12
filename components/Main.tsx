'use client'
import { useEffect, useState } from 'react'
import { Heart, Star, StarHalf } from 'lucide-react'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { motion } from "motion/react"

const Main = ({ searchProps, userId }: { searchProps?: string; userId: string; }) => {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [sortType, setSortType] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)


  const router = useRouter();

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setFiltered(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = [...products]

    if (searchProps) {
      result = result.filter((item: any) =>
        item.title.toLowerCase().includes(searchProps.toLowerCase())
      )
    }

    if (category) {
      result = result.filter((item: any) => item.category === category)
    }

    if (sortType === 'lowToHigh') {
      result.sort((a: any, b: any) => a.price - b.price)
    } else if (sortType === 'highToLow') {
      result.sort((a: any, b: any) => b.price - a.price)
    }

    setFiltered(result)
  }, [searchProps, sortType, category, products])

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



  const categories = [...new Set(products.map((p: any) => p.category))]


  const handleAddToCart = (item: any) => {
    try {
      const newItem = {
        userId: userId,
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        image: item.image,
        quantity: 1
      };

      const existingCart: any[] = JSON.parse(localStorage.getItem('cartItems') || '[]');


      const existingIndex = existingCart.findIndex(
        (cartItem) => cartItem.userId === userId && cartItem.id === item.id
      );

      if (existingIndex !== -1) {

        existingCart[existingIndex].quantity += 1;
      } else {

        existingCart.push(newItem);
      }

      localStorage.setItem('cartItems', JSON.stringify(existingCart));
      toast.success("Item added successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };



  const handleRedirect = (id: number) => {
    router.push(`/product/${id}`)
  }

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      const allWishlist = JSON.parse(stored);
      const userWishlist = allWishlist.filter((item: any) => item.userId === userId);
      setWishlist(userWishlist);
    }
  }, [userId]);

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          className="select select-bordered"
          onChange={(e) => setSortType(e.target.value)}
          value={sortType}
        >
          <option value="">Sort by</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>

        <select
          className="select select-bordered"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p className="mt-4 text-gray-500 text-lg">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-lg text-gray-500 py-10">
          Product not available
        </div>
      ) : (
        // Product Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item: any) => (
            <motion.div
              key={item.id}
              className="card card-compact bg-base-100 shadow-xl cursor-pointer"
              whileHover={{ scale: 1.03, boxShadow: "0px 10px 15px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <figure onClick={() => handleRedirect(item.id)}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 object-contain p-4"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title" onClick={() => handleRedirect(item.id)}>
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500" onClick={() => handleRedirect(item.id)}>{item.category}</p>
                <p className="text-lg font-bold" onClick={() => handleRedirect(item.id)}>${item.price}</p>

                {/* Rating and Stock section */}
                <div className="flex items-center justify-between mt-2 text-sm" onClick={() => handleRedirect(item.id)}>
                  {/* Rating Stars */}
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

                  {/* Stock Info */}
                  <span className="text-green-600 text-xs">
                    {item.rating.count > 0 ? `${item.rating.count} in stock` : "Out of stock"}
                  </span>
                </div>


                <div className="card-actions justify-between items-center mt-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="text-red-500"
                  >
                    <Heart fill={wishlist.some((w: any) => w.id === item.id && w.userId === userId) ? "red" : "none"} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      )}
    </div>
  )
}

export default Main
