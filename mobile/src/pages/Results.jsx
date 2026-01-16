import React, { useState } from 'react'
import SummaryCard from '../components/SummaryCard'
import ConfidenceBreakdown from '../components/ConfidenceBreakdown'

export default function Results({ result, onBack }) {
  const [selectedTab, setSelectedTab] = useState('overview')

  const getSourceIcon = (source) => {
    const lowerSource = source.toLowerCase()
    if (lowerSource.includes('youtube')) return '▶️'
    if (lowerSource.includes('instagram')) return '📷'
    if (lowerSource.includes('twitter') || lowerSource.includes('x.com') || lowerSource.includes('x (')) return '𝕏'
    if (lowerSource.includes('tiktok')) return '🎵'
    if (lowerSource.includes('facebook')) return 'f'
    if (lowerSource.includes('reddit')) return '🔴'
    if (lowerSource.includes('imgur')) return '🖼️'
    return '🔗'
  }

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video':
        return '🎥'
      case 'image':
        return '🖼️'
      case 'audio':
        return '🎙️'
      default:
        return '📁'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-dark-tertiary p-6 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="text-2xl hover:text-text-secondary transition-smooth"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-text-primary flex-1">Analysis Results</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Summary Card */}
        <SummaryCard result={result} />

        {/* Tab Navigation */}
        <div className="flex gap-0 border-b border-dark-tertiary">
          {['overview', 'analysis', 'artifacts'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-3 font-semibold transition-smooth border-b-2 capitalize ${
                selectedTab === tab
                  ? 'border-blue-500 text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            {/* Media Type and Source Details */}
            <div className="card p-8">
              <h3 className="font-bold mb-6 text-text-primary">Detection Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-dark-tertiary">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMediaIcon(result.mediaType)}</span>
                    <div>
                      <p className="text-text-secondary text-sm">Media Type</p>
                      <p className="font-semibold text-text-primary capitalize">{result.mediaType}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-dark-tertiary">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getSourceIcon(result.source)}</span>
                    <div>
                      <p className="text-text-secondary text-sm">Source</p>
                      <p className="font-semibold text-text-primary">{result.source}</p>
                    </div>
                  </div>
                </div>

                {result.sourceUrl && (
                  <div>
                    <p className="text-text-secondary text-sm mb-2">URL</p>
                    <p className="font-mono text-xs text-blue-400 break-all bg-dark-tertiary p-2 rounded">
                      {result.sourceUrl}
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-sm pt-2">
                  <span className="text-text-secondary">Analyzed:</span>
                  <span className="font-semibold text-text-primary">{result.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Confidence Breakdown - Only show non-zero values */}
            {(result.visual || result.audio || result.temporal || result.lipsync) > 0 && (
              <ConfidenceBreakdown
                visual={result.visual || 0}
                audio={result.audio || 0}
                temporal={result.temporal || 0}
                lipsync={result.lipsync || 0}
              />
            )}
          </div>
        )}

        {selectedTab === 'analysis' && (
          <div className="space-y-3">
            {result.visual > 0 && (
              <div className="card bg-red-950/30 border border-red-700 rounded p-4">
                <p className="text-sm text-text-primary">
                  <span className="font-bold">Visual Analysis ({Math.round(result.visual)}%):</span> Detected facial boundary blending artifacts typical of deepfake generation tools.
                </p>
              </div>
            )}

            {result.audio > 0 && (
              <div className="card bg-yellow-950/30 border border-yellow-700 rounded p-4">
                <p className="text-sm text-text-primary">
                  <span className="font-bold">Audio Analysis ({Math.round(result.audio)}%):</span> Spectral anomalies detected in voice patterns consistent with synthetic speech.
                </p>
              </div>
            )}

            {result.temporal > 0 && (
              <div className="card bg-purple-950/30 border border-purple-700 rounded p-4">
                <p className="text-sm text-text-primary">
                  <span className="font-bold">Temporal Analysis ({Math.round(result.temporal)}%):</span> Blink patterns show irregularities not typical of real human videos.
                </p>
              </div>
            )}

            {result.lipsync > 0 && (
              <div className="card bg-blue-950/30 border border-blue-700 rounded p-4">
                <p className="text-sm text-text-primary">
                  <span className="font-bold">Lip-Sync Analysis ({Math.round(result.lipsync)}%):</span> Audio-visual synchronization issues detected.
                </p>
              </div>
            )}

            <div className="card p-4 mt-4">
              <p className="text-sm text-text-secondary">
                This analysis was performed using multi-modal AI detection. For detailed forensic reports, use the web dashboard.
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'artifacts' && (
          <div className="space-y-3">
            <h3 className="font-bold mb-3 text-text-primary">Detected Artifacts</h3>
            {result.artifacts && result.artifacts.length > 0 ? (
              result.artifacts.map((artifact, i) => (
                <div key={i} className="card rounded-lg p-4 flex items-start gap-3">
                  <span className="text-red-400 text-lg flex-shrink-0">●</span>
                  <p className="text-sm text-text-primary">{artifact}</p>
                </div>
              ))
            ) : (
              <div className="card p-4">
                <p className="text-sm text-text-secondary">No significant artifacts detected in this media.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 md:p-6 space-y-2 border-t border-dark-tertiary bg-dark-secondary max-w-4xl mx-auto w-full">
        <button
          onClick={onBack}
          className="btn-secondary w-full"
        >
          Analyze Another Media
        </button>
        <button
          className="btn-primary w-full"
        >
          Share Result
        </button>
      </div>
    </div>
  )
}
