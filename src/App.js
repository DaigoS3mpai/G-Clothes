import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import { loginUser, registerUser } from "./util/api"; // ✅ Importación correcta

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

  // ✅ Usamos el archivo api.js para login
  const handleLogin = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.success) {
      localStorage.setItem("currentUser", JSON.stringify(result.user));
      setCurrentUser(result.user);
      return { success: true };
    } else {
      return { success: false, message: result.message };
    }
  };

  // ✅ Usamos el archivo api.js para registro
  const handleRegister = async (email, password, name, address, phone) => {
    const result = await registerUser(email, password, name, address, phone);
    if (result.success) {
      localStorage.setItem("currentUser", JSON.stringify(result.user));
      setCurrentUser(result.user);
      return { success: true };
    } else {
      return { success: false, message: result.message };
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
        <Route path="/products" element={<Products onAddToCart={addToCart} />} />
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
          element={<Profile currentUser={currentUser} onLogout={handleLogout} />}
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
