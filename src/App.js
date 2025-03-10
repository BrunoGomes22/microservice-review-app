import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [review, setReview] = useState({ rating: "", comment: "" });
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [newEntity, setNewEntity] = useState({ entity_type: "", entity_price: "", entity_seller: "", entity_name: "" });

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

  const handleReviewEdit = (e) => {
    e.preventDefault();
    if (!editReview) return;

    fetch(`http://127.0.0.1:8000/v1/entities/${selectedEntity.id}/reviews/${editReview.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: parseFloat(editReview.rating),
        comment: editReview.comment,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Review updated!");
        setEditReview(null);
        handleSelectEntity(selectedEntity); // Refresh reviews
      })
      .catch((err) => console.error("Error updating review:", err));
  };

  const handleReviewDelete = (reviewId) => {
    fetch(`http://127.0.0.1:8000/v1/entities/${selectedEntity.id}/reviews/${reviewId}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Review deleted!");
        handleSelectEntity(selectedEntity); // Refresh reviews
      })
      .catch((err) => console.error("Error deleting review:", err));
  };

  const handleEntitySubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/v1/entities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntity),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Entity created!");
        setEntities([...entities, data]);
        setNewEntity({ entity_type: "", entity_price: "", entity_seller: "", entity_name: "" });
      })
      .catch((err) => console.error("Error creating entity:", err));
  };

  const handleEntityDelete = (entityId) => {
    fetch(`http://127.0.0.1:8000/v1/entities/${entityId}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Entity deleted!");
        setEntities(entities.filter((entity) => entity.id !== entityId));
        if (selectedEntity && selectedEntity.id === entityId) {
          setSelectedEntity(null);
          setReviews([]);
        }
      })
      .catch((err) => console.error("Error deleting entity:", err));
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
            <button onClick={() => handleEntityDelete(entity.id)}>Delete Entity</button>
          </div>
        ))}
      </div>

      <h2>Create New Entity</h2>
      <form onSubmit={handleEntitySubmit}>
        <label>Type: </label>
        <input
          type="text"
          value={newEntity.entity_type}
          onChange={(e) => setNewEntity({ ...newEntity, entity_type: e.target.value })}
          required
        />
        <br />
        <label>Price: </label>
        <input
          type="number"
          value={newEntity.entity_price}
          onChange={(e) => setNewEntity({ ...newEntity, entity_price: e.target.value })}
          required
        />
        <br />
        <label>Seller: </label>
        <input
          type="text"
          value={newEntity.entity_seller}
          onChange={(e) => setNewEntity({ ...newEntity, entity_seller: e.target.value })}
          required
        />
        <br />
        <label>Name: </label>
        <input
          type="text"
          value={newEntity.entity_name}
          onChange={(e) => setNewEntity({ ...newEntity, entity_name: e.target.value })}
          required
        />
        <br />
        <button type="submit">Create Entity</button>
      </form>

      {selectedEntity && (
        <div>
          <h2>Reviews for {selectedEntity.entity_type}</h2>
          <ul>
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <li key={rev.id}>
                  <strong>{rev.rating}/5</strong> - {rev.comment}
                  <button onClick={() => setEditReview(rev)}>Edit</button>
                  <button onClick={() => handleReviewDelete(rev.id)}>Delete</button>
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

          {editReview && (
            <div>
              <h2>Edit Review</h2>
              <form onSubmit={handleReviewEdit}>
                <label>Rating (1-5): </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editReview.rating}
                  onChange={(e) => setEditReview({ ...editReview, rating: e.target.value })}
                  required
                />
                <br />
                <label>Comment: </label>
                <input
                  type="text"
                  value={editReview.comment}
                  onChange={(e) => setEditReview({ ...editReview, comment: e.target.value })}
                />
                <br />
                <button type="submit">Update Review</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;