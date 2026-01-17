import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import ProtectPage from './pages/ProtectPage';  // ← ADD THIS IMPORT
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Header/Navbar */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo" onClick={() => window.location.href = '/'}>
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">DeepShield</span>
            </div>
            <nav className="nav-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/scan" className="nav-link">Scan</a>
              <a href="/protect" className="nav-link">Protect</a>  {/* ← ADD THIS */}
              <a href="/history" className="nav-link">History</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScannerPage />} />
            <Route path="/protect" element={<ProtectPage />} />  {/* ← ADD THIS */}
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p className="footer-text">
              © 2026 DeepShield - Advanced Deepfake Detection System
            </p>
            <div className="footer-links">
              <span className="footer-link">Privacy</span>
              <span className="footer-link">Terms</span>
              <span className="footer-link">Contact</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
