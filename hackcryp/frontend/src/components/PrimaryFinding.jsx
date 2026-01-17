import React from 'react';
import './PrimaryFinding.css';

const PrimaryFinding = ({ finding }) => {
  const { type, icon, description, tool, confidence } = finding;

  return (
    <div className="primary-finding-card">
      <div className="finding-header">
        <div className="finding-icon">{icon}</div>
        <div className="finding-info">
          <h4 className="finding-type">{type}</h4>
          <p className="finding-description">{description}</p>
          {tool && <p className="finding-tool">Tool: {tool}</p>}
        </div>
      </div>
      <div className="finding-confidence">
        <span className="confidence-number">{confidence}%</span>
      </div>
    </div>
  );
};

export default PrimaryFinding;
