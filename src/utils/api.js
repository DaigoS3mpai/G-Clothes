// 🔐 Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`/.netlify/functions/get-user-by-email?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Respuesta no válida del servidor");

    const data = await res.json();

    if (!data.success) {
      return { success: false, message: data.message || "Usuario no encontrado" };
    }

    const user = data.user;
    if (user.password !== password) {
      return { success: false, message: "Contraseña incorrecta" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    return { success: false, message: "Error al conectar con el servidor" };
  }
};

// 📝 Registrar nuevo usuario
export const registerUser = async (email, password, name, address, phone) => {
  try {
    const res = await fetch("/.netlify/functions/insert-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, address, phone }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || "Error al registrar" };
    }
  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    return { success: false, message: "Error de red al registrar" };
  }
};

// 👤 Obtener perfil del usuario por email
export const getUserProfile = async (email) => {
  try {
    const res = await fetch(`/.netlify/functions/get-user-by-email?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Respuesta no válida");

    const data = await res.json();

    if (data.success) {
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || "Usuario no encontrado" };
    }
  } catch (error) {
    console.error("❌ Error en getUserProfile:", error);
    return { success: false, message: "Error al obtener el perfil" };
  }
};

// ✏️ Actualizar perfil del usuario
export const updateUserProfile = async (id, updates) => {
  try {
    const res = await fetch("/.netlify/functions/update-user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return { success: true, user: data.user };
    } else {
      return {
        success: false,
        message: data.message || "Error al actualizar el perfil.",
      };
    }
  } catch (error) {
    console.error("❌ Error en updateUserProfile:", error);
    return {
      success: false,
      message: "Error de red al actualizar el perfil.",
    };
  }
};

// 🛒 Agregar una compra al historial
export const addPurchaseToHistory = async (userId, cartItems, amount) => {
  try {
    const res = await fetch("/.netlify/functions/add-purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, cartItems, amount }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return { success: true, purchase_id: data.purchase_id };
    } else {
      return { success: false, message: data.message || "Error al guardar compra" };
    }
  } catch (error) {
    console.error("❌ Error en addPurchaseToHistory:", error);
    return { success: false, message: "Error al guardar la compra" };
  }
};

// 💸 Solicitar reembolso
export const requestRefund = async (userId, purchaseId) => {
  try {
    const res = await fetch("/.netlify/functions/request-refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, purchase_id: purchaseId }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return { success: true, message: data.message, purchase: data.purchase };
    } else {
      return { success: false, message: data.message || "No se pudo procesar el reembolso" };
    }
  } catch (error) {
    console.error("❌ Error en requestRefund:", error);
    return { success: false, message: "Error al solicitar el reembolso" };
  }
};
