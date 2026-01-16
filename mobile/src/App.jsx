import React, { useState } from 'react'
import Home from './pages/Home'
import Results from './pages/Results'
import './index.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleAnalyze = (result) => {
    setAnalysisResult(result)
    setCurrentPage('results')
  }

  const handleBack = () => {
    setCurrentPage('home')
    setAnalysisResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {currentPage === 'home' && <Home onAnalyze={handleAnalyze} />}
      {currentPage === 'results' && <Results result={analysisResult} onBack={handleBack} />}
    </div>
  )
}
