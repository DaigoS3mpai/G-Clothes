import React, { useState, useEffect } from "react";

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/get-products");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) {
      alert("Selecciona una talla antes de agregar al carrito");
      return;
    }

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
    };

    onAddToCart(itemToAdd);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Productos</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p>${product.price.toFixed(2)}</p>

            <select
              value={selectedSizes[product.id] || ""}
              onChange={(e) => handleSizeChange(product.id, e.target.value)}
              className="mt-2 w-full border p-1 rounded"
            >
              <option value="">Selecciona talla</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 w-full bg-green-600 text-white py-1 rounded"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
