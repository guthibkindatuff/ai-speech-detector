import ConfidenceMeter from './ConfidenceMeter'

interface AnalysisPanelProps {
  confidence: number | null
  label: string | null
  isAnalyzing: boolean
}

export default function AnalysisPanel({ confidence, label, isAnalyzing }: AnalysisPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          <p className="text-navy-400 font-medium">Analyzing speech patterns...</p>
        </div>
      </div>
    )
  }

  if (confidence === null) {
    return (
      <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 p-8">
        <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">Analysis Result</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-navy-700 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p className="text-navy-500">Enter a speech and click Analyze to see results</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 p-6">
      <h2 className="font-serif text-lg font-bold text-gold-400 mb-6">Analysis Result</h2>
      <ConfidenceMeter confidence={confidence} label={label ?? ''} />
    </div>
  )
}