import { useState, useCallback } from 'react'
import VoiceRecorder from './components/VoiceRecorder'
import AnalysisPanel from './components/AnalysisPanel'
import HighlightedText from './components/HighlightedText'
import ConfidenceGuide from './components/ConfidenceGuide'

interface Highlight {
  start: number
  end: number
  score: number
  reason: string
}

interface AnalysisResult {
  confidence: number
  label: string
  highlights: Highlight[]
}

function App() {
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleTranscriptUpdate = useCallback((text: string) => {
    setTranscript(text)
  }, [])

  const handleAnalyze = useCallback(async (text: string) => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <header className="border-b border-navy-700 bg-navy-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-gold-400">AI Speech Detector</h1>
              <p className="text-xs text-navy-400">MUN Edition</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 p-6">
              <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">Voice Recognition</h2>
              <VoiceRecorder
                onTranscriptUpdate={handleTranscriptUpdate}
                disabled={isAnalyzing}
              />
            </div>

            <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold text-gold-400">Speech Text</h2>
                <button
                  onClick={() => handleAnalyze(transcript)}
                  disabled={!transcript.trim() || isAnalyzing}
                  className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-gold-400 hover:to-gold-500 transition-all"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Speech'}
                </button>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your speech transcription will appear here, or type directly..."
                className="w-full h-64 p-4 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-500 resize-none focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <ConfidenceGuide />
          </div>

          <div className="space-y-6">
            <AnalysisPanel
              confidence={analysis?.confidence ?? null}
              label={analysis?.label ?? null}
              isAnalyzing={isAnalyzing}
            />

            {analysis && transcript && (
              <HighlightedText
                text={transcript}
                highlights={analysis.highlights}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-navy-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-navy-500 text-sm">
          AI Speech Detector — For Model UN Committees
        </div>
      </footer>
    </div>
  )
}

export default App