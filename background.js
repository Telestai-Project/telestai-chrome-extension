let currentTabId = null;
let currentUrl = null;
let startTime = null;
let isCapturing = false;
let trackingInterval = null;
let isStreaming = false; // Streaming flag

const STREAM_ENDPOINT = "https://mercatus.telestai.io/stream-data"; // API endpoint

// Simplify URLs to just the hostname
const simplifyUrl = (url) => {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch {
    return url;
  }
};

// Load streaming state from storage
chrome.storage.local.get(["isStreaming"], (result) => {
  isStreaming = result.isStreaming || false;
  console.log(`Initial streaming state: ${isStreaming}`);
});

// Listen for messages to manage capturing and streaming
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startCapture") {
    isCapturing = true;
    console.log("Capturing started");
    startTrackingTimer();
    sendResponse({ status: "capturing started" });
  } else if (request.action === "stopCapture") {
    isCapturing = false;
    clearInterval(trackingInterval); // Stop periodic tracking
    updateTimeSpent(); // Finalize the last tracked tab
    currentTabId = null;
    currentUrl = null;
    console.log("Capturing stopped");
    sendResponse({ status: "capturing stopped" });
  } else if (request.action === "getCaptureStatus") {
    sendResponse({ isCapturing });
  } else if (request.action === "toggleStreaming") {
    isStreaming = request.isStreaming;
    chrome.storage.local.set({ isStreaming }); // Persist the state
    console.log(`Streaming state updated: ${isStreaming}`);
    sendResponse({ status: `Streaming ${isStreaming ? "enabled" : "disabled"}` });
  }
});

function startTrackingTimer() {
  if (trackingInterval) clearInterval(trackingInterval); // Prevent duplicate intervals
  trackingInterval = setInterval(() => {
    if (!isCapturing || !currentTabId || !currentUrl) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        if (activeTab.id === currentTabId && activeTab.url.startsWith("http")) {
          console.log(`Continuing to track: ${currentUrl}`);
        } else {
          updateTimeSpent(); // Tab changed or browser focus lost
          startTracking(activeTab.id, activeTab.url);
        }
      } else {
        updateTimeSpent(); // No active tab
        currentTabId = null;
        currentUrl = null;
      }
    });
  }, 1000); // Check every second
}

// Handle tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (!isCapturing) return;
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.active && tab.url.startsWith("http")) {
    updateTimeSpent();
    startTracking(tab.id, tab.url);
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!isCapturing) return;
  if (changeInfo.status === "complete" && tab.active && tab.url.startsWith("http")) {
    updateTimeSpent();
    startTracking(tab.id, tab.url);
  }
});

// Handle window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (!isCapturing) return;
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateTimeSpent();
    currentTabId = null;
    currentUrl = null;
  } else {
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url.startsWith("http")) {
        updateTimeSpent();
        startTracking(tabs[0].id, tabs[0].url);
      }
    });
  }
});

// Handle tab closure
chrome.tabs.onRemoved.addListener((tabId) => {
  if (!isCapturing || tabId !== currentTabId) return;
  updateTimeSpent();
  currentTabId = null;
  currentUrl = null;
});

function startTracking(tabId, url) {
  const simplifiedUrl = simplifyUrl(url);
  if (tabId !== currentTabId || simplifiedUrl !== currentUrl) {
    console.log(`Start tracking: ${simplifiedUrl}`);
    updateTimeSpent();
    currentTabId = tabId;
    currentUrl = simplifiedUrl;
    startTime = Date.now();
  }
}

function updateTimeSpent() {
  if (currentTabId && currentUrl && startTime) {
    const timeSpent = (Date.now() - startTime) / 1000;
    console.log(`Spent ${timeSpent.toFixed(2)} seconds on ${currentUrl}`);

    chrome.storage.local.get(["timeData", "address"], (result) => {
      const timeData = result.timeData || {};
      const address = result.address || "unknown"; // Fetch address
      timeData[currentUrl] = (timeData[currentUrl] || 0) + timeSpent;
      chrome.storage.local.set({ timeData });

      const data = { url: currentUrl, timeSpent, address }; // Include address

      if (isStreaming) {
        console.log("Streaming data to API:", data);
        streamDataToServer(data);
      }
    });
    startTime = null;
  }
}

function streamDataToServer(data) {
  fetch(STREAM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Data streamed successfully:", data);
      } else {
        console.error("Failed to stream data:", response.statusText);
      }
    })
    .catch((error) => console.error("Error streaming data:", error));
}
