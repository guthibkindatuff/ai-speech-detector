import { useState } from 'react'

interface Highlight {
  start: number
  end: number
  score: number
  reason: string
}

interface HighlightedTextProps {
  text: string
  highlights: Highlight[]
}

export default function HighlightedText({ text, highlights }: HighlightedTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!highlights || highlights.length === 0) {
    return null
  }

  const renderHighlightedText = () => {
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start)
    const parts: JSX.Element[] = []
    let lastIndex = 0

    sortedHighlights.forEach((highlight, index) => {
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>{text.slice(lastIndex, highlight.start)}</span>
        )
      }

      const intensity = Math.min(highlight.score, 1)
      const bgColor = `rgba(245, 158, 11, ${0.2 + intensity * 0.4})`
      const borderColor = `rgba(245, 158, 11, ${0.4 + intensity * 0.6})`

      parts.push(
        <span
          key={`highlight-${index}`}
          className="relative cursor-help border-b-2"
          style={{
            backgroundColor: bgColor,
            borderColor: borderColor,
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {text.slice(highlight.start, highlight.end)}
          {hoveredIndex === index && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-900 border border-amber-500/50 rounded-lg text-xs text-amber-300 whitespace-nowrap z-10 shadow-lg">
              {highlight.reason} ({(highlight.score * 100).toFixed(0)}%)
            </span>
          )}
        </span>
      )

      lastIndex = highlight.end
    })

    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.slice(lastIndex)}</span>)
    }

    return parts
  }

  return (
    <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 p-6">
      <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">Highlighted Segments</h2>
      <p className="text-xs text-navy-500 mb-4">
        Hover over highlighted passages to see why they scored high for AI content
      </p>
      <div className="p-4 bg-navy-900/50 rounded-lg border border-navy-600 text-navy-200 leading-relaxed">
        {renderHighlightedText()}
      </div>
    </div>
  )
}