import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/.netlify/functions/get-products");
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          setError("No se pudieron cargar los productos.");
        }
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("Error en el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-6">Cargando productos...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return <ProductList products={products} onAddToCart={onAddToCart} />;
};

export default Products;
