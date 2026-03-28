export default function ConfidenceGuide() {
  const levels = [
    { range: '85–100%', label: 'Almost Certainly AI', color: 'bg-red-500/20 border-red-500/50', textColor: 'text-red-400' },
    { range: '60–85%', label: 'Likely AI', color: 'bg-orange-500/20 border-orange-500/50', textColor: 'text-orange-400' },
    { range: '40–60%', label: 'Unclear', color: 'bg-amber-500/20 border-amber-500/50', textColor: 'text-amber-400' },
    { range: '15–40%', label: 'Likely Human', color: 'bg-emerald-500/20 border-emerald-500/50', textColor: 'text-emerald-400' },
    { range: '0–15%', label: 'Almost Certainly Human', color: 'bg-teal-500/20 border-teal-500/50', textColor: 'text-teal-400' },
  ]

  return (
    <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 p-6">
      <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">Confidence Guide</h2>
      <div className="space-y-2">
        {levels.map((level, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-2 rounded-lg border ${level.color}`}
          >
            <span className={`font-mono text-sm font-bold min-w-[60px] ${level.textColor}`}>
              {level.range}
            </span>
            <span className={`text-sm font-medium ${level.textColor}`}>
              {level.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}