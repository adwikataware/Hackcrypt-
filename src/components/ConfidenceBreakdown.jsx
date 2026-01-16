import React from 'react'

export default function ConfidenceBreakdown({ visual, audio, temporal, lipsync, metadata }) {
  const scores = [
    { label: 'Visual', value: visual },
    { label: 'Audio', value: audio },
    { label: 'Temporal', value: temporal },
    { label: 'Lip-Sync', value: lipsync },
    { label: 'Metadata', value: metadata },
  ]

  return (
    <div className="card p-8">
      <h3 className="text-lg font-bold text-text-primary mb-6">Confidence Breakdown</h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {scores.map((score) => (
          <div key={score.label} className="bg-dark-tertiary rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-text-secondary text-sm">
                {score.label}
              </span>
              <span className="text-lg font-bold text-text-primary">
                {Math.round(score.value * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${score.value * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
