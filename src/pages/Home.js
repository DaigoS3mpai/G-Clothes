import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../utils/api';

const Home = ({ onAddToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getAllProducts();
      if (response.success && response.products.length > 0) {
        const shuffled = [...response.products].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3).map((product) => ({
          ...product,
          selectedSize: '', // Inicializar sin talla
        }));
        setFeaturedProducts(selected);
      }
    };

    fetchProducts();
  }, []);

  const handleSizeChange = (index, size) => {
    const updated = [...featuredProducts];
    updated[index].selectedSize = size;
    setFeaturedProducts(updated);
  };

  const handleAddToCart = (product) => {
    if (!product.selectedSize) {
      alert(`Selecciona una talla para ${product.name}`);
      return;
    }
    onAddToCart({ ...product, price: Number(product.price) });
  };

  const formatCLP = (price) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);

  return (
    <div className="text-center py-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido a GClothes! 👕🧢</h1>
      <p className="text-lg text-gray-600 mb-6">
        Explora nuestra colección de ropa urbana, poleras, gorros y más. Regístrate para guardar tus compras,
        recibir descuentos y disfrutar de una experiencia personalizada.
      </p>
      <p className="mb-10 text-blue-600 font-medium">Haz clic en “Productos” para comenzar a comprar.</p>

      {featuredProducts.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Productos destacados</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.category}</p>
                <p className="text-blue-600 font-bold">{formatCLP(product.price)}</p>

                <select
                  value={product.selectedSize}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="w-full mt-2 border rounded p-1"
                >
                  <option value="">Selecciona talla</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
