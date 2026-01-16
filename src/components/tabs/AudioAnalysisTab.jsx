import React from 'react'

export default function AudioAnalysisTab({ result }) {
  return (
    <div className="space-y-6">
      {/* Spectrogram Placeholder */}
      <div className="card p-8">
        <h4 className="font-bold text-text-primary mb-4">Spectrogram Analysis</h4>
        <div className="bg-dark-tertiary rounded-lg aspect-video flex items-center justify-center mb-4">
          <div className="text-center">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-text-secondary">Audio spectrogram would appear here</p>
            <p className="text-text-secondary text-xs mt-2">
              Frequency distribution over time
            </p>
          </div>
        </div>
      </div>

      {/* Audio Anomalies */}
      <div className="card p-6">
        <h4 className="font-bold text-text-primary mb-4">Detected Anomalies</h4>
        <div className="space-y-3">
          <AnomalyItem
            label="Pitch Consistency"
            status="Suspicious"
            detail="Overly consistent pitch pattern detected (robotic)"
          />
          <AnomalyItem
            label="Breathing Sounds"
            status="Missing"
            detail="No natural breathing between phrases"
          />
          <AnomalyItem
            label="Prosody Pattern"
            status="Unnatural"
            detail="Emotional intonation doesn't match content"
          />
          <AnomalyItem
            label="Spectral Profile"
            status="Anomalous"
            detail="Missing harmonic complexity typical of human voice"
          />
        </div>
      </div>

      {/* Audio Metrics */}
      <div className="card p-6">
        <h4 className="font-bold text-text-primary mb-4">Audio Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox label="MFCCs Variance" value="Low" status="suspicious" />
          <MetricBox label="Pitch Variation" value="0.2Hz" status="suspicious" />
          <MetricBox label="Zero-Cross Rate" value="Normal" status="normal" />
          <MetricBox label="Spectral Rolloff" value="Limited" status="suspicious" />
        </div>
      </div>

      {/* AI Voice Tools Detected */}
      <div className="card p-6 border-yellow-700 border-2">
        <h4 className="font-bold text-text-primary mb-4">🔍 Likely AI Tools</h4>
        <div className="space-y-2 text-text-secondary text-sm">
          <p>✓ <span className="font-semibold">RVC (Retrieval-based Voice Conversion)</span> - High probability</p>
          <p>✓ <span className="font-semibold">So-VITS-VC</span> - Possible</p>
          <p>• <span className="font-semibold">ElevenLabs API</span> - Less likely (higher quality)</p>
        </div>
      </div>
    </div>
  )
}

function AnomalyItem({ label, status, detail }) {
  return (
    <div className="flex justify-between items-start gap-4 pb-3 border-b border-dark-tertiary">
      <div>
        <p className="font-semibold text-text-primary text-sm">{label}</p>
        <p className="text-text-secondary text-xs mt-1">{detail}</p>
      </div>
      <span className="bg-red-950 border border-red-700 text-red-300 px-3 py-1 rounded text-xs font-semibold whitespace-nowrap">
        {status}
      </span>
    </div>
  )
}

function MetricBox({ label, value, status }) {
  const borderColor = status === 'suspicious' ? 'border-red-700' : 'border-green-700'
  return (
    <div className={`bg-dark-tertiary border ${borderColor} rounded p-3`}>
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      <p className="text-text-primary font-semibold">{value}</p>
    </div>
  )
}
