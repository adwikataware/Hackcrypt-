import React from 'react'

export default function OverviewTab({ result, fileType }) {
  return (
    <div className="space-y-6">
      {/* Primary Findings */}
      {result.primary_findings && result.primary_findings.length > 0 && (
        <div className="card p-6">
          <h4 className="font-bold text-text-primary mb-4">Primary Findings</h4>
          <div className="space-y-3">
            {result.primary_findings.map((finding, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-2xl">
                  {finding.type === 'face_swap' && '🎬'}
                  {finding.type === 'voice_clone' && '🔊'}
                  {finding.type === 'lipsync_manipulation' && '👄'}
                  {finding.type === 'ai_generated' && '🤖'}
                  {finding.type === 'audio_anomaly' && '📊'}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary capitalize">
                    {finding.type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-text-secondary text-sm">{finding.description}</p>
                  {finding.tool && (
                    <p className="text-text-secondary text-xs mt-1">Tool: {finding.tool}</p>
                  )}
                </div>
                <span className="text-lg font-bold text-text-primary">
                  {Math.round(finding.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Artifacts (for images) */}
      {result.artifacts && result.artifacts.length > 0 && (
        <div className="card p-6">
          <h4 className="font-bold text-text-primary mb-4">Detected Artifacts</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.artifacts.map((artifact, idx) => (
              <div
                key={idx}
                className={`rounded p-3 border-l-4 ${
                  artifact.severity === 'high'
                    ? 'bg-red-950 border-red-700'
                    : 'bg-yellow-950 border-yellow-700'
                }`}
              >
                <p className="font-semibold text-text-primary text-sm">{artifact.artifact}</p>
                <p className="text-text-secondary text-xs mt-1 capitalize">
                  Severity: {artifact.severity}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Anomalies (for audio files) */}
      {result.audio_anomalies && result.audio_anomalies.length > 0 && (
        <div className="card p-6">
          <h4 className="font-bold text-text-primary mb-4">Detected Anomalies</h4>
          <div className="space-y-3">
            {result.audio_anomalies.map((anomaly, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4 pb-3 border-b border-dark-tertiary last:border-0">
                <div>
                  <p className="font-semibold text-text-primary text-sm">{anomaly.anomaly}</p>
                  <p className="text-text-secondary text-xs mt-1">{anomaly.detail}</p>
                </div>
                <span className="bg-red-950 border border-red-700 text-red-300 px-3 py-1 rounded text-xs font-semibold whitespace-nowrap">
                  {anomaly.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Summary */}
      {fileType === 'video' && (
        <div className="card p-6">
          <h4 className="font-bold text-text-primary mb-4">Evidence Summary</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>✓ Facial boundary artifacts detected in key frames</li>
            <li>✓ Inconsistent lighting patterns on face region</li>
            <li>✓ Missing breathing sounds between words</li>
            <li>✓ Spectral anomalies in audio signal</li>
            <li>✓ Unnatural mouth-audio synchronization</li>
            <li>✓ Multiple encoding layers detected in metadata</li>
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="card p-6 border-yellow-700 border-2">
        <h4 className="font-bold text-text-primary mb-4">⚠️ Recommended Actions</h4>
        <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
          <li>Report to platform for immediate takedown</li>
          <li>Notify relevant authorities if sensitive content</li>
          <li>Alert fact-checking organizations</li>
          <li>Issue public warning/clarification</li>
          <li>Consider legal action against creator</li>
        </ol>
      </div>
    </div>
  )
}
