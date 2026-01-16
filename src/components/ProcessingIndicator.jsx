import React, { useEffect, useState } from 'react'

export default function ProcessingIndicator({ uploadType, fileType }) {
  const [progress, setProgress] = useState(0)
  const [detectedType, setDetectedType] = useState(fileType || null)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev < 90 ? prev + Math.random() * 15 : prev
        // Simulate type detection at ~40% progress
        if (newProgress >= 35 && !detectedType && uploadType === 'url') {
          setDetectedType(['video', 'image', 'audio'][Math.floor(Math.random() * 3)])
        }
        return newProgress
      })
    }, 400)

    return () => clearInterval(interval)
  }, [uploadType, detectedType])

  // Steps for URL/media link uploads
  const urlSteps = [
    { label: 'Downloading media file', completed: progress > 15 },
    { label: 'Analyzing file type', completed: progress > 35 },
  ]

  // Steps based on detected media type
  const typeSpecificSteps = detectedType ? getTypeSpecificSteps(detectedType, progress) : []

  const allSteps = uploadType === 'url' ? [...urlSteps, ...typeSpecificSteps] : getTypeSpecificSteps(uploadType || 'video', progress)

  return (
    <div className="card p-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Analyzing Media</h2>
      {detectedType && uploadType === 'url' && (
        <p className="text-text-secondary text-sm mb-6">
          Detected type: <span className="font-semibold capitalize">{detectedType}</span>
        </p>
      )}

      <div className="space-y-4 mb-8">
        {allSteps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-smooth ${
                step.completed
                  ? 'bg-white text-dark'
                  : 'border border-gray-accent'
              }`}
            >
              {step.completed && '✓'}
            </div>
            <span
              className={`text-sm transition-smooth ${
                step.completed ? 'text-text-primary' : 'text-text-secondary'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary text-sm">Progress</span>
          <span className="text-text-secondary text-sm">{Math.min(Math.round(progress), 99)}%</span>
        </div>
        <div className="w-full h-1 bg-dark-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 99)}%` }}
          ></div>
        </div>
      </div>

      <p className="text-text-secondary text-sm text-center">
        Estimated time remaining: {uploadType === 'url' ? '10-20' : '8-15'} seconds
      </p>
    </div>
  )
}

function getTypeSpecificSteps(type, progress) {
  if (type === 'video') {
    return [
      { label: 'Extracting frames', completed: progress > 50 },
      { label: 'Visual analysis (face detection, artifacts)', completed: progress > 60 },
      { label: 'Audio analysis (prosody, spectral)', completed: progress > 70 },
      { label: 'Temporal analysis (blinks, movement)', completed: progress > 80 },
      { label: 'Generating forensic report', completed: progress > 90 },
    ]
  }

  if (type === 'image') {
    return [
      { label: 'Loading image data', completed: progress > 50 },
      { label: 'Face detection and analysis', completed: progress > 65 },
      { label: 'Artifact detection (texture, edges)', completed: progress > 80 },
      { label: 'Metadata examination', completed: progress > 90 },
    ]
  }

  if (type === 'audio') {
    return [
      { label: 'Processing audio waveform', completed: progress > 50 },
      { label: 'Spectral feature extraction', completed: progress > 65 },
      { label: 'Voice pattern analysis', completed: progress > 80 },
      { label: 'Generating audio report', completed: progress > 90 },
    ]
  }

  // Fallback
  return [
    { label: 'Analyzing media', completed: progress > 50 },
    { label: 'Running detection models', completed: progress > 75 },
  ]
}
