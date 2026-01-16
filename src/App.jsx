import React, { useState } from 'react'
import './index.css'
import Home from './pages/Home'
import Results from './pages/Results'
import { generateMockResults } from './utils/mockData'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [fileType, setFileType] = useState(null)

  const handleAnalysisComplete = (result, type) => {
    setAnalysisResult(result)
    setFileType(type)
    setCurrentPage('results')
  }

  const handleBackHome = () => {
    setCurrentPage('home')
    setAnalysisResult(null)
    setFileType(null)
  }

  return (
    <div className="min-h-screen bg-dark">
      {currentPage === 'home' && (
        <Home onAnalysisComplete={handleAnalysisComplete} />
      )}
      {currentPage === 'results' && analysisResult && (
        <Results result={analysisResult} fileType={fileType} onBackHome={handleBackHome} />
      )}
    </div>
  )
}
