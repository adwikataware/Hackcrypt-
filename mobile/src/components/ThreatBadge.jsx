import React from 'react'

export default function ThreatBadge({ level }) {
  const config = {
    HIGH: {
      bg: 'bg-red-950',
      border: 'border-red-700',
      text: 'text-red-300',
      label: '🔴 HIGH',
    },
    MEDIUM: {
      bg: 'bg-yellow-950',
      border: 'border-yellow-700',
      text: 'text-yellow-300',
      label: '🟡 MEDIUM',
    },
    LOW: {
      bg: 'bg-green-950',
      border: 'border-green-700',
      text: 'text-green-300',
      label: '🟢 LOW',
    },
  }

  const style = config[level] || config.MEDIUM

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg px-4 py-3`}>
      <p className={`${style.text} font-semibold text-sm`}>
        Threat Level
      </p>
      <p className={`${style.text} font-bold text-lg`}>
        {style.label}
      </p>
    </div>
  )
}
