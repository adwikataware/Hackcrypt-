import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Eye, Download } from 'lucide-react';
import { getHistory, clearHistory, deleteScan, getStats } from '../services/api';
import { formatTimestamp, formatConfidence, getThreatBadgeClass } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import './HistoryPage.css';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setHistory(data.scans || []);
      setError(null);
    } catch (err) {
      setError(err.error || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all scan history?')) {
      try {
        await clearHistory();
        setHistory([]);
        setStats(null);
      } catch (err) {
        alert('Failed to clear history');
      }
    }
  };

  const handleDeleteScan = async (contentHash) => {
    if (window.confirm('Delete this scan?')) {
      try {
        await deleteScan(contentHash);
        setHistory(history.filter(scan => scan.content_hash !== contentHash));
        fetchStats(); // Refresh stats
      } catch (err) {
        alert('Failed to delete scan');
      }
    }
  };

  const handleViewResult = (scan) => {
    navigate('/results', { state: { result: scan, filename: scan.filename } });
  };

  const handleDownloadReport = (scan) => {
    const reportData = JSON.stringify(scan, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${scan.filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="history-page">
        <LoadingSpinner message="Loading history..." />
      </div>
    );
  }

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="history-title">Scan History</h1>
        {history.length > 0 && (
          <button className="clear-button" onClick={handleClearAll}>
            <Trash2 size={18} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-label">Total Scans</span>
              <span className="stat-value">{stats.total_scans}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <span className="stat-label">Fakes Detected</span>
              <span className="stat-value">{stats.fake_count}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-info">
              <span className="stat-label">Authentic</span>
              <span className="stat-value">{stats.real_count}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <span className="stat-label">Detection Rate</span>
              <span className="stat-value">{stats.detection_rate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">📁</div>
          <h2>No scan history yet</h2>
          <p>Start by scanning your first file</p>
          <button 
            className="btn-scan"
            onClick={() => navigate('/scan')}
          >
            Start Scanning
          </button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((scan) => (
            <div key={scan.content_hash} className="history-item">
              <div className="history-item-header">
                <div className="history-item-info">
                  <h3 className="history-filename">{scan.filename}</h3>
                  <div className="history-meta">
                    <span className="file-type-badge">{scan.file_type}</span>
                    <span className="scan-date">
                      {scan.scan_timestamp ? formatTimestamp(scan.scan_timestamp) : 'Unknown date'}
                    </span>
                    {scan.cached && (
                      <span className="cached-badge">⚡ Cached</span>
                    )}
                  </div>
                </div>
                <div className={`threat-badge-mini ${getThreatBadgeClass(scan.threat_level)}`}>
                  {scan.threat_level}
                </div>
              </div>

              <div className="history-item-body">
                <div className="verdict-section">
                  <span className="verdict-label">Verdict:</span>
                  <span className={`verdict-value ${scan.is_fake ? 'fake' : 'real'}`}>
                    {scan.verdict}
                  </span>
                </div>
                <div className="confidence-section">
                  <span className="confidence-label">Confidence:</span>
                  <span className="confidence-value">
                    {formatConfidence(scan.overall_confidence)}
                  </span>
                </div>
              </div>

              <div className="history-item-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewResult(scan)}
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
                <button 
                  className="action-btn download-btn"
                  onClick={() => handleDownloadReport(scan)}
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteScan(scan.content_hash)}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
