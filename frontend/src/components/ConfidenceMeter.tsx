import { useEffect, useState } from 'react'

interface ConfidenceMeterProps {
  confidence: number
  label: string
}

export default function ConfidenceMeter({ confidence, label }: ConfidenceMeterProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedConfidence(confidence), 100)
    return () => clearTimeout(timer)
  }, [confidence])

  const getGradient = () => {
    if (confidence >= 60) {
      return 'from-red-500 to-red-600'
    } else if (confidence >= 40) {
      return 'from-amber-500 to-amber-600'
    } else {
      return 'from-emerald-500 to-emerald-600'
    }
  }

  const getBgColor = () => {
    if (confidence >= 60) {
      return 'bg-red-500/20'
    } else if (confidence >= 40) {
      return 'bg-amber-500/20'
    } else {
      return 'bg-emerald-500/20'
    }
  }

  const getTextColor = () => {
    if (confidence >= 60) {
      return 'text-red-400'
    } else if (confidence >= 40) {
      return 'text-amber-400'
    } else {
      return 'text-emerald-400'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-navy-400 text-sm font-medium">AI Confidence</span>
        <span className={`font-bold text-2xl ${getTextColor()}`}>{animatedConfidence}%</span>
      </div>

      <div className={`h-4 ${getBgColor()} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${getGradient()} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${animatedConfidence}%` }}
        />
      </div>

      <div className="text-center">
        <span className={`font-serif text-xl font-bold ${getTextColor()}`}>{label}</span>
      </div>
    </div>
  )
}