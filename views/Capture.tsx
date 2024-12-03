import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Capture() {
  const [browsingData, setBrowsingData] = useState({});
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false); // Streaming state
  const [dataSize, setDataSize] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(["timeData"], (result) => {
      const data = result.timeData || {};
      setBrowsingData(data);
      calculateDataSize(data);
    });

    chrome.runtime.sendMessage({ action: "getCaptureStatus" }, (response) => {
      setIsCapturing(response.isCapturing);
    });

    chrome.storage.local.get(["isStreaming"], (result) => {
      setIsStreaming(result.isStreaming || false); // Load persistent streaming state
    });
  }, []);

  const toggleCapture = () => {
    const action = isCapturing ? "stopCapture" : "startCapture";
    chrome.runtime.sendMessage({ action }, (response) => {
      console.log(response.status);
      setIsCapturing(!isCapturing);
    });
  };

  const toggleStreaming = (e) => {
    const streaming = e.target.checked;
    setIsStreaming(streaming);
    chrome.storage.local.set({ isStreaming: streaming }); // Save streaming state persistently
    chrome.runtime.sendMessage(
      { action: "toggleStreaming", isStreaming: streaming },
      (response) => {
        console.log(response.status);
      }
    );
  };

  const deleteBrowsingData = () => {
    setBrowsingData({});
    setDataSize(0);
    chrome.storage.local.remove("timeData");
  };

  const calculateDataSize = (data) => {
    const jsonData = JSON.stringify(data);
    const sizeInBytes = new Blob([jsonData]).size;
    const sizeInKb = sizeInBytes / 1024;
    setDataSize(sizeInKb.toFixed(2));
  };

  const pieChartData = {
    labels: Object.keys(browsingData),
    datasets: [
      {
        data: Object.values(browsingData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Browsing Data Capture</h2>
      <p>
        This feature allows you to capture and view the websites you visit and
        the time spent on each. Your data is stored locally and can be deleted
        at any time.
      </p>
      <button onClick={toggleCapture}>
        {isCapturing ? "Stop Capturing" : "Start Capturing"}
      </button>
      <button onClick={deleteBrowsingData} style={{ marginLeft: "10px" }}>
        Delete Data
      </button>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isStreaming}
            onChange={toggleStreaming}
          />
          Enable Data Streaming (beta - data usage may apply)
        </label>
      </div>
      <h3>Statistics</h3>
      {Object.keys(browsingData).length > 0 ? (
        <Pie data={pieChartData} />
      ) : (
        <p>No data available yet.</p>
      )}
      <h4>Data Size: {dataSize} KB</h4>
      <ul>
        {Object.entries(browsingData).map(([url, time], index) => (
          <li key={index}>
            {url} - {time.toFixed(2)} seconds
          </li>
        ))}
      </ul>
    </div>
  );
}
