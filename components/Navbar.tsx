'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { ShoppingCart, Heart, History, Paintbrush, Search } from 'lucide-react'
import { useTheme } from '../app/ThemeContext'

export default function Navbar({ userId }: { userId?: string }) {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [showThemeModal, setShowThemeModal] = useState(false)

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleInputClick = () => {
    router.push('/search')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]') as { userId: string }[];
      const userItems = storedItems.filter((item) => item.userId === userId);
      setCartCount(userItems.length);
    }
  }, [userId]);

  return (
    <>

      <div className="w-full sticky top-0 z-50 px-4 shadow-md">
        <div className="navbar backdrop-blur bg-base-100/70 text-base-content ">

          {/* Logo */}
          <div className="flex-1">
            <Link
              href="/"
              className="hidden md:flex text-2xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text"
            >
              E-Commerce
            </Link>
          </div>

          {/* Search Input */}
          <div className="hidden md:flex md:flex-1 justify-center">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              onClick={handleInputClick}
              className="input input-bordered w-full max-w-xs bg-white/10 text-base-content placeholder-base-content/70 focus:outline-none focus:bg-white/20"
            />
          </div>

          {/* Search Icon - Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => router.push('/search')}
              className="btn btn-ghost btn-circle text-base-content"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <div className="tooltip tooltip-bottom" data-tip="Wishlist">
              <Link href="/wishlist" className="btn btn-ghost btn-circle text-base-content">
                <Heart className="h-6 w-6" />
              </Link>
            </div>
            <div className="tooltip tooltip-bottom" data-tip="Orders">
              <Link href="/history" className="btn btn-ghost btn-circle text-base-content">
                <History className="h-6 w-6" />
              </Link>
            </div>
            <div className="tooltip tooltip-bottom" data-tip="Cart">
              <Link href="/cart" className="btn btn-ghost btn-circle text-base-content relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="tooltip tooltip-bottom" data-tip="Themes">
              <button
                className="btn btn-ghost btn-circle text-base-content"
                onClick={() => setShowThemeModal(true)}
              >
                <Paintbrush className="h-6 w-6" />
              </button>
            </div>

            {/* Auth */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-outline border-base-content/30 text-base-content hover:bg-base-200">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <div className="bg-base-100 p-6 rounded-lg max-h-[80vh] w-[90vw] md:w-[500px] overflow-y-auto text-base-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Choose a Theme</h3>
              <button className="btn btn-sm btn-circle" onClick={() => setShowThemeModal(false)}>
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption}
                  className={`btn btn-sm capitalize ${themeOption === theme ? 'btn-primary' : 'btn-outline'
                    }`}
                  onClick={() => {
                    setTheme(themeOption)
                    setShowThemeModal(false)
                  }}
                >
                  {themeOption}
                </button>
              ))}
            </div>
          </div>
        </div>

      )}
    </>
  )
}

const themes = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black',
  'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade',
  'night', 'coffee', 'winter'
]
