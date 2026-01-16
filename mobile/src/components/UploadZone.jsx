import React from 'react'

export default function UploadZone({ onFileSelect, disabled }) {
  return (
    <div className="card p-8 border-2 border-dashed border-dark-tertiary">
      <h2 className="text-xl font-bold mb-4 text-text-primary">📁 Upload Media</h2>
      <label className="block">
        <div className="bg-dark-secondary hover:bg-dark-tertiary cursor-pointer rounded-lg p-8 text-center transition-smooth disabled:opacity-50"
             style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.5 : 1 }}>
          <p className="text-text-primary font-semibold">Tap to choose file</p>
          <p className="text-sm text-text-secondary mt-2">Video, Image, or Audio (Max 100MB)</p>
        </div>
        <input
          type="file"
          accept=".mp4,.avi,.mov,.mkv,.webm,.flv,.wmv,.jpg,.jpeg,.png,.gif,.bmp,.webp,.heic,.mp3,.wav,.aac,.flac,.m4a,.ogg,video/*,image/*,audio/*"
          onChange={(e) => onFileSelect(e.target.files[0])}
          className="hidden"
          disabled={disabled}
        />
      </label>
    </div>
  )
}
