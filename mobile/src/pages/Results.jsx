import React, { useState } from 'react'

export default function Results({ result, onBack }) {
  const [selectedTab, setSelectedTab] = useState('overview')

  const getThreatColor = (threat) => {
    switch (threat) {
      case 'HIGH':
        return 'text-red-400'
      case 'MEDIUM':
        return 'text-yellow-400'
      case 'LOW':
        return 'text-green-400'
      default:
        return 'text-slate-400'
    }
  }

  const getThreatBg = (threat) => {
    switch (threat) {
      case 'HIGH':
        return 'bg-red-900/30 border-red-500'
      case 'MEDIUM':
        return 'bg-yellow-900/30 border-yellow-500'
      case 'LOW':
        return 'bg-green-900/30 border-green-500'
      default:
        return 'bg-slate-700 border-slate-600'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-2xl hover:scale-110 transition"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold flex-1">Analysis Results</h1>
      </div>

      {/* Summary Card */}
      <div className={`m-4 rounded-lg p-6 border-2 ${getThreatBg(result.threat)}`}>
        <div className="flex items-start gap-4">
          <div className="text-5xl">
            {result.threat === 'HIGH' ? '🚨' : result.threat === 'MEDIUM' ? '⚠️' : '✅'}
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-2 ${getThreatColor(result.threat)}`}>
              {result.threat === 'HIGH' ? 'Likely Deepfake' : result.threat === 'MEDIUM' ? 'Suspicious' : 'Likely Authentic'}
            </h2>
            <p className="text-3xl font-bold mb-2">{result.confidence}% Confidence</p>
            <p className="text-slate-300 text-sm mb-4">Type: {result.type}</p>
            <div className="space-y-2">
              <p className={`text-sm font-semibold ${getThreatColor(result.threat)}`}>
                Threat Level: {result.threat}
              </p>
              <p className="text-xs text-slate-400">{result.timestamp}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0 px-4 border-b border-slate-600">
        {['overview', 'analysis', 'artifacts'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-3 font-semibold transition border-b-2 capitalize ${
              selectedTab === tab
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-bold mb-4">Confidence Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Visual Analysis', score: result.visual },
                  { label: 'Audio Analysis', score: result.audio },
                  { label: 'Temporal Analysis', score: result.temporal },
                  { label: 'Lip-Sync Analysis', score: result.lipsync }
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-bold">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-bold mb-3">Detection Type</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-400">Classification:</span>
                  <span className="font-semibold ml-2">{result.type}</span>
                </p>
                <p>
                  <span className="text-slate-400">Source:</span>
                  <span className="font-semibold ml-2">{result.source}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {selectedTab === 'analysis' && (
          <div className="space-y-3">
            <div className="bg-blue-900/30 border-l-4 border-blue-500 rounded p-3">
              <p className="text-sm">
                <span className="font-bold">Visual Analysis (92%):</span> Detected facial boundary blending artifacts typical of deepfake generation tools.
              </p>
            </div>
            <div className="bg-yellow-900/30 border-l-4 border-yellow-500 rounded p-3">
              <p className="text-sm">
                <span className="font-bold">Audio Analysis (76%):</span> Spectral anomalies detected in voice patterns consistent with synthetic speech.
              </p>
            </div>
            <div className="bg-purple-900/30 border-l-4 border-purple-500 rounded p-3">
              <p className="text-sm">
                <span className="font-bold">Temporal Analysis (81%):</span> Blink patterns show irregularities not typical of real human videos.
              </p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 mt-4">
              <p className="text-sm text-slate-300">
                This analysis was performed using multi-modal AI detection. For detailed forensic reports, use the web dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Artifacts Tab */}
        {selectedTab === 'artifacts' && (
          <div className="space-y-3">
            <h3 className="font-bold mb-3">Detected Artifacts</h3>
            {result.artifacts.map((artifact, i) => (
              <div key={i} className="bg-slate-700 rounded-lg p-3 flex items-start gap-2">
                <span className="text-red-400 text-lg">●</span>
                <p className="text-sm">{artifact}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2 border-t border-slate-600">
        <button
          onClick={onBack}
          className="w-full bg-slate-700 hover:bg-slate-600 rounded-lg py-3 font-semibold transition"
        >
          Analyze Another Video
        </button>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 font-semibold transition"
        >
          Share Result
        </button>
      </div>
    </div>
  )
}
