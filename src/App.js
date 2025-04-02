import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [newEntity, setNewEntity] = useState({ entity_type: "", entity_price: "", entity_seller: "", entity_name: "" });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/v1/entities")
      .then((res) => res.json())
      .then((data) => setEntities(data))
      .catch((err) => console.error("Error fetching entities:", err));
  }, []);

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);

    // Dynamically load the widget for the selected entity
    const containerId = "review-widget-container";
    if (window.loadReviews) {
      window.loadReviews(entity.id, containerId);
    } else {
      console.error("Review widget script not loaded.");
    }
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
          {/* widget container will appear here */}
          <div id="review-widget-container"></div>
        </div>
      )}
    </div>
  );
}

export default App;