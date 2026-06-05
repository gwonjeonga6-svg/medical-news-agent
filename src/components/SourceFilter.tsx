'use client'

const SOURCES = [
  'WHO',
  'CDC',
  'NIH',
  'PubMed',
  'MedicalXpress',
  'Google News Health',
  'Reuters Health',
]

export default function SourceFilter({
  selected,
  onChange,
}: {
  selected: string
  onChange: (source: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
          !selected
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        전체
      </button>
      {SOURCES.map((source) => (
        <button
          key={source}
          onClick={() => onChange(source === selected ? '' : source)}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            selected === source
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {source}
        </button>
      ))}
    </div>
  )
}
