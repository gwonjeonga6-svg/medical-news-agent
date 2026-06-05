import Parser from 'rss-parser'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; MedicalNewsBot/1.0)',
  },
})

export type RawArticle = {
  title: string
  url: string
  source: string
  summary: string
  published_at: string | null
  image_url: string | null
}

async function fetchRSS(url: string, source: string): Promise<RawArticle[]> {
  try {
    const feed = await parser.parseURL(url)
    return feed.items.slice(0, 20).map((item) => ({
      title: item.title || '',
      url: item.link || item.guid || '',
      source,
      summary: item.contentSnippet || item.summary || item.content || '',
      published_at: item.pubDate || item.isoDate || null,
      image_url: (item as Record<string, unknown>)['media:thumbnail']
        ? String((item as Record<string, unknown>)['media:thumbnail'])
        : null,
    })).filter((a) => a.title && a.url)
  } catch (err) {
    console.error(`[${source}] RSS fetch error:`, err)
    return []
  }
}

export async function crawlWHO(): Promise<RawArticle[]> {
  return fetchRSS('https://www.who.int/rss-feeds/news-releases-rss.xml', 'WHO')
}

export async function crawlCDC(): Promise<RawArticle[]> {
  const feeds = [
    'https://tools.cdc.gov/api/v2/resources/media/316422.rss',
    'https://www2.cdc.gov/podcasts/feed.xml',
  ]
  const results = await Promise.allSettled(feeds.map((f) => fetchRSS(f, 'CDC')))
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
}

export async function crawlNIH(): Promise<RawArticle[]> {
  return fetchRSS('https://www.nih.gov/feeds/health-info.xml', 'NIH')
}

export async function crawlPubMed(): Promise<RawArticle[]> {
  const searches = [
    'disease+outbreak',
    'infectious+disease',
    'pandemic',
    'public+health',
  ]
  const results = await Promise.allSettled(
    searches.map((q) =>
      fetchRSS(
        `https://pubmed.ncbi.nlm.nih.gov/rss/search/?term=${q}&limit=10&format=rss`,
        'PubMed'
      )
    )
  )
  const all = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
  const seen = new Set<string>()
  return all.filter((a) => {
    if (seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })
}

export async function crawlMedicalXpress(): Promise<RawArticle[]> {
  return fetchRSS('https://medicalxpress.com/rss-feed/', 'MedicalXpress')
}

export async function crawlGoogleNewsHealth(): Promise<RawArticle[]> {
  return fetchRSS(
    'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US:en',
    'Google News Health'
  )
}

export async function crawlReuters(): Promise<RawArticle[]> {
  return fetchRSS('https://feeds.reuters.com/reuters/healthNews', 'Reuters Health')
}

export async function crawlAllSources(): Promise<RawArticle[]> {
  const crawlers = [
    crawlWHO,
    crawlCDC,
    crawlNIH,
    crawlPubMed,
    crawlMedicalXpress,
    crawlGoogleNewsHealth,
    crawlReuters,
  ]

  const results = await Promise.allSettled(crawlers.map((fn) => fn()))
  const all = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))

  const seen = new Set<string>()
  return all.filter((a) => {
    if (!a.url || seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })
}
