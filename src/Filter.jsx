import React, { useState } from "react";

function Filters() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  const products = [
    { id: 1, name: "iPhone 14", category: "mobile" },
    { id: 2, name: "Samsung TV", category: "tv" },
    { id: 3, name: "OnePlus 11", category: "mobile" },
    { id: 4, name: "LG Smart TV", category: "tv" },
    { id: 5, name: "Dell Laptop", category: "laptop" },
    { id: 6, name: "HP Laptop", category: "laptop" }
  ];

  // 🔹 Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>React Filter Section</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "200px" }}
      />

      <br />

      {/* 📂 Category Buttons */}
      <button onClick={() => setSelectedCategory("all")}>All</button>
      <button onClick={() => setSelectedCategory("mobile")}>Mobile</button>
      <button onClick={() => setSelectedCategory("tv")}>TV</button>
      <button onClick={() => setSelectedCategory("laptop")}>Laptop</button>

      <hr />

      {/* 📦 Product List */}
      <ul>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li key={product.id}>
              {product.name} ({product.category})
            </li>
          ))
        ) : (
          <p>No products found</p>
        )}
      </ul>
    </div>
  );
}

export default Filters;
