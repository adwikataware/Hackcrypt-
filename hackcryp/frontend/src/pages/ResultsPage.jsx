import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import TabNav from '../components/TabNav';
import ConfidenceBar from '../components/ConfidenceBar';
import PrimaryFinding from '../components/PrimaryFinding';
import ArtifactCard from '../components/ArtifactCard';
import { formatConfidence } from '../utils/helpers';
import './ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, filename } = location.state || {};

  const [activeTab, setActiveTab] = useState('overview');

  if (!result) {
    return (
      <div className="results-page">
        <div className="no-results">
          <h2>No results found</h2>
          <p>Please scan a file first</p>
          <button onClick={() => navigate('/scan')}>Go to Scanner</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'visual', label: 'Visual Analysis', icon: '👁️' },
    { id: 'audio', label: 'Audio Analysis', icon: '🔊' },
    { id: 'timeline', label: 'Timeline', icon: '⏱️' },
  ];

  // Filter tabs based on file type
  const availableTabs = tabs.filter(tab => {
    if (result.file_type === 'image' && (tab.id === 'audio' || tab.id === 'timeline')) {
      return false;
    }
    if (result.file_type === 'audio' && (tab.id === 'visual' || tab.id === 'timeline')) {
      return false;
    }
    return true;
  });

  const handleDownloadReport = () => {
    const reportData = JSON.stringify(result, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepfake-report-${filename || 'unknown'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        <button className="back-button" onClick={() => navigate('/scan')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="results-title">
          {result.file_type === 'image' ? 'Image' : 
           result.file_type === 'video' ? 'Video' : 'Audio'} Analysis Results
        </h1>
        <button className="download-button" onClick={handleDownloadReport}>
          <Download size={18} />
          <span>Download Report</span>
        </button>
      </div>

      {/* Main Result Card */}
      <ResultCard result={result} />

      {/* Tabs */}
      <TabNav 
        tabs={availableTabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Confidence Breakdown */}
            {result.confidence_breakdown && (
              <section className="results-section">
                <h2 className="section-heading">Confidence Breakdown</h2>
                <div className="confidence-bars-grid">
                  {Object.entries(result.confidence_breakdown).map(([key, value]) => (
                    <ConfidenceBar 
                      key={key}
                      label={key}
                      value={value}
                      color={value > 70 ? '#10b981' : value > 40 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Primary Findings */}
            {result.primary_findings && result.primary_findings.length > 0 && (
              <section className="results-section">
                <h2 className="section-heading">Primary Findings</h2>
                <div className="findings-list">
                  {result.primary_findings.map((finding, index) => (
                    <PrimaryFinding key={index} finding={finding} />
                  ))}
                </div>
              </section>
            )}

            {/* Evidence Summary */}
            {result.evidence_summary && result.evidence_summary.length > 0 && (
              <section className="results-section">
                <h2 className="section-heading">Evidence Summary</h2>
                <div className="evidence-list">
                  {result.evidence_summary.map((evidence, index) => (
                    <div key={index} className="evidence-item">
                      <span className="evidence-check">✓</span>
                      <span className="evidence-text">{evidence}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'visual' && (
          <div className="visual-tab">
            {/* Heatmap */}
            {result.visual_analysis?.heatmap_base64 && (
              <section className="results-section">
                <h2 className="section-heading">Detection Heatmap</h2>
                <div className="heatmap-container">
                  <img 
                    src={`data:image/jpeg;base64,${result.visual_analysis.heatmap_base64}`}
                    alt="Detection Heatmap"
                    className="heatmap-image"
                  />
                  <p className="heatmap-description">
                    {result.visual_analysis.heatmap_description}
                  </p>
                </div>
              </section>
            )}

            {/* Detected Artifacts */}
            {result.visual_analysis?.detected_artifacts && 
             result.visual_analysis.detected_artifacts.length > 0 && (
              <section className="results-section">
                <h2 className="section-heading">Detected Artifacts</h2>
                <div className="artifacts-grid">
                  {result.visual_analysis.detected_artifacts.map((artifact, index) => (
                    <ArtifactCard key={index} artifact={artifact} />
                  ))}
                </div>
              </section>
            )}

            {/* Model Performance */}
            {result.visual_analysis?.model_performance && (
              <section className="results-section">
                <h2 className="section-heading">Model Performance</h2>
                <div className="model-performance-grid">
                  {Object.entries(result.visual_analysis.model_performance).map(([model, score]) => (
                    <div key={model} className="model-card">
                      <span className="model-name">{model}</span>
                      <span className="model-score">{score}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'audio' && result.audio_analysis && (
          <div className="audio-tab">
            <section className="results-section">
              <h2 className="section-heading">Audio Analysis Results</h2>
              
              {/* High Frequency Analysis */}
              {result.audio_analysis.high_frequency_analysis && (
                <div className="analysis-card">
                  <h3 className="analysis-title">High Frequency Analysis</h3>
                  <div className="analysis-details">
                    <div className="detail-row">
                      <span className="detail-label">Average High Freq Energy:</span>
                      <span className="detail-value">
                        {result.audio_analysis.high_frequency_analysis.avg_high_freq_energy} dB
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Sample Rate:</span>
                      <span className="detail-value">
                        {result.audio_analysis.high_frequency_analysis.sample_rate} Hz
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Verdict:</span>
                      <span className={`verdict-badge ${result.audio_analysis.high_frequency_analysis.is_fake ? 'fake' : 'real'}`}>
                        {result.audio_analysis.high_frequency_analysis.verdict}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Silence Analysis */}
              {result.audio_analysis.silence_analysis && (
                <div className="analysis-card">
                  <h3 className="analysis-title">Silence Pattern Analysis</h3>
                  <div className="analysis-details">
                    <div className="detail-row">
                      <span className="detail-label">Silence Gaps Found:</span>
                      <span className="detail-value">
                        {result.audio_analysis.silence_analysis.silence_gaps_count}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Breathing Detected:</span>
                      <span className="detail-value">
                        {result.audio_analysis.silence_analysis.has_breathing_sounds ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Verdict:</span>
                      <span className={`verdict-badge ${result.audio_analysis.silence_analysis.is_fake ? 'fake' : 'real'}`}>
                        {result.audio_analysis.silence_analysis.verdict}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'timeline' && result.file_type === 'video' && (
          <div className="timeline-tab">
            <section className="results-section">
              <h2 className="section-heading">Video Timeline Analysis</h2>
              {result.liveness_analysis && (
                <div className="analysis-card">
                  <h3 className="analysis-title">Blink Rate Analysis</h3>
                  <div className="analysis-details">
                    <div className="detail-row">
                      <span className="detail-label">Total Blinks:</span>
                      <span className="detail-value">{result.liveness_analysis.total_blinks}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Blink Rate:</span>
                      <span className="detail-value">{result.liveness_analysis.blink_rate_bpm} BPM</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Verdict:</span>
                      <span className={`verdict-badge ${result.liveness_analysis.threat_level === 'HIGH' ? 'fake' : 'real'}`}>
                        {result.liveness_analysis.verdict}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
