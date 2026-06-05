'use client'

import { NewsArticle } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ExternalLink, Clock, Tag } from 'lucide-react'

const SOURCE_COLORS: Record<string, string> = {
  WHO: 'bg-blue-100 text-blue-800',
  CDC: 'bg-red-100 text-red-800',
  NIH: 'bg-purple-100 text-purple-800',
  PubMed: 'bg-green-100 text-green-800',
  MedicalXpress: 'bg-orange-100 text-orange-800',
  'Google News Health': 'bg-yellow-100 text-yellow-800',
  'Reuters Health': 'bg-pink-100 text-pink-800',
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  const colorClass = SOURCE_COLORS[article.source] || 'bg-gray-100 text-gray-800'
  const timeAgo = article.collected_at
    ? formatDistanceToNow(new Date(article.collected_at), { addSuffix: true, locale: ko })
    : ''

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${colorClass}`}>
          {article.source}
        </span>
        <div className="flex items-center text-xs text-gray-400 gap-1 shrink-0">
          <Clock size={12} />
          <span>{timeAgo}</span>
        </div>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug flex items-start gap-1">
          <span>{article.title}</span>
          <ExternalLink size={14} className="shrink-0 mt-0.5 text-gray-400 group-hover:text-blue-500" />
        </h2>
      </a>

      {article.ai_summary && (
        <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-blue-700 text-xs uppercase tracking-wide mr-1">AI 요약</span>
            {article.ai_summary}
          </p>
        </div>
      )}

      {!article.ai_summary && article.summary && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{article.summary}</p>
      )}

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <Tag size={12} className="text-gray-400" />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
