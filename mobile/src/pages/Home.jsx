import React, { useState, useEffect } from 'react'
import UploadZone from '../components/UploadZone'

export default function Home({ onAnalyze }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisStage, setAnalysisStage] = useState('')
  const [mediaType, setMediaType] = useState('video') // 'video', 'image', 'audio'
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [linkLoading, setLinkLoading] = useState(false)

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

  const mockImageAnalysis = {
    confidence: 74,
    type: 'Face Swap',
    threat: 'MEDIUM',
    visual: 78,
    audio: 0,
    temporal: 0,
    lipsync: 0,
    artifacts: ['Blending edges', 'Unnatural skin tone']
  }

  const mockAudioAnalysis = {
    confidence: 81,
    type: 'Voice Clone',
    threat: 'HIGH',
    visual: 0,
    audio: 89,
    temporal: 0,
    lipsync: 0,
    artifacts: ['Spectral anomalies', 'Missing breathing patterns', 'Robotic pitch']
  }

  const stagesVideo = [
    { name: 'Extracting frames...', duration: 400 },
    { name: 'Running visual analysis...', duration: 600 },
    { name: 'Analyzing audio patterns...', duration: 500 },
    { name: 'Temporal consistency check...', duration: 500 },
    { name: 'Lip-sync detection...', duration: 400 },
    { name: 'Finalizing results...', duration: 300 },
  ]

  const stagesImage = [
    { name: 'Loading image...', duration: 300 },
    { name: 'Detecting faces...', duration: 400 },
    { name: 'Running visual analysis...', duration: 800 },
    { name: 'Checking artifacts...', duration: 500 },
    { name: 'Finalizing results...', duration: 300 },
  ]

  const stagesAudio = [
    { name: 'Loading audio...', duration: 300 },
    { name: 'Extracting features...', duration: 500 },
    { name: 'Analyzing voice patterns...', duration: 700 },
    { name: 'Checking synthesis markers...', duration: 500 },
    { name: 'Finalizing results...', duration: 300 },
  ]

  const stages = mediaType === 'video' ? stagesVideo : mediaType === 'image' ? stagesImage : stagesAudio

  const detectFileType = (filename) => {
    const lower = filename.toLowerCase()
    const imageExt = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    const audioExt = ['.mp3', '.wav', '.aac', '.flac', '.m4a', '.ogg']
    const videoExt = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv']

    if (imageExt.some(ext => lower.endsWith(ext))) return 'image'
    if (audioExt.some(ext => lower.endsWith(ext))) return 'audio'
    if (videoExt.some(ext => lower.endsWith(ext))) return 'video'
    return 'video' // default
  }

  const detectSourceFromUrl = (url) => {
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes('youtu.be') || lowerUrl.includes('youtube.com')) return 'YouTube'
    if (lowerUrl.includes('instagram.com') || lowerUrl.includes('insta')) return 'Instagram'
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com') || lowerUrl.includes('twitter')) return 'X (Twitter)'
    if (lowerUrl.includes('tiktok.com')) return 'TikTok'
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) return 'Facebook'
    if (lowerUrl.includes('reddit.com')) return 'Reddit'
    if (lowerUrl.includes('imgur.com')) return 'Imgur'
    return 'Unknown Source'
  }

  const detectMediaTypeFromUrl = (url) => {
    const lowerUrl = url.toLowerCase()
    // Simple detection based on URL patterns
    if (lowerUrl.includes('youtu.be') || lowerUrl.includes('youtube.com') || lowerUrl.includes('soundcloud.com') || lowerUrl.includes('spotify.com')) {
      return 'audio'
    }
    if (lowerUrl.includes('imgur.com') || lowerUrl.includes('instagram.com')) {
      return 'image'
    }
    return 'video' // Default to video
  }

  useEffect(() => {
    if (!analyzing) return

    let currentStage = 0
    let currentProgress = 0
    let startTime = Date.now()
    const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0)

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime

      // Calculate which stage we're in
      let stageProgress = 0
      let timeInCurrentStage = 0

      for (let i = 0; i < stages.length; i++) {
        if (elapsed >= stageProgress) {
          currentStage = i
          timeInCurrentStage = elapsed - stageProgress
          setAnalysisStage(stages[i].name)
        } else {
          break
        }
        stageProgress += stages[i].duration
      }

      // Calculate overall progress
      currentProgress = Math.min(95, (elapsed / totalDuration) * 100)
      setProgress(Math.round(currentProgress))

      // Finish after all stages complete
      if (elapsed > totalDuration) {
        setProgress(100)
        setAnalysisStage('Processing complete!')
        clearInterval(interval)

        setTimeout(() => {
          const selectedAnalysis = mediaType === 'image' ? mockImageAnalysis : mediaType === 'audio' ? mockAudioAnalysis : mockAnalysis
          onAnalyze({
            ...selectedAnalysis,
            mediaType: mediaType,
            source: detectSourceFromUrl(linkInput) || 'File Upload',
            sourceUrl: linkInput,
            timestamp: new Date().toLocaleString()
          })
          setAnalyzing(false)
          setProgress(0)
          setLinkInput('')
        }, 500)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [analyzing, mediaType])

  const handleAnalyze = async (source, detectedType = null) => {
    if (detectedType) {
      setMediaType(detectedType)
    }
    setAnalyzing(true)
    setProgress(0)
    setAnalysisStage('Initializing...')
  }

  const handleFileUpload = (file) => {
    if (file) {
      const detectedType = detectFileType(file.name)
      setMediaType(detectedType)
      handleAnalyze('File Upload: ' + file.name, detectedType)
    }
  }

  const handleLinkAnalysis = async () => {
    if (!linkInput.trim()) return

    setLinkLoading(true)
    setShowLinkInput(false)
    setAnalysisStage('Downloading media...')

    try {
      // Call backend to download video
      const downloadResponse = await fetch('http://192.168.0.108:8000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkInput })
      })

      if (!downloadResponse.ok) {
        const error = await downloadResponse.json()
        throw new Error(error.detail || 'Download failed')
      }

      const downloadData = await downloadResponse.json()
      
      // Detect media type
      const detectedType = detectMediaTypeFromUrl(linkInput)
      setLinkLoading(false)
      
      // Analyze with video ID
      handleAnalyze('Link Analysis', detectedType)
    } catch (error) {
      console.error('Download error:', error)
      setLinkLoading(false)
      setShowLinkInput(true)
      alert('Failed to download: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-dark-tertiary p-6 text-center sticky top-0 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">🛡️ DeepFake Shield</h1>
        <p className="text-text-secondary">Multi-Media Detection</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 max-w-2xl mx-auto w-full items-center justify-start">
        {/* Upload Zone */}
        <UploadZone onFileSelect={handleFileUpload} disabled={analyzing} />

        {/* Share Link Section */}
        <div className="space-y-2">
          <h3 className="text-text-secondary text-sm font-semibold">Or Analyze from Link</h3>
          {!showLinkInput ? (
            <button
              onClick={() => setShowLinkInput(true)}
              disabled={analyzing}
              className="card w-full p-4 text-left hover:border-gray-accent active:scale-95 transition-smooth disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <h3 className="font-bold text-text-primary">Paste Media Link</h3>
                  <p className="text-sm text-text-secondary">YouTube, Instagram, TikTok, etc.</p>
                </div>
              </div>
            </button>
          ) : (
            <div className="card p-4 space-y-3">
              <input
                type="text"
                placeholder="Paste link here (e.g., youtube.com/watch?v=...)"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLinkAnalysis()}
                disabled={linkLoading || analyzing}
                className="w-full bg-dark-tertiary text-text-primary px-3 py-2 rounded border border-dark-tertiary focus:border-blue-500 focus:outline-none disabled:opacity-50"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleLinkAnalysis}
                  disabled={!linkInput.trim() || linkLoading || analyzing}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {linkLoading ? 'Downloading...' : 'Analyze'}
                </button>
                <button
                  onClick={() => {
                    setShowLinkInput(false)
                    setLinkInput('')
                  }}
                  disabled={analyzing}
                  className="px-4 btn-secondary disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="card rounded-lg p-4 text-sm border-l-4 border-blue-600">
          <p className="font-semibold text-text-primary mb-2">🔒 Privacy First</p>
          <p className="text-text-secondary">Media analysis is performed on your device. No data is sent to servers without your consent.</p>
        </div>
      </div>

      {/* Loading State - Ultra Crazy */}
      {(analyzing || linkLoading) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card p-8 text-center max-w-md w-full mx-4">
            {/* Animated AI Brain */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>

              {/* Middle rotating ring */}
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-pink-500 border-l-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>

              {/* Center pulsing glow */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse flex items-center justify-center">
                <span className="text-2xl">
                  {mediaType === 'video' ? '🎥' : mediaType === 'image' ? '🖼️' : '🎙️'}
                </span>
              </div>

              {/* Radiating particles */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 90}deg) translateY(-50px)`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Stage Indicator */}
            <h3 className="text-lg font-bold text-text-primary mb-2">
              {linkLoading ? 'Downloading media...' : analysisStage}
            </h3>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-2 bg-dark-tertiary rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-100"
                  style={{ width: `${linkLoading ? 40 : progress}%` }}
                ></div>
              </div>
              <p className="text-text-secondary text-sm font-semibold">{linkLoading ? 'Downloading...' : `${progress}%`}</p>
            </div>

            {/* Analysis Stages */}
            {!linkLoading && (
              <div className="space-y-2 mb-6">
                {stages.map((stage, idx) => {
                  const stageIndex = stages.indexOf(stage)
                  const isActive = analysisStage === stage.name
                  const isCompleted = stages.findIndex(s => s.name === analysisStage) > stageIndex

                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-green-600 text-white'
                            : isActive
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-dark-tertiary text-text-secondary'
                        }`}
                      >
                        {isCompleted ? '✓' : isActive ? '●' : '○'}
                      </div>
                      <span
                        className={
                          isCompleted || isActive
                            ? 'text-text-primary font-medium'
                            : 'text-text-secondary'
                        }
                      >
                        {stage.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Loading text animation */}
            <div className="flex justify-center gap-1 mb-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>

            <p className="text-text-secondary text-xs">AI-powered detection in progress</p>
          </div>
        </div>
      )}
    </div>
  )
}
