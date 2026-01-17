import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';
import './FileUploader.css';

const FileUploader = ({ onFileSelect, onUrlSubmit, acceptedTypes = '*', maxSize = 100 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileValidation(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileValidation(files[0]);
    }
  };

  const handleFileValidation = (file) => {
    // Check file size (maxSize in MB)
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    onFileSelect(file);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
        alert('Please enter a valid URL starting with http:// or https://');
        return;
      }
      onUrlSubmit(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div className="file-uploader-container">
      {/* Drag & Drop Area */}
      <div
        className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="upload-icon" size={48} />
        <h3 className="upload-title">Drop files here or click to browse</h3>
        <p className="upload-subtitle">
          Supports images, videos, and audio files (max {maxSize}MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="file-input-hidden"
          accept={acceptedTypes}
          onChange={handleFileChange}
        />
      </div>

      {/* URL Input Section */}
      <div className="url-input-section">
        <div className="divider">
          <span>OR</span>
        </div>
        <form onSubmit={handleUrlSubmit} className="url-form">
          <div className="url-input-wrapper">
            <LinkIcon className="url-icon" size={20} />
            <input
              type="text"
              className="url-input"
              placeholder="Paste YouTube URL to verify (e.g., https://youtube.com/watch?v=...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
          </div>
          <button type="submit" className="url-submit-btn">
            Verify URL
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUploader;
