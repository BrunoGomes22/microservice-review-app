import './App.css';
import React, { useEffect } from "react";

function App() {
  const entityId = "cfd9f499-b36d-4442-9269-d193d83bce47"; // Replace with the actual entity ID
  const containerId = "review-widget-container";

  useEffect(() => {
    // Dynamically load the widget for the specified entity
    if (window.loadReviews) {
      window.loadReviews(entityId, containerId);
    } else {
      console.error("Review widget script not loaded.");
    }
  }, [entityId]);

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Reviews</h1>
      {/* Widget container */}
      <div id={containerId}></div>
    </div>
  );
}

export default App;