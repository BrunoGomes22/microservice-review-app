import './App.css';

import React, { useState, useEffect } from "react";

function App() {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [review, setReview] = useState({ rating: "", comment: "" });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/v1/entities")
      .then((res) => res.json())
      .then((data) => setEntities(data))
      .catch((err) => console.error("Error fetching entities:", err));
  }, []);

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    fetch(`http://127.0.0.1:8000/v1/entities/${entity.id}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedEntity) return alert("Select an entity first!");

    fetch("http://127.0.0.1:8000/v1/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity_id: selectedEntity.id,
        rating: parseFloat(review.rating),
        comment: review.comment,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Review submitted!");
        setReview({ rating: "", comment: "" });
        handleSelectEntity(selectedEntity); // Refresh reviews
      })
      .catch((err) => console.error("Error submitting review:", err));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Entities</h1>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {entities.map((entity) => (
          <div
            key={entity.id}
            onClick={() => handleSelectEntity(entity)}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              cursor: "pointer",
              width: "150px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              No Image
            </div>
            <b>{entity.entity_type}</b>
            <p>${entity.entity_price}</p>
          </div>
        ))}
      </div>

      {selectedEntity && (
        <div>
          <h2>Reviews for {selectedEntity.entity_type}</h2>
          <ul>
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <li key={rev.id}>
                  <strong>{rev.rating}/5</strong> - {rev.comment}
                </li>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </ul>

          <h2>Submit a Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <label>Rating (1-5): </label>
            <input
              type="number"
              min="1"
              max="5"
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.target.value })}
              required
            />
            <br />
            <label>Comment: </label>
            <input
              type="text"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
            />
            <br />
            <button type="submit">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;