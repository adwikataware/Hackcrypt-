import React from 'react'

export default function VisualAnalysisTab({ result }) {
  return (
    <div className="space-y-6">
      {/* Heatmap Placeholder */}
      <div className="card p-8">
        <h4 className="font-bold text-text-primary mb-4">Manipulation Heatmap</h4>
        <div className="bg-dark-tertiary rounded-lg aspect-video flex items-center justify-center mb-4">
          <div className="text-center">
            <p className="text-4xl mb-2">🗺️</p>
            <p className="text-text-secondary">Heatmap visualization would appear here</p>
            <p className="text-text-secondary text-xs mt-2">
              Red areas = high manipulation probability
            </p>
          </div>
        </div>
        <p className="text-text-secondary text-sm">
          The heatmap shows which regions of the video had the highest deepfake detection scores,
          highlighting the precise areas where manipulation was detected.
        </p>
      </div>

      {/* Detected Artifacts */}
      <div className="card p-6">
        <h4 className="font-bold text-text-primary mb-4">Detected Artifacts</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArtifactCard
            title="Face Boundary Blending"
            description="Slight blur detected at face-background boundary"
            severity="high"
          />
          <ArtifactCard
            title="Skin Texture Inconsistency"
            description="Unnatural pore patterns and color gradients"
            severity="high"
          />
          <ArtifactCard
            title="Eye Region Distortion"
            description="Blink pattern is too regular and infrequent"
            severity="medium"
          />
          <ArtifactCard
            title="Compression Artifacts"
            description="Different compression levels in face vs background"
            severity="medium"
          />
        </div>
      </div>

      {/* Model Confidence */}
      <div className="card p-6">
        <h4 className="font-bold text-text-primary mb-4">Model Performance</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">XceptionNet Model</span>
            <span className="text-text-primary font-semibold">92% Confidence</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">MobileNet Fast Check</span>
            <span className="text-text-primary font-semibold">88% Confidence</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Ensemble Agreement</span>
            <span className="text-text-primary font-semibold">✓ High Agreement</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArtifactCard({ title, description, severity }) {
  const color = severity === 'high' ? 'border-red-700' : 'border-yellow-700'
  return (
    <div className={`bg-dark-tertiary border ${color} border-l-4 rounded p-4`}>
      <p className="font-semibold text-text-primary text-sm">{title}</p>
      <p className="text-text-secondary text-xs mt-1">{description}</p>
    </div>
  )
}
