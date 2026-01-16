import React from 'react'

export default function TimelineTab({ result }) {
  const events = [
    {
      time: '14:30:00',
      label: 'Original video recorded',
      details: '30 seconds, 1080p, Person A speaking',
      type: 'original',
    },
    {
      time: '15:15:00',
      label: 'Video loaded into editing software',
      details: 'File timestamp gap detected (45 minutes)',
      type: 'detected',
    },
    {
      time: '15:40:00',
      label: 'Face swap processing',
      details: 'DeepFaceLab signature detected, face region artifacts begin',
      type: 'manipulation',
    },
    {
      time: '16:05:00',
      label: 'Voice clone applied',
      details: 'RVC tool signature detected, audio anomalies begin',
      type: 'manipulation',
    },
    {
      time: '16:20:00',
      label: 'Lip-sync correction',
      details: 'Wav2Lip patterns detected, mouth region re-processed',
      type: 'manipulation',
    },
    {
      time: '16:45:00',
      label: 'Final render & export',
      details: 'H.264 re-encoding detected, file modification timestamp',
      type: 'detected',
    },
    {
      time: '17:30:00',
      label: 'Upload to Twitter',
      details: 'First public appearance, viral spread began',
      type: 'uploaded',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card p-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-text-secondary text-sm mb-1">Estimated Creation Time</p>
            <p className="text-2xl font-bold text-text-primary">2h 15m</p>
          </div>
          <div>
            <p className="text-text-secondary text-sm mb-1">Creator Skill Level</p>
            <p className="text-2xl font-bold text-text-primary">Advanced</p>
          </div>
          <div>
            <p className="text-text-secondary text-sm mb-1">Tools Used</p>
            <p className="text-2xl font-bold text-text-primary">3+</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h4 className="font-bold text-text-primary mb-6">Manipulation Timeline</h4>
        <div className="relative pl-8">
          {events.map((event, idx) => (
            <div key={idx} className="mb-8 relative">
              {/* Timeline Dot */}
              <div
                className={`absolute left-0 top-1 w-3 h-3 rounded-full -translate-x-5 ${
                  event.type === 'manipulation'
                    ? 'bg-red-500'
                    : event.type === 'detected'
                      ? 'bg-yellow-500'
                      : event.type === 'uploaded'
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                }`}
              ></div>

              {/* Timeline Line */}
              {idx < events.length - 1 && (
                <div className="absolute left-0 top-3 w-0.5 h-12 bg-dark-tertiary -translate-x-4"></div>
              )}

              {/* Content */}
              <div>
                <p className="text-text-primary font-mono text-sm font-semibold">
                  {event.time}
                </p>
                <p className="text-text-primary font-semibold mt-1">{event.label}</p>
                <p className="text-text-secondary text-sm mt-1">{event.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools Detection */}
      <div className="card p-6">
        <h4 className="font-bold text-text-primary mb-4">📦 Detected Tools</h4>
        <div className="space-y-3">
          <ToolCard
            name="DeepFaceLab"
            confidence="92%"
            description="Face swap and deepfake generation"
          />
          <ToolCard
            name="RVC (Voice Conversion)"
            confidence="87%"
            description="Voice cloning and speech synthesis"
          />
          <ToolCard
            name="Wav2Lip"
            confidence="76%"
            description="Lip-sync synchronization"
          />
        </div>
      </div>
    </div>
  )
}

function ToolCard({ name, confidence, description }) {
  return (
    <div className="bg-dark-tertiary rounded p-4 border-l-4 border-red-700">
      <div className="flex justify-between items-start mb-2">
        <p className="font-semibold text-text-primary">{name}</p>
        <span className="text-red-300 text-sm font-bold">{confidence}</span>
      </div>
      <p className="text-text-secondary text-sm">{description}</p>
    </div>
  )
}
