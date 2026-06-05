import NewsFeed from '@/components/NewsFeed'
import { Activity } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Medical News Agent</h1>
            <p className="text-xs text-gray-500">WHO · CDC · NIH · PubMed · MedicalXpress · Google News · Reuters</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <NewsFeed />
      </div>
    </main>
  )
}
