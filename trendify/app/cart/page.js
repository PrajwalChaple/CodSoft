"use client";
import { useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { products } from "../../data/products";
import QuantitySelector from "../../components/QuantitySelector";

const initialCart = [
  { productId: 2, quantity: 1, color: "Pink" },
  { productId: 1, quantity: 2, color: "Black" },
  { productId: 3, quantity: 1, color: "Black" },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);

  const getProduct = (id) => products.find((p) => p.id === id);

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
    );
  };

  const removeItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const discount = subtotal > 200 ? subtotal * 0.05 : 0;
  const total = subtotal + shipping - discount;
  const freeShippingProgress = Math.min((subtotal / 50) * 100, 100);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <ShoppingBag size={64} className="empty-state__icon" />
          <h2 className="empty-state__title">Your Cart is Empty</h2>
          <p className="empty-state__text">
            Looks like you haven&apos;t added anything yet. Start shopping now!
          </p>
          <Link href="/" className="btn btn--primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Shopping Cart ({cartItems.length})</h1>

      <div className="cart-page__layout">
        {/* Cart Items */}
        <div className="cart-page__items">
          {cartItems.map((item, index) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            return (
              <div className="cart-item" key={index}>
                <div className="cart-item__image">
                  <img src={product.images[0]} alt={product.name} />
                </div>
                <div className="cart-item__details">
                  <h3 className="cart-item__name">{product.name}</h3>
                  <p className="cart-item__meta">Color: {item.color} &middot; {product.brand}</p>
                  <div className="cart-item__actions">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(index, item.quantity + 1)}
                      onDecrease={() => updateQuantity(index, item.quantity - 1)}
                    />
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(index)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="cart-item__price">
                  {product.currency}{(product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3 className="order-summary__title">Order Summary</h3>

          {subtotal < 50 && (
            <div className="order-summary__shipping-progress">
              🚚 Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
              <div style={{
                marginTop: 8,
                height: 4,
                background: "rgba(27,67,50,0.15)",
                borderRadius: 2,
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${freeShippingProgress}%`,
                  height: "100%",
                  background: "var(--color-primary)",
                  borderRadius: 2,
                  transition: "width 0.3s ease"
                }} />
              </div>
            </div>
          )}

          {subtotal >= 50 && (
            <div className="order-summary__shipping-progress">
              ✅ You qualify for FREE shipping!
            </div>
          )}

          <div className="order-summary__row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="order-summary__row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className="order-summary__row" style={{ color: "var(--color-success)" }}>
              <span>Discount (5%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="order-summary__row order-summary__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link href="/checkout" className="btn btn--primary order-summary__btn">
            Proceed to Checkout
          </Link>

          <Link
            href="/"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 12,
              fontSize: "0.85rem",
              color: "var(--color-primary)",
              fontWeight: 500,
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
