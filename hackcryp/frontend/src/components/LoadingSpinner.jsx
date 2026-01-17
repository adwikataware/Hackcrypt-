import React from 'react';
import './ConfidenceBar.css';

const ConfidenceBar = ({ label, value, color = '#06b6d4' }) => {
  // Ensure value is between 0 and 100
  const percentage = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className="confidence-bar-wrapper">
      <div className="confidence-bar-header">
        <span className="confidence-label">{label}</span>
        <span className="confidence-value">{percentage}%</span>
      </div>
      <div className="confidence-bar-track">
        <div 
          className="confidence-bar-fill" 
          style={{ 
            width: `${percentage}%`,
            background: color
          }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
