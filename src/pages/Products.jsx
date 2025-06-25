import React, { useEffect, useState } from "react";

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/.netlify/functions/get-products");
        const data = await res.json();
        console.log("🧾 Productos recibidos:", data);

        if (data.success && Array.isArray(data.products)) {
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

  if (loading) return <div className="p-6">Cargando productos...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {products
        .filter((p) => p && p.id && p.name && typeof p.price === "number")
        .map((product) => (
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

export default Products;
