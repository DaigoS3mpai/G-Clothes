import React, { useState } from "react";

const ProductList = ({ products, onAddToCart }) => {
  const [sizes, setSizes] = useState({});

  const handleAddToCart = (product) => {
    const selectedSize = sizes[product.id];
    if (!selectedSize) {
      alert("Debes seleccionar una talla.");
      return;
    }

    onAddToCart({ ...product, selectedSize });
  };

  const handleSizeChange = (productId, value) => {
    setSizes((prev) => ({ ...prev, [productId]: value }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>

          <select
            className="w-full border p-2 rounded mb-3"
            value={sizes[product.id] || ""}
            onChange={(e) => handleSizeChange(product.id, e.target.value)}
          >
            <option value="">Selecciona talla</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          <button
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            onClick={() => handleAddToCart(product)}
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
