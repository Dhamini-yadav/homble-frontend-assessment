// AddProductModal.jsx

import React, { useState } from "react";

const AddProductModal = ({ isOpen, onClose, onAdd }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productAllergenInfo, setProductAllergenInfo] = useState("");

  const handleSubmit = () => {
    // Prepare the data for POST request
    const data = {
      name: productName,
      description: productDescription,
      allergen_info: productAllergenInfo
    };


    // Send POST request to /products endpoint
    fetch("https://frontend-assessment-server.onrender.com/api/products",
     {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(newProduct => {
        // Handle successful response
        // Call the onAdd function passed from parent component
        onAdd(newProduct);
        // Reset input fields
        setProductName("");
        setProductDescription("");
        setProductAllergenInfo("");
        // Close the modal
        onClose();
      })
      .catch(error => {
        // Handle error
        console.error("Error adding product:", error);
        // Close the modal
        onClose();
      });
  };

  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add Product</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Product Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Product Description</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={productDescription}
                onChange={e => setProductDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Product Allergen Info</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={productAllergenInfo}
                onChange={e => setProductAllergenInfo(e.target.value)}
              />
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={handleSubmit}>Add</button>
          <button className="button" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};


export default AddProductModal;
