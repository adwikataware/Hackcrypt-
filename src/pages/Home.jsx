import React, { useState } from 'react'
import axios from 'axios'
import UploadZone from '../components/UploadZone'
import ProcessingIndicator from '../components/ProcessingIndicator'
import { generateMockResults } from '../utils/mockData'

export default function Home({ onAnalysisComplete }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadType, setUploadType] = useState(null) // 'file', 'url', or file type

  const getFileType = (file) => {
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('audio/')) return 'audio'
    return 'unknown'
  }

  const handleFileUpload = async (file) => {
    const type = getFileType(file)
    setIsProcessing(true)
    setUploadType(type)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock results based on file type
      const mockResult = generateMockResults(type)
      onAnalysisComplete(mockResult, type)
    } catch (error) {
      console.error('Analysis failed:', error)
      setIsProcessing(false)
      alert('Analysis failed. Please try again.')
    }
  }

  const handleURLUpload = async (url) => {
    setIsProcessing(true)
    setUploadType('url')

    try {
      // Call backend to download video
      const downloadResponse = await axios.post('http://192.168.0.108:8000/api/download', {
        url: url
      })

      if (downloadResponse.data.success) {
        // Generate mock results - use video as default for URLs
        const mockResult = generateMockResults('video')
        onAnalysisComplete(mockResult, 'video')
      } else {
        throw new Error(downloadResponse.data.error || 'Download failed')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      setIsProcessing(false)
      alert('Analysis failed: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <header className="border-b border-dark-tertiary">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-xl font-bold text-text-primary">DeepFake Shield</h1>
          </div>
          <p className="text-text-secondary text-sm">Professional Detection Platform</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        {!isProcessing ? (
          <div className="w-full max-w-2xl">
            {/* Title */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                Detect Deepfakes in Seconds
              </h2>
              <p className="text-text-secondary text-lg">
                Multi-modal analysis with visual, audio, and temporal detection
              </p>
            </div>

            {/* Upload Zone */}
            <UploadZone
              onFileUpload={handleFileUpload}
              onURLUpload={handleURLUpload}
            />

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <InfoCard
                title="Fast Analysis"
                description="Results in under 15 seconds"
              />
              <InfoCard
                title="Multi-Modal"
                description="Visual, audio & temporal checks"
              />
              <InfoCard
                title="Privacy First"
                description="Optional local processing"
              />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <ProcessingIndicator uploadType={uploadType} fileType={uploadType === 'url' ? null : uploadType} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-tertiary">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-text-secondary text-sm">
          <p>Protecting truth in the age of AI • © 2026 DeepFake Shield</p>
        </div>
      </footer>
    </div>
  )
}

function InfoCard({ title, description }) {
  return (
    <div className="card p-6 text-center">
      <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </div>
  )
}
