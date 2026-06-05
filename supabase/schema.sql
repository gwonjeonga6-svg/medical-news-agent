-- Medical News Agent - Supabase Schema

CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  ai_summary TEXT,
  tags TEXT[],
  image_url TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_collected_at ON news_articles (collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_source ON news_articles (source);
CREATE INDEX IF NOT EXISTS idx_news_url ON news_articles (url);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_news_title_fts ON news_articles USING gin(to_tsvector('english', title));

-- Enable Row Level Security
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON news_articles
  FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access" ON news_articles
  FOR ALL USING (auth.role() = 'service_role');
