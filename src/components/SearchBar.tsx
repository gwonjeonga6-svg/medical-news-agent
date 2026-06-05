'use client'

import { Search } from 'lucide-react'
import { useCallback, useState } from 'react'

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void
}) {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch(value.trim())
    },
    [value, onSearch]
  )

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="질병명, 키워드로 검색..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        검색
      </button>
    </form>
  )
}
