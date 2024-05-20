import React, { useState, useEffect } from "react";
import ProductList from "./ProductList"; // Make sure you have a ProductList component

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch("https://frontend-assessment-server.onrender.com/api/products")
      .then(response => response.json())
      .then(data => {
        // Sort the products based on selling price
        const sortedProducts = data.sort((a, b) => a.selling_price - b.selling_price);
        // Update the state with the sorted products
        setProducts(sortedProducts);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to run effect only once on component mount

  return (
    <div>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
