import React, { useEffect, useState } from 'react';

const Home = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/get-products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const shuffled = data.products.sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 3)); // Mostrar 3 productos aleatorios
        }
      })
      .catch((err) => console.error('Error cargando productos:', err));
  }, []);

  const formatCLP = (price) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);

  return (
    <div className="text-center py-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">¡Bienvenido a GClothes! 👕🧢</h1>
      <p className="text-lg text-gray-600 mb-10">
        Explora nuestra colección de ropa urbana. Aquí tienes una muestra de nuestros productos:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow-md overflow-hidden p-4 flex flex-col"
          >
            <img
              src={product.image || 'https://via.placeholder.com/300x300'}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-1 mb-2">{product.description}</p>
            <p className="text-blue-600 font-bold mb-4">{formatCLP(product.price)}</p>
            <button
              onClick={() => onAddToCart({ ...product, selectedSize: 'M' })} // o puedes hacer que seleccione talla en otro paso
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-auto"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
