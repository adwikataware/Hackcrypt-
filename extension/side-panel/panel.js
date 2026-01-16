let isRecording = false;
let frames = [];
const FRAME_BATCH_SIZE = 8; // Collect 8 frames before analyzing
const FRAME_INTERVAL = 500; // Capture frame every 500ms
let captureInterval = null;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');
const frameCountSpan = document.getElementById('frameCount');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');

startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

async function startRecording() {
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Open side panel
    await chrome.sidePanel.open({ tabId: tab.id });
    
    isRecording = true;
    frames = [];
    
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusDiv.textContent = '● Recording...';
    statusDiv.classList.remove('idle', 'analyzing');
    statusDiv.classList.add('recording');
    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    
    // Start capturing screenshots of the tab
    captureInterval = setInterval(async () => {
      try {
        // Capture visible tab - no content script needed
        const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 80 });
        
        if (dataUrl) {
          frames.push(dataUrl);
          frameCountSpan.textContent = frames.length;
          console.log('Frame captured:', frames.length);
          
          // Auto-analyze when we have enough frames
          if (frames.length >= FRAME_BATCH_SIZE) {
            stopRecording();
          }
        }
      } catch (err) {
        console.log('Screenshot capture error:', err.message);
      }
    }, FRAME_INTERVAL);
    
  } catch (error) {
    showError('Failed to start recording: ' + error.message);
    isRecording = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

function stopRecording() {
  if (!isRecording) return;
  
  isRecording = false;
  clearInterval(captureInterval);
  
  startBtn.disabled = false;
  stopBtn.disabled = true;
  statusDiv.textContent = 'Analyzing frames...';
  statusDiv.classList.remove('idle', 'recording');
  statusDiv.classList.add('analyzing');
  
  if (frames.length > 0) {
    analyzeFrames();
  } else {
    showError('No frames captured');
  }
}

async function analyzeFrames() {
  try {
    // Send all frames to backend for analysis
    const response = await analyzeFrameBatch(frames);
    
    displayResults(response);
    statusDiv.textContent = '✓ Analysis complete';
    statusDiv.classList.remove('recording', 'analyzing');
    statusDiv.classList.add('idle');
    
  } catch (error) {
    showError('Analysis failed: ' + error.message);
    statusDiv.textContent = 'Error during analysis';
    statusDiv.classList.remove('recording', 'analyzing');
  }
}

function displayResults(data) {
  resultsDiv.classList.remove('hidden');
  
  // Threat level display
  const threatLevel = document.getElementById('threatLevel');
  const threatValue = data.threat_level || 'UNKNOWN';
  threatLevel.textContent = threatValue;
  threatLevel.style.color = getThreatColor(threatValue);
  
  // Confidence score
  const confidence = Math.round((data.confidence || 0) * 100);
  document.getElementById('confidenceScore').textContent = confidence + '%';
  
  // Metric bars
  const visualScore = (data.visual_score || 0) * 100;
  const audioScore = (data.audio_score || 0) * 100;
  const temporalScore = (data.temporal_score || 0) * 100;
  
  document.getElementById('visualScore').style.width = visualScore + '%';
  document.getElementById('visualValue').textContent = Math.round(visualScore) + '%';
  
  document.getElementById('audioScore').style.width = audioScore + '%';
  document.getElementById('audioValue').textContent = Math.round(audioScore) + '%';
  
  document.getElementById('temporalScore').style.width = temporalScore + '%';
  document.getElementById('temporalValue').textContent = Math.round(temporalScore) + '%';
  
  // Threat type
  const threatType = document.getElementById('threatType');
  threatType.textContent = data.threat_type || 'unknown';
}

function getThreatColor(level) {
  const colors = {
    'CRITICAL': '#ff4444',
    'HIGH': '#ff8844',
    'MEDIUM': '#ffbb44',
    'LOW': '#44ff44',
    'SAFE': '#44ff44'
  };
  return colors[level] || '#aaa';
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'frameData') {
    frames.push(request.data);
    frameCountSpan.textContent = frames.length;
  }
});
