import React from 'react';
import { getSeverityColor } from '../utils/helpers';
import './ArtifactCard.css';

const ArtifactCard = ({ artifact }) => {
  const { title, artifact: artifactName, description, severity } = artifact;
  const displayTitle = title || artifactName;
  const displayDescription = description || `Severity: ${severity}`;

  return (
    <div 
      className="artifact-card" 
      style={{ borderLeftColor: getSeverityColor(severity) }}
    >
      <div className="artifact-header">
        <h4 className="artifact-title">{displayTitle}</h4>
        <span 
          className={`severity-badge severity-${severity?.toLowerCase()}`}
        >
          {severity}
        </span>
      </div>
      <p className="artifact-description">{displayDescription}</p>
    </div>
  );
};

export default ArtifactCard;
