import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductList.css";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productAllergenInfo, setProductAllergenInfo] = useState("");
  const [productCookingInstruction, setProductCookingInstruction] = useState("");
  const [productCostPrice, setProductCostPrice] = useState("");
  const [productSellingPrice, setProductSellingPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://frontend-assessment-server.onrender.com/api/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products, sortType, sortOrder]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setValidationError(""); // Clear validation error when closing the modal
  };
  

  const handleAddProduct = async () => {
    if (
      !productName ||
      !productDescription ||
      !productAllergenInfo ||
      !productCookingInstruction ||
      !productCostPrice ||
      !productSellingPrice ||
      !productImage
    ) {
      setValidationError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "https://frontend-assessment-server.onrender.com/api/products",
        {
          name: productName,
          description: productDescription,
          allergen_info: productAllergenInfo,
          cooking_instruction: productCookingInstruction,
          cost_price: productCostPrice,
          selling_price: productSellingPrice,
          productImage: productImage,
          
        }
      );
      console.log("Product added:", response.data);
      setProducts([...products, response.data]);
      toggleModal();
      clearForm();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.id.toString().includes(searchQuery)
      );
    }
    filtered.sort((a, b) => {
      if (sortType === "name") {
        return sortOrder === "asc" ? a[sortType].localeCompare(b[sortType]) : b[sortType].localeCompare(a[sortType]);
      } else {
        return sortOrder === "asc" ? a[sortType] - b[sortType] : b[sortType] - a[sortType];
      }
    });
    setFilteredProducts(filtered);
  };

  const handleSortChange = (type) => {
    if (sortType === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
      setSortOrder("asc");
    }
  };

  const clearForm = () => {
    setProductName("");
    setProductDescription("");
    setProductAllergenInfo("");
    setProductCookingInstruction("");
    setProductCostPrice("");
    setProductSellingPrice("");
    setProductImage("");
  };

  return (
    <div className="product-list-container">
      <h2 className="heading">Product List</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={filterProducts}>🔍</button>
      </div>
      <button className="add-product-btn" onClick={toggleModal}>Add Product</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h3>Add New Product</h3>
            {validationError && <p className="error">{validationError}</p>}
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <label htmlFor="productDescription">Product Description:</label>
            <input
              type="text"
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
            <label htmlFor="productAllergenInfo">Product Allergen Info:</label>
            <input
              type="text"
              id="productAllergenInfo"
              value={productAllergenInfo}
              onChange={(e) => setProductAllergenInfo(e.target.value)}
            />
           
            <button className="add-product-btn" onClick={handleAddProduct}>Add</button>
          </div>
        </div>
      )}

      <div className="button-group">
        <button className="sort-btn" onClick={() => handleSortChange("id")}>Sort by ID</button>
        <button className="sort-btn" onClick={() => handleSortChange("selling_price")}>Sort by Selling Price</button>
        <button className="sort-btn" onClick={() => handleSortChange("name")}>Sort by Name</button>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.productImage} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
              <p>{product.description}</p>
              <p><strong>Allergen Info:</strong> {product.allergen_info}</p>
              <p><strong>Cooking Instruction:</strong> {product.cooking_instruction}</p>
              <p><strong>Cost Price:</strong> {product.cost_price}</p>
              <p><strong>Selling Price:</strong> {product.selling_price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ProductList;
