// src/components/CartItem.js
import React from "react";

const CartItem = ({ item, index, onRemove }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);

  return (
    <li className="flex justify-between items-center border-b pb-2 mb-2">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-600">
          Talla: <strong>{item.selectedSize || "No seleccionada"}</strong>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span>{formatPrice(item.price)}</span>
        <button
          className="text-red-500 text-sm hover:underline"
          onClick={() => onRemove(index)}
        >
          Quitar
        </button>
      </div>
    </li>
  );
};

export default CartItem;
