import { NextRequest, NextResponse } from 'next/server'
import { crawlAllSources } from '@/lib/crawlers'
import { summarizeArticle, extractTags } from '@/lib/openrouter'
import { supabaseAdmin } from '@/lib/supabase'

export const maxDuration = 300

export async function GET(request: NextRequest) {
  // Vercel cron sends Bearer token; direct browser calls are allowed (public RSS data)
  const authHeader = request.headers.get('authorization')
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
  const isDirectCall = !authHeader
  if (!isVercelCron && !isDirectCall) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[Cron] Starting news collection...')
    const articles = await crawlAllSources()
    console.log(`[Cron] Crawled ${articles.length} raw articles`)

    let saved = 0
    let skipped = 0
    let errors = 0

    for (const article of articles) {
      if (!article.title || !article.url) continue

      const { data: existing } = await supabaseAdmin
        .from('news_articles')
        .select('id')
        .eq('url', article.url)
        .single()

      if (existing) {
        skipped++
        continue
      }

      try {
        const content = article.summary || article.title
        const [aiSummary, tags] = await Promise.all([
          summarizeArticle(article.title, content),
          extractTags(article.title, content),
        ])

        const { error } = await supabaseAdmin.from('news_articles').insert({
          title: article.title,
          url: article.url,
          source: article.source,
          summary: article.summary || null,
          published_at: article.published_at || null,
          ai_summary: aiSummary,
          tags,
          image_url: article.image_url || null,
        })

        if (error) {
          console.error(`[Cron] DB insert error for ${article.url}:`, error)
          errors++
        } else {
          saved++
        }
      } catch (err) {
        console.error(`[Cron] Processing error for ${article.title}:`, err)
        errors++
      }

      await new Promise((r) => setTimeout(r, 500))
    }

    console.log(`[Cron] Done: saved=${saved}, skipped=${skipped}, errors=${errors}`)
    return NextResponse.json({ success: true, saved, skipped, errors, total: articles.length })
  } catch (err) {
    console.error('[Cron] Fatal error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
