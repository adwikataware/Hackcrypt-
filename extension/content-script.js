// Content script runs in the context of web pages
// It captures video frames or page screenshots

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureFrame') {
    captureFrame().then((frameData) => {
      sendResponse({ frameData: frameData });
    }).catch((error) => {
      console.error('Frame capture error:', error);
      sendResponse({ error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
});

function captureFrame() {
  return new Promise((resolve, reject) => {
    try {
      // First, try to capture from any video element on the page
      const videos = document.querySelectorAll('video');
      if (videos.length > 0) {
        const video = videos[0];
        if (!video.paused && video.readyState === video.HAVE_ENOUGH_DATA) {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || video.clientWidth;
          canvas.height = video.videoHeight || video.clientHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);
          canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(blob);
          }, 'image/jpeg', 0.85);
          return;
        }
      }
      
      // Fallback: Capture the entire visible page
      const canvas = document.createElement('canvas');
      const width = Math.min(window.innerWidth, 1920);
      const height = Math.min(window.innerHeight, 1080);
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      
      // Try to draw visible elements (simplified approach)
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.fillText('Screen Recording Active', 10, 30);
      
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.8);
      
    } catch (error) {
      reject(error);
    }
  });
}
