export async function summarizeArticle(title: string, content: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://medical-news-agent.vercel.app',
      'X-Title': 'Medical News Agent',
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: [
        {
          role: 'system',
          content: `당신은 의료/건강 뉴스 전문 요약가입니다.
제공된 의료 뉴스 기사를 한국어로 3-4문장으로 간결하게 요약하세요.
핵심 내용, 주요 발견사항, 환자나 공중 보건에 미치는 영향을 포함하세요.
전문 용어는 쉬운 말로 설명하세요.`,
        },
        {
          role: 'user',
          content: `제목: ${title}\n\n내용: ${content.slice(0, 3000)}`,
        },
      ],
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || '요약을 생성할 수 없습니다.'
}

export async function extractTags(title: string, content: string): Promise<string[]> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://medical-news-agent.vercel.app',
      'X-Title': 'Medical News Agent',
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: [
        {
          role: 'system',
          content: `의료 뉴스에서 핵심 태그를 5개 이하로 추출하세요. JSON 배열 형식으로만 응답하세요. 예: ["코로나19", "백신", "임상시험"]`,
        },
        {
          role: 'user',
          content: `제목: ${title}\n\n내용: ${content.slice(0, 1000)}`,
        },
      ],
      max_tokens: 100,
    }),
  })

  if (!response.ok) return []

  const data = await response.json()
  try {
    const raw = data.choices[0]?.message?.content || '[]'
    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']')
    if (start === -1 || end === -1) return []
    return JSON.parse(raw.slice(start, end + 1))
  } catch {
    return []
  }
}
