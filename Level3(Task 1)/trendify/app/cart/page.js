"use client";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import QuantitySelector from "../../components/QuantitySelector";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, cartCount, subtotal, shipping, discount, total, updateQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
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

  const freeShippingThreshold = 500;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Shopping Cart ({cartCount})</h1>

      <div className="cart-page__layout">
        {/* Cart Items */}
        <div className="cart-page__items">
          {cart.map((item, index) => (
            <div className="cart-item" key={`${item.productId}-${item.color}-${index}`}>
              <div className="cart-item__image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-item__details">
                <h3 className="cart-item__name">{item.name}</h3>
                <p className="cart-item__meta">
                  {item.color ? `Color: ${item.color} · ` : ""}{item.brand}
                </p>
                <div className="cart-item__actions">
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                  />
                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.productId, item.color)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="cart-item__price">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3 className="order-summary__title">Order Summary</h3>

          {subtotal < freeShippingThreshold ? (
            <div className="order-summary__shipping-progress">
              🚚 Add ₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")} more for FREE shipping!
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
          ) : (
            <div className="order-summary__shipping-progress">
              ✅ You qualify for FREE shipping!
            </div>
          )}

          <div className="order-summary__row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="order-summary__row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className="order-summary__row" style={{ color: "var(--color-success)" }}>
              <span>Discount (5%)</span>
              <span>-₹{discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="order-summary__row order-summary__row--total">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
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
