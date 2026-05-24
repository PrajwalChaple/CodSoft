"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "trendify_cart";

function getStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function storeCart(cart) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getStoredCart());
    setIsLoaded(true);
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      storeCart(cart);
    }
  }, [cart, isLoaded]);

  function addToCart(product, quantity = 1, color = "") {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product._id && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          brand: product.brand || "",
          color,
          quantity,
          currency: product.currency || "$",
          stock: product.stock || 99,
        },
      ];
    });
  }

  function removeFromCart(productId, color = "") {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.color === color))
    );
  }

  function updateQuantity(productId, color, newQty) {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.color === color
          ? { ...item, quantity: newQty }
          : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const discount = subtotal > 5000 ? subtotal * 0.05 : 0;
  const total = subtotal + shipping - discount;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        shipping,
        discount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
