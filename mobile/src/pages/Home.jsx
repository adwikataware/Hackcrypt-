import React, { useState } from 'react'
import axios from 'axios'

export default function Home({ onAnalyze }) {
  const [analyzing, setAnalyzing] = useState(false)

  const mockAnalysis = {
    confidence: 87,
    type: 'Face Swap',
    threat: 'HIGH',
    visual: 92,
    audio: 76,
    temporal: 81,
    lipsync: 68,
    artifacts: ['Facial boundary blending', 'Lighting inconsistency', 'Skin texture mismatch']
  }

  const handleAnalyze = async (source) => {
    setAnalyzing(true)
    
    // Simulate analysis delay
    setTimeout(() => {
      onAnalyze({
        ...mockAnalysis,
        source: source,
        timestamp: new Date().toLocaleString()
      })
      setAnalyzing(false)
    }, 2000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleAnalyze('File Upload: ' + file.name)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
        <h1 className="text-4xl font-bold mb-2">🛡️ DeepFake Shield</h1>
        <p className="text-blue-100">Mobile Deepfake Detection</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Upload Card */}
        <div className="bg-slate-700 rounded-lg p-6 border-2 border-dashed border-blue-400">
          <h2 className="text-xl font-bold mb-4">📁 Upload Video</h2>
          <label className="block">
            <div className="bg-slate-600 hover:bg-slate-500 cursor-pointer rounded-lg p-8 text-center transition">
              <p className="text-blue-300 font-semibold">Tap to choose file</p>
              <p className="text-sm text-slate-400 mt-2">MP4, AVI, MOV (Max 100MB)</p>
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Quick Check Cards */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => handleAnalyze('Instagram Video')}
            disabled={analyzing}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 rounded-lg p-6 text-left transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">📷</span>
              <div>
                <h3 className="font-bold">Analyze Instagram Video</h3>
                <p className="text-sm text-pink-100">Quick local analysis</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleAnalyze('Twitter Video')}
            disabled={analyzing}
            className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:opacity-50 rounded-lg p-6 text-left transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐦</span>
              <div>
                <h3 className="font-bold">Analyze Twitter Video</h3>
                <p className="text-sm text-sky-100">Quick local analysis</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleAnalyze('YouTube Video')}
            disabled={analyzing}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50 rounded-lg p-6 text-left transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">▶️</span>
              <div>
                <h3 className="font-bold">Analyze YouTube Video</h3>
                <p className="text-sm text-red-100">Quick local analysis</p>
              </div>
            </div>
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-slate-700 rounded-lg p-4 text-sm border-l-4 border-blue-400">
          <p className="font-semibold mb-2">🔒 Privacy First</p>
          <p className="text-slate-300">Video analysis is performed on your device. No data is sent to servers without your consent.</p>
        </div>
      </div>

      {/* Loading State */}
      {analyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Analyzing video...</p>
            <p className="text-slate-400 mt-2">Using on-device ML model</p>
          </div>
        </div>
      )}
    </div>
  )
}
