import React, { useState } from 'react'
import SummaryCard from '../components/SummaryCard'
import ConfidenceBreakdown from '../components/ConfidenceBreakdown'
import ThreatBadge from '../components/ThreatBadge'
import Tabs from '../components/Tabs'
import OverviewTab from '../components/tabs/OverviewTab'
import VisualAnalysisTab from '../components/tabs/VisualAnalysisTab'
import AudioAnalysisTab from '../components/tabs/AudioAnalysisTab'
import TimelineTab from '../components/tabs/TimelineTab'

export default function Results({ result, fileType, onBackHome }) {
  const [activeTab, setActiveTab] = useState('overview')

  // Determine which tabs to show based on file type
  const getAvailableTabs = () => {
    const baseTabs = [{ id: 'overview', label: 'Overview', icon: '📊' }]

    if (fileType === 'video') {
      return [
        ...baseTabs,
        { id: 'visual', label: 'Visual Analysis', icon: '👁️' },
        { id: 'audio', label: 'Audio Analysis', icon: '🔊' },
        { id: 'timeline', label: 'Timeline', icon: '⏱️' },
      ]
    }

    if (fileType === 'image') {
      return [
        ...baseTabs,
        { id: 'visual', label: 'Visual Analysis', icon: '👁️' },
      ]
    }

    if (fileType === 'audio') {
      return [
        ...baseTabs,
        { id: 'audio', label: 'Audio Analysis', icon: '🔊' },
      ]
    }

    return baseTabs
  }

  const tabs = getAvailableTabs()

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-dark-tertiary sticky top-0 z-40 bg-dark">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackHome}
              className="text-text-secondary hover:text-text-primary transition-smooth"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-text-primary">
              {fileType === 'video' && 'Video Analysis Results'}
              {fileType === 'image' && 'Image Analysis Results'}
              {fileType === 'audio' && 'Audio Analysis Results'}
            </h1>
          </div>
          <button
            onClick={() => console.log('Download report')}
            className="btn-secondary text-sm"
          >
            Download Report
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary */}
        <div className="mb-8">
          <SummaryCard result={result} />
        </div>

        {/* Confidence Breakdown */}
        <div className="mb-8">
          <ConfidenceBreakdown
            visual={result.visual_score || 0}
            audio={result.audio_score || 0}
            temporal={result.temporal_score || 0}
            lipsync={result.lipsync_score || 0}
            metadata={result.metadata_score || 0}
          />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-6">
            {activeTab === 'overview' && <OverviewTab result={result} fileType={fileType} />}
            {activeTab === 'visual' && fileType !== 'audio' && <VisualAnalysisTab result={result} />}
            {activeTab === 'audio' && fileType !== 'image' && <AudioAnalysisTab result={result} />}
            {activeTab === 'timeline' && fileType === 'video' && <TimelineTab result={result} />}
          </div>
        </div>
      </main>
    </div>
  )
}
