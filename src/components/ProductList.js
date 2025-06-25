import React, { useState } from 'react';

const ProductList = ({ products, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedSizes, setSelectedSizes] = useState({});

  const categories = ['Todas', ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === 'Todas'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const formatCLP = (price) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (product) => {
    const size = selectedSizes[product.id];
    if (!size) {
      alert('Por favor selecciona una talla antes de agregar al carrito.');
      return;
    }

    const price = Number(product.price);

    onAddToCart({
      ...product,
      selectedSize: size,
      price,
    });
  };

  const parseSizes = (rawSizes) => {
    if (Array.isArray(rawSizes)) return rawSizes;
    if (typeof rawSizes === 'string') return rawSizes.split(',').map(s => s.trim());
    return ['S', 'M', 'L', 'XL'];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Catálogo de productos</h2>

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por categoría:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-60 px-3 py-2 border rounded shadow-sm"
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles en esta categoría.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow">
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-blue-600 font-bold">{formatCLP(product.price)}</p>

              <div className="mt-3">
                <label className="block text-sm mb-1">Talla:</label>
                <select
                  value={selectedSizes[product.id] || ''}
                  onChange={(e) => handleSizeChange(product.id, e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Seleccionar</option>
                  {parseSizes(product.sizes).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleAdd(product)}
                className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
