import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import { scanFile, verifyURL, verifyProtection } from '../services/api';
import './ScannerPage.css';

const ScannerPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [scanningMessage, setScanningMessage] = useState('Analyzing your file...');

  // Update current step based on progress
  useEffect(() => {
    if (progress >= 0 && progress < 25) {
      setCurrentStep(1);
    } else if (progress >= 25 && progress < 50) {
      setCurrentStep(2);
    } else if (progress >= 50 && progress < 80) {
      setCurrentStep(3);
    } else if (progress >= 80) {
      setCurrentStep(4);
    }
  }, [progress]);

  const handleFileSelect = async (file) => {
    setIsScanning(true);
    setProgress(0);
    setCurrentStep(0);
    setError(null);
    setScanningMessage('Analyzing your file...');

    try {
      // First check if it's a protected image
      if (file.type.startsWith('image/')) {
        setScanningMessage('Checking for NoiseNet protection...');
        const protectionCheck = await verifyProtection(file);
        
        if (protectionCheck.is_protected) {
          // Show protection alert
          navigate('/results', { 
            state: { 
              result: {
                verdict: protectionCheck.verdict,
                is_fake: false,
                threat_level: protectionCheck.threat_level,
                classification: protectionCheck.is_tampered ? "Tampered Protected Image" : "Protected Image",
                overall_confidence: protectionCheck.is_tampered ? 0.15 : 0.95,
                file_type: "image",
                protection_status: protectionCheck,
                primary_findings: protectionCheck.is_tampered ? [
                  {
                    type: "NoiseNet Tampering",
                    icon: "🚨",
                    description: "This image was protected with NoiseNet but has been modified",
                    confidence: 95
                  }
                ] : [
                  {
                    type: "NoiseNet Protected",
                    icon: "🛡️",
                    description: "This image is protected against deepfake manipulation",
                    confidence: 98
                  }
                ],
                evidence_summary: [
                  protectionCheck.message,
                  `Original: ${protectionCheck.original_filename}`,
                  protectionCheck.is_tampered ? "Noise layer integrity: COMPROMISED" : "Noise layer integrity: INTACT"
                ]
              }, 
              filename: file.name 
            } 
          });
          return;
        }
      }

      // Normal scan if not protected
      setScanningMessage('Analyzing your file...');
      const result = await scanFile(file, (progressPercent) => {
        setProgress(progressPercent);
      });

      navigate('/results', { state: { result, filename: file.name } });
    } catch (err) {
      setError(err.error || 'Failed to scan file. Please try again.');
      setIsScanning(false);
    }
  };


  const handleUrlSubmit = async (url) => {
    setIsScanning(true);
    setProgress(0);
    setCurrentStep(0);
    setError(null);
    setScanningMessage('Downloading and analyzing URL...');

    try {
      // Simulate progress for URL download
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      const result = await verifyURL(url);
      
      clearInterval(progressInterval);
      setProgress(100);

      navigate('/results', { state: { result, filename: result.video_title || 'URL Content' } });
    } catch (err) {
      setError(err.detail || err.error || 'Failed to verify URL. Please try again.');
      setIsScanning(false);
    }
  };

  return (
    <div className="scanner-page">
      {/* Header */}
      <div className="scanner-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="scanner-title">Deepfake Scanner</h1>
        <div></div>
      </div>

      {/* Content */}
      <div className="scanner-content">
        {!isScanning ? (
          <>
            <FileUploader 
              onFileSelect={handleFileSelect}
              onUrlSubmit={handleUrlSubmit}
              acceptedTypes="image/*,video/*,audio/*"
              maxSize={100}
            />
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
                <button 
                  className="error-dismiss"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="scanning-container">
            <LoadingSpinner 
              message={scanningMessage} 
              progress={progress}
            />
            
            {/* Animated Progress Steps */}
            <div className="scanning-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span>Uploading file</span>
              </div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span>Running AI detection</span>
              </div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > 3 ? '✓' : '3'}
                </div>
                <span>Forensic analysis</span>
              </div>
              <div className={`step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > 4 ? '✓' : '4'}
                </div>
                <span>Generating report</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      {!isScanning && (
        <div className="info-cards">
          <div className="info-card">
            <h3>What we analyze</h3>
            <ul>
              <li>✓ Face detection & manipulation patterns</li>
              <li>✓ Audio frequency anomalies</li>
              <li>✓ Metadata & EXIF data</li>
              <li>✓ Temporal consistency (videos)</li>
              <li>✓ Compression artifacts</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>Supported Sources</h3>
            <ul>
              <li>📁 Local files (images, videos, audio)</li>
              <li>🎬 YouTube videos</li>
              <li>🐦 Twitter/X (coming soon)</li>
              <li>⚡ Fast analysis with caching</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerPage;
