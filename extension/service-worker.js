// Service worker for background operations
// Handles frame capture messaging between side panel and Chrome tabs

chrome.runtime.onInstalled.addListener(() => {
  console.log('DeepFake Shield extension installed');
});

// Handle side panel open
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Listen for frame capture requests from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureFrame') {
    const tabId = request.tabId;
    const windowId = request.windowId;
    
    console.log('Service worker: capturing frame from tab', tabId, 'window', windowId);
    
    // Use service worker to capture the tab
    chrome.tabs.captureVisibleTab(windowId, { format: 'jpeg', quality: 80 }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error('Capture error:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        console.log('Frame captured successfully');
        sendResponse({ frameData: dataUrl });
      }
    });
    
    return true; // Keep channel open for async response
  }
});
