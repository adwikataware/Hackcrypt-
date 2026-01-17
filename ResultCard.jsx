import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getThreatColor, getThreatBadgeClass, formatConfidence } from '../utils/helpers';
import './ResultCard.css';

const ResultCard = ({ result }) => {
  const { verdict, overall_confidence, threat_level, classification, likely_tools, is_fake } = result;

  const getVerdictIcon = () => {
    // Check is_fake first, then verdict text
    if (is_fake === false || verdict?.toLowerCase().includes('authentic') || verdict?.toLowerCase().includes('real')) {
      return <CheckCircle size={32} color="#10b981" />;
    } else if (threat_level === 'HIGH' || is_fake === true) {
      return <XCircle size={32} color="#ef4444" />;
    } else {
      return <AlertTriangle size={32} color="#f59e0b" />;
    }
  };

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="verdict-section">
          {getVerdictIcon()}
          <div>
            <h2 className="verdict-title">{verdict}</h2>
            <p className="verdict-subtitle">{classification || 'Analysis complete'}</p>
          </div>
        </div>
        <div className={`threat-badge ${getThreatBadgeClass(threat_level)}`}>
          <span className="threat-label">Threat Level</span>
          <span className="threat-value">● {threat_level}</span>
        </div>
      </div>

      <div className="result-details">
        <div className="detail-item">
          <span className="detail-label">Overall Confidence</span>
          <span className="detail-value">{formatConfidence(overall_confidence)}</span>
          <div className="confidence-bar-mini">
            <div 
              className="confidence-fill-mini" 
              style={{ 
                width: formatConfidence(overall_confidence),
                background: getThreatColor(threat_level)
              }}
            />
          </div>
        </div>

        {classification && (
          <div className="detail-item">
            <span className="detail-label">Classification</span>
            <span className="detail-value">{classification}</span>
          </div>
        )}

        {likely_tools && likely_tools.length > 0 && (
          <div className="detail-item">
            <span className="detail-label">Likely Tools</span>
            <div className="tools-list">
              {likely_tools.map((tool, index) => (
                <span key={index} className="tool-tag">{tool}</span>
              ))}
            </div>
          </div>
        )}

        {/* Debug info - remove after testing */}
        <div className="detail-item" style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
          <span className="detail-label">Debug Info:</span>
          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>
            <div>is_fake: {String(is_fake)}</div>
            <div>verdict: {verdict}</div>
            <div>threat_level: {threat_level}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
