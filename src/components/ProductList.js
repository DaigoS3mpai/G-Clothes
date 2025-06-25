// src/components/ProductList.js
import React, { useState } from "react";

const ProductList = ({ products, onAddToCart }) => {
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (product) => {
    const size = selectedSizes[product.id];
    if (!size) {
      alert("Debes seleccionar una talla antes de agregar al carrito.");
      return;
    }

    onAddToCart({ ...product, selectedSize: size });
  };

  if (!products || products.length === 0) {
    return <div className="p-6 text-gray-600">No hay productos disponibles.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-3 rounded"
            />
          )}
          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
          <p className="text-gray-700 mb-2">
          {new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            minimumFractionDigits: 0,
           }).format(product.price)}
          </p>


          <select
            className="w-full p-2 border rounded mb-3"
            value={selectedSizes[product.id] || ""}
            onChange={(e) => handleSizeChange(product.id, e.target.value)}
          >
            <option value="">Selecciona una talla</option>
            {Array.isArray(product.sizes) &&
              product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
          </select>

          <button
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            onClick={() => handleAdd(product)}
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
