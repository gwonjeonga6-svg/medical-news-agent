# Medical News Agent

WHO, CDC, NIH, PubMed 등 7개 주요 의료 기관의 최신 질병 정보를 자동 수집하고 AI로 요약하는 에이전트입니다.

## 주요 기능

- **자동 뉴스 수집**: Vercel Cron으로 6시간마다 자동 실행
- **AI 요약**: OpenRouter/auto 모델로 한국어 요약 자동 생성
- **태그 추출**: 기사별 핵심 키워드 자동 태깅
- **소스 필터**: WHO, CDC, NIH, PubMed, MedicalXpress, Google News, Reuters 별 필터
- **검색**: 제목 및 요약 전문 검색

## 수집 소스

| 소스 | 방식 |
|------|------|
| WHO | RSS Feed |
| CDC | RSS Feed |
| NIH | RSS Feed |
| PubMed | RSS Feed (질병 검색어 기반) |
| MedicalXpress | RSS Feed |
| Google News Health | RSS Feed |
| Reuters Health | RSS Feed |

## 기술 스택

- **Frontend/Backend**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **LLM**: OpenRouter (auto model)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## 설정

### 1. Supabase 테이블 생성

`supabase/schema.sql` 파일을 Supabase SQL Editor에서 실행하세요.

### 2. 환경 변수

`.env.example`을 복사해 `.env.local`을 만들고 값을 채우세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=       # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=      # Supabase service role key
OPENROUTER_API_KEY=             # OpenRouter API 키
CRON_SECRET=                    # Cron 인증용 임의 문자열
NEXT_PUBLIC_APP_URL=            # 배포 URL
```

### 3. Vercel 배포

```bash
vercel --prod
```

Vercel 환경 변수에도 동일하게 설정하세요.

## 로컬 실행

```bash
npm install
npm run dev
```

## Cron 스케줄

`vercel.json`에 6시간마다 실행되도록 설정되어 있습니다:

```json
{
  "crons": [{ "path": "/api/cron/collect", "schedule": "0 */6 * * *" }]
}
```

수동 실행: `GET /api/cron/collect`
