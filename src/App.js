// src/App.js
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import {
  loginUser,
  registerUser,
} from "./utils/api"; // Asegúrate que la ruta sea correcta y el archivo exista

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCartItems([]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setCurrentUser(null);
  };

  const handleLogin = async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success) {
      localStorage.setItem("currentUser", JSON.stringify(res.user));
      setCurrentUser(res.user);
      setShowLogin(false);
    }
    return res;
  };

  const handleRegister = async (email, password, name, address, phone) => {
    const res = await registerUser(email, password, name, address, phone);
    if (res.success) {
      localStorage.setItem("currentUser", JSON.stringify(res.user));
      setCurrentUser(res.user);
      setShowLogin(false);
    }
    return res;
  };

  return (
    <Router>
      <Header
        cartCount={cartItems.length}
        currentUser={currentUser}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      {showLogin && (
        <Login
          onLogin={handleLogin}
          onRegister={handleRegister}
          onClose={() => setShowLogin(false)}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<div className="text-center mt-10 text-green-600">Página de inicio</div>}
        />
        <Route path="/products" element={<Products onAddToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              onRemoveFromCart={removeFromCart}
              onPurchase={clearCart}
              currentUser={currentUser}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile currentUser={currentUser} onLogout={handleLogout} />
          }
        />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
