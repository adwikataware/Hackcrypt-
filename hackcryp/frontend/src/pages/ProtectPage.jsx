import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Download, Upload } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { protectImage } from '../services/api';
import './ProtectPage.css';

const ProtectPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [protectedImage, setProtectedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProtectedImage(null);
      setError(null);
    }
  };

  const handleProtect = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await protectImage(selectedFile);
      setProtectedImage(result);
    } catch (err) {
      setError(err.error || 'Failed to protect image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (protectedImage?.protected_filename) {
      const link = document.createElement('a');
      link.href = `http://localhost:8000/api/download-protected/${protectedImage.protected_filename}`;
      link.download = protectedImage.protected_filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="protect-page">
      {/* Header */}
      <div className="protect-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="protect-title">NoiseNet Protection</h1>
        <div></div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <Shield size={24} />
        <div>
          <h3>Protect Your Images from AI Manipulation</h3>
          <p>Add imperceptible adversarial noise that prevents deepfake tools from using your images</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="protect-content">
        {!selectedFile ? (
          <div className="upload-section">
            <label className="file-upload-area">
              <Upload size={48} className="upload-icon" />
              <h3>Upload Image to Protect</h3>
              <p>Supports JPG, PNG, WEBP formats</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input-hidden"
              />
            </label>
          </div>
        ) : (
          <div className="protection-workflow">
            {/* Original Image */}
            <div className="image-panel">
              <div className="panel-header">
                <h3>Original Image</h3>
                <button 
                  className="change-btn"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setProtectedImage(null);
                  }}
                >
                  Change Image
                </button>
              </div>
              <div className="image-container">
                <img src={previewUrl} alt="Original" />
              </div>
              <div className="image-info">
                <span>📁 {selectedFile.name}</span>
                <span>📊 {(selectedFile.size / 1024).toFixed(2)} KB</span>
              </div>
            </div>

            {/* Process Button */}
            <div className="process-section">
              {!protectedImage && !isProcessing && (
                <button className="protect-btn" onClick={handleProtect}>
                  <Shield size={20} />
                  <span>Add NoiseNet Protection</span>
                </button>
              )}
              
              {isProcessing && (
                <LoadingSpinner message="Adding protection layer..." />
              )}
            </div>

            {/* Protected Image */}
            {protectedImage && (
              <div className="image-panel">
                <div className="panel-header">
                  <h3>Protected Image</h3>
                  <div className="success-badge">
                    <Shield size={16} />
                    <span>Protected</span>
                  </div>
                </div>
                <div className="image-container">
                  <img 
                    src={`http://localhost:8000/${protectedImage.protected_path}`} 
                    alt="Protected" 
                  />
                </div>
                <div className="protection-details">
                  <div className="detail-row">
                    <span className="label">Protection Type:</span>
                    <span className="value">NoiseNet Adversarial</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Noise Strength:</span>
                    <span className="value">0.015 (Imperceptible)</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className="value success">✓ Protected</span>
                  </div>
                </div>
                <button className="download-btn" onClick={handleDownload}>
                  <Download size={18} />
                  <span>Download Protected Image</span>
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How NoiseNet Protection Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Upload Your Image</h4>
            <p>Select any image you want to protect from AI manipulation</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Adversarial Noise Layer</h4>
            <p>We add imperceptible noise patterns that confuse deepfake models</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Download & Use</h4>
            <p>Your protected image looks identical but resists AI manipulation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectPage;
