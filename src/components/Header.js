// src/components/Header.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ cartCount = 0, currentUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  return (
    <header className="bg-[#002e5d] text-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-[#ffcc00] tracking-wide">
        GClothes
      </Link>

      <nav className="flex space-x-6 items-center text-sm sm:text-base">
        <Link to="/products" className="hover:text-[#ffcc00] transition">
          Productos
        </Link>

        <Link to="/cart" className="hover:text-[#ffcc00] transition">
          Carrito ({cartCount})
        </Link>

        {currentUser ? (
          <>
            <Link to="/profile" className="hover:text-[#ffcc00] transition">
              Perfil
            </Link>
            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1 bg-white text-[#002e5d] rounded hover:bg-[#ffcc00] hover:text-black transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="ml-2 px-4 py-1 bg-[#ffcc00] text-black font-medium rounded hover:bg-white hover:text-[#002e5d] transition"
          >
            Iniciar sesión
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
