export const getThreatColor = (threatLevel) => {
  switch (threatLevel?.toUpperCase()) {
    case 'HIGH':
      return '#ef4444';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
      return '#10b981';
    default:
      return '#6b7280';
  }
};

export const getThreatBadgeClass = (threatLevel) => {
  switch (threatLevel?.toUpperCase()) {
    case 'HIGH':
      return 'threat-badge-high';
    case 'MEDIUM':
      return 'threat-badge-medium';
    case 'LOW':
      return 'threat-badge-low';
    default:
      return 'threat-badge-unknown';
  }
};

export const formatConfidence = (confidence) => {
  if (confidence <= 1) {
    return `${(confidence * 100).toFixed(1)}%`;
  }
  return `${confidence.toFixed(1)}%`;
};

export const getVerdictIcon = (verdict) => {
  if (verdict?.toLowerCase().includes('authentic')) {
    return '✓';
  } else if (verdict?.toLowerCase().includes('fake') || verdict?.toLowerCase().includes('generated')) {
    return '⚠';
  }
  return '?';
};

export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#fbbf24';
    default:
      return '#6b7280';
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

export const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

export const isVideoFile = (filename) => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'];
  return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

export const isAudioFile = (filename) => {
  const audioExtensions = ['.mp3', '.wav', '.flac', '.ogg', '.m4a'];
  return audioExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

export const getFileType = (filename) => {
  if (isImageFile(filename)) return 'image';
  if (isVideoFile(filename)) return 'video';
  if (isAudioFile(filename)) return 'audio';
  return 'unknown';
};
