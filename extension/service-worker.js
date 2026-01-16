// Service worker for background operations
// Handles messaging between content scripts and side panel

chrome.runtime.onInstalled.addListener(() => {
  console.log('DeepFake Shield extension installed');
});

// Handle side panel open
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
