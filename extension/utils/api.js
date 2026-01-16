const BACKEND_URL = 'http://192.168.0.108:8000';

/**
 * Send frame batch to backend for analysis
 * @param {Array<string>} frames - Array of base64 encoded frame images
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeFrameBatch(frames) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze-frames`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        frames: frames,
        count: frames.length
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Analysis failed');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Analyze a single frame
 * @param {string} frameData - Base64 encoded image
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeFrame(frameData) {
  try {
    // For individual frame analysis
    const blob = base64ToBlob(frameData);
    const formData = new FormData();
    formData.append('file', blob, 'frame.jpg');
    
    const response = await fetch(`${BACKEND_URL}/api/analyze-frame`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Analysis failed');
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Convert base64 string to Blob
 * @param {string} base64 - Base64 encoded string
 * @returns {Blob}
 */
function base64ToBlob(base64) {
  const parts = base64.split(',');
  const mimeType = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  
  return new Blob([u8arr], { type: mimeType });
}
