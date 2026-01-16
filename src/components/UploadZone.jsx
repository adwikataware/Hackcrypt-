import React, { useState } from 'react'

export default function UploadZone({ onFileUpload, onURLUpload }) {
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      const isAudio = file.type.startsWith('audio/')

      if (isVideo || isImage || isAudio) {
        onFileUpload(file)
      } else {
        alert('Please upload a video, image, or audio file')
      }
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      onFileUpload(files[0])
    }
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    if (urlInput.trim()) {
      onURLUpload(urlInput.trim())
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`card p-12 text-center cursor-pointer transition-smooth border-2 border-dashed ${
          isDragging
            ? 'border-white bg-dark-tertiary'
            : 'border-gray-accent hover:border-white'
        }`}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Drag & drop your file here
            </h3>
            <p className="text-text-secondary mb-4">
              Videos, images, or audio • MP4, JPG, PNG, WAV, MP3 • Max 100MB
            </p>
          </div>

          <label className="inline-block">
            <input
              type="file"
              accept="video/*,image/*,audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="btn-primary cursor-pointer inline-block">
              Choose File
            </span>
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-dark-tertiary"></div>
        <span className="text-text-secondary text-sm">OR</span>
        <div className="flex-1 h-px bg-dark-tertiary"></div>
      </div>

      {/* URL Input */}
      {!showUrlInput ? (
        <button
          onClick={() => setShowUrlInput(true)}
          className="w-full btn-secondary"
        >
          Paste Media Link
        </button>
      ) : (
        <form onSubmit={handleUrlSubmit} className="space-y-3">
          <input
            type="url"
            placeholder="https://twitter.com/... or https://youtube.com/... or any media URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full px-4 py-3 bg-dark-secondary border border-gray-accent rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-white transition-smooth"
            autoFocus
          />
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">
              Analyze
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false)
                setUrlInput('')
              }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
