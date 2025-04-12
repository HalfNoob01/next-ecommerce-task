"use client"

import Main from '@/components/Main'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function SearchPage() {
  const [searchText, setSearchText] = useState('')
  const [pageLoaded, setPageLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  useEffect(() => {
    inputRef.current?.focus()
    const loadTimer = setTimeout(() => setPageLoaded(true), 100)
    const loadingTimer = setTimeout(() => setLoading(false), 1000)

    return () => {
      clearTimeout(loadTimer)
      clearTimeout(loadingTimer)
    }
  }, [])

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => router.back()}
        >
          ← Back
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={`input input-bordered rounded-full transition-all duration-500
            w-[200px] sm:w-[300px] ${pageLoaded ? 'md:w-[500px]' : 'md:w-[200px]'}`}
        />
      </div>

      {loading ? (
        <div className="text-lg text-gray-500 text-center mt-20">Loading products...</div>
      ) : (
        <Main searchProps={searchText} />

      )}
    </div>
  )
}
