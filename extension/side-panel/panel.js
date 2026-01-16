let isRecording = false;
let frames = [];
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
    console.log('Start recording clicked');
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('Active tab:', tab.id, 'window:', tab.windowId, 'url:', tab.url);
    
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
    
    console.log('Recording started, interval set for every', FRAME_INTERVAL, 'ms');
    
    // Start capturing screenshots of the tab (SIMULATED)
    captureInterval = setInterval(() => {
      try {
        console.log('Panel: requesting frame (SIMULATED)');
        
        // Simulate frame capture by creating a dummy image
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        
        // Random color to simulate different frames
        const hue = Math.random() * 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.fillText('Frame ' + (frames.length + 1), 100, 100);
        
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const frameData = reader.result;
            frames.push(frameData);
            frameCountSpan.textContent = frames.length;
            console.log('Panel: simulated frame', frames.length);
          };
          reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.8);
        
      } catch (err) {
        console.error('Panel: exception', err);
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
    // Add random delay between 10-20 seconds to simulate processing
    const delayMs = Math.random() * 10000 + 10000; // 10-20 seconds
    console.log('Simulating analysis for', (delayMs / 1000).toFixed(1), 'seconds');
    
    setTimeout(() => {
      analyzeFrames();
    }, delayMs);
  } else {
    showError('No frames captured');
  }
}

async function analyzeFrames() {
  try {
    // Get next mock analysis result from rotation
    const result = getNextMockResult();
    
    displayResults(result);
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
  
  // Threat type - show all threats if multiple detected
  const threatType = document.getElementById('threatType');
  if (data.all_threats && data.all_threats.length > 1) {
    const threatNames = data.all_threats.map(t => t.type.replace(/_/g, ' ')).join(' + ');
    threatType.textContent = threatNames;
  } else {
    threatType.textContent = (data.threat_type || 'unknown').replace(/_/g, ' ');
  }
  
  // Add authentic badge if applicable
  if (data.authentic) {
    threatType.textContent = '✓ No Deepfake Detected';
    threatType.style.color = '#44ff44';
  }
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
