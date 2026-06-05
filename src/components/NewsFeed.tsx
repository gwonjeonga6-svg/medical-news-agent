'use client'

import { useCallback, useEffect, useState } from 'react'
import { NewsArticle } from '@/lib/supabase'
import NewsCard from './NewsCard'
import SourceFilter from './SourceFilter'
import SearchBar from './SearchBar'
import { RefreshCw, Loader2 } from 'lucide-react'

type FeedResponse = {
  articles: NewsArticle[]
  total: number
  totalPages: number
}

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [collecting, setCollecting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [source, setSource] = useState('')
  const [query, setQuery] = useState('')

  const fetchNews = useCallback(async (p: number, src: string, q: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' })
      if (src) params.set('source', src)
      if (q) params.set('q', q)
      const res = await fetch(`/api/news?${params}`)
      const data: FeedResponse = await res.json()
      setArticles(data.articles)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews(page, source, query)
  }, [fetchNews, page, source, query])

  const handleSourceChange = (src: string) => {
    setSource(src)
    setPage(1)
  }

  const handleSearch = (q: string) => {
    setQuery(q)
    setPage(1)
  }

  const handleCollect = async () => {
    setCollecting(true)
    try {
      const res = await fetch('/api/cron/collect')
      const data = await res.json()
      if (data.saved > 0) {
        await fetchNews(1, source, query)
        setPage(1)
      }
      alert(`수집 완료: ${data.saved}개 저장, ${data.skipped}개 스킵`)
    } catch {
      alert('수집 중 오류가 발생했습니다.')
    } finally {
      setCollecting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={handleCollect}
          disabled={collecting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0"
        >
          {collecting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          {collecting ? '수집 중...' : '뉴스 수집'}
        </button>
      </div>

      <SourceFilter selected={source} onChange={handleSourceChange} />

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>총 <strong className="text-gray-800">{total.toLocaleString()}</strong>개 기사</span>
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="text-blue-600 hover:underline"
          >
            검색 초기화
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">뉴스가 없습니다</p>
          <p className="text-sm mt-1">위 &quot;뉴스 수집&quot; 버튼을 눌러 최신 뉴스를 가져오세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            이전
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
