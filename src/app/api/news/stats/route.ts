import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: sourceCounts } = await supabase
    .from('news_articles')
    .select('source')

  if (!sourceCounts) {
    return NextResponse.json({ sources: [], total: 0 })
  }

  const counts: Record<string, number> = {}
  for (const row of sourceCounts) {
    counts[row.source] = (counts[row.source] || 0) + 1
  }

  const sources = Object.entries(counts).map(([source, count]) => ({ source, count }))

  return NextResponse.json({ sources, total: sourceCounts.length })
}
