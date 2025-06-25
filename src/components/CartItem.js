// src/components/CartItem.js
import React from "react";

const CartItem = ({ item, index, onRemove }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);

  return (
    <li className="flex items-center border-b pb-4 mb-4 gap-4">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <p className="font-medium text-lg">{item.name}</p>
        <p className="text-sm text-gray-600">
          Talla: <strong>{item.selectedSize || "No seleccionada"}</strong>
        </p>
      </div>
      <div className="text-right">
        <p className="text-md">{formatPrice(item.price)}</p>
        <button
          className="text-red-500 text-sm hover:underline mt-1"
          onClick={() => onRemove(index)}
        >
          Quitar
        </button>
      </div>
    </li>
  );
};

export default CartItem;
