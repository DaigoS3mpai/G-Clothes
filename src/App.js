import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import CheckoutSuccess from "./pages/CheckoutSuccess";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: "Error en el servidor." };
    }
  };

  const handleRegister = async (email, password, name, address, phone) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, address, phone }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: "Error en el servidor." };
    }
  };

  return (
    <Router>
      <Header cartCount={cartItems.length} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="text-center mt-10 text-green-600">
              Página de inicio
            </div>
          }
        />
        <Route
          path="/products"
          element={<Products onAddToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              onRemoveFromCart={removeFromCart}
              onPurchase={clearCart}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile currentUser={currentUser} onLogout={handleLogout} />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
              onRegister={handleRegister}
              onClose={() => window.history.back()}
            />
          }
        />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
