import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, TrendingUp } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Shield size={20} />
            <span>AI-Powered Deepfake Detection</span>
          </div>
          <h1 className="hero-title">
            Detect Deepfakes with
            <span className="gradient-text"> Military-Grade Precision</span>
          </h1>
          <p className="hero-description">
            Advanced multi-layer analysis combining AI models, forensic analysis, 
            and metadata verification to detect manipulated media with unparalleled accuracy.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate('/scan')}
            >
              Start Scanning
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/history')}
            >
              View History
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">Why Choose DeepShield?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={28} />
            </div>
            <h3 className="feature-title">Lightning Fast</h3>
            <p className="feature-description">
              Get results in seconds with our optimized AI pipeline and smart caching system.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={28} />
            </div>
            <h3 className="feature-title">Multi-Layer Analysis</h3>
            <p className="feature-description">
              Combines face detection, audio analysis, forensics, and metadata verification.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Lock size={28} />
            </div>
            <h3 className="feature-title">NoiseNet Protection</h3>
            <p className="feature-description">
              Proactively protect your images with imperceptible adversarial noise layers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={28} />
            </div>
            <h3 className="feature-title">95%+ Accuracy</h3>
            <p className="feature-description">
              State-of-the-art deep learning models trained on millions of samples.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="formats-section">
        <h2 className="section-title">Supported Formats</h2>
        <div className="formats-grid">
          <div className="format-card">
            <span className="format-emoji">🖼️</span>
            <h4 className="format-name">Images</h4>
            <p className="format-types">JPG, PNG, WEBP, BMP</p>
          </div>
          <div className="format-card">
            <span className="format-emoji">🎬</span>
            <h4 className="format-name">Videos</h4>
            <p className="format-types">MP4, AVI, MOV, MKV</p>
          </div>
          <div className="format-card">
            <span className="format-emoji">🔊</span>
            <h4 className="format-name">Audio</h4>
            <p className="format-types">MP3, WAV, FLAC, OGG</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to verify your media?</h2>
          <p className="cta-description">
            Start detecting deepfakes in seconds with our advanced AI system.
          </p>
          <button 
            className="btn-cta"
            onClick={() => navigate('/scan')}
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
