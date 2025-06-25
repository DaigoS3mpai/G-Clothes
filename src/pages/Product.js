// src/pages/Products.jsx
import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/.netlify/functions/get-products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message || 'Error al obtener productos.');
        }
      } catch (err) {
        console.error(err);
        setError('Error de red al obtener productos.');
      }
    };

    fetchProducts();
  }, []);

  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <div>
      <ProductList products={products} onAddToCart={onAddToCart} />
    </div>
  );
};

export default Products;
