import React from 'react'
import ThreatBadge from './ThreatBadge'

export default function SummaryCard({ result }) {
  const confidence = result.confidence || 87
  const type = result.type || 'Multi-Stage Hybrid'
  const threat = result.threat || 'HIGH'

  const isDeepfake = confidence > 50

  return (
    <div className="card p-8 border-2 border-dark-tertiary">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-dark-tertiary flex items-center justify-center">
              {isDeepfake ? (
                <span className="text-xl font-bold text-red-500">!</span>
              ) : (
                <span className="text-xl font-bold text-green-500">✓</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                {isDeepfake ? 'Deepfake Detected' : 'Likely Authentic'}
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                {isDeepfake
                  ? 'This video shows signs of manipulation'
                  : 'This video appears to be genuine'}
              </p>
            </div>
          </div>
        </div>
        <ThreatBadge level={threat} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Confidence */}
        <div>
          <p className="text-text-secondary text-sm mb-2">Overall Confidence</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-text-primary">
              {confidence}%
            </span>
          </div>
          <div className="mt-3 w-full h-2 bg-dark-tertiary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                confidence > 70 ? 'bg-red-500' : confidence > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Classification */}
        <div>
          <p className="text-text-secondary text-sm mb-2">Classification</p>
          <p className="text-text-primary font-semibold text-lg">{type}</p>
          <p className="text-text-secondary text-xs mt-2">
            Primary manipulation type detected
          </p>
        </div>

        {/* Threat Analysis */}
        <div>
          <p className="text-text-secondary text-sm mb-2">Analysis</p>
          <div className="space-y-1">
            <p className="text-text-primary text-sm font-medium">Multi-Modal Detection</p>
            <p className="text-text-primary text-sm font-medium">Forensic Analysis</p>
            <p className="text-text-secondary text-xs mt-2">Advanced verification</p>
          </div>
        </div>
      </div>
    </div>
  )
}
