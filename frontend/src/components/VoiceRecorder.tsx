import { useState, useRef, useCallback } from 'react'

interface VoiceRecorderProps {
  onTranscriptUpdate: (text: string) => void
  disabled?: boolean
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionConstructor {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export default function VoiceRecorder({ onTranscriptUpdate, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startRecording = useCallback(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionCtor) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognitionCtor() as SpeechRecognition

    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        }
      }

      if (finalTranscript) {
        setCurrentTranscript((prev) => {
          const newTranscript = prev + finalTranscript
          onTranscriptUpdate(newTranscript)
          return newTranscript
        })
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [onTranscriptUpdate])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording
            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30 animate-pulse'
            : 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-500/30 hover:from-gold-300 hover:to-gold-500'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isRecording ? (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className="w-10 h-10 text-navy-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      <div className="text-center">
        <p className={`font-medium ${isRecording ? 'text-red-400' : 'text-navy-300'}`}>
          {isRecording ? 'Recording...' : 'Click to Start Recording'}
        </p>
        <p className="text-sm text-navy-500 mt-1">
          {isRecording ? 'Speak clearly into your microphone' : 'Stop recording when finished'}
        </p>
      </div>

      {currentTranscript && (
        <div className="w-full p-3 bg-navy-900/50 rounded-lg border border-navy-600">
          <p className="text-xs text-navy-500 mb-1">Current transcript:</p>
          <p className="text-sm text-navy-300">{currentTranscript}</p>
        </div>
      )}
    </div>
  )
}