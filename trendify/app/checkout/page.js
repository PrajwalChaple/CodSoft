"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Banknote, Smartphone, Loader2, CheckCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

const paymentOptions = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI Payment", icon: Smartphone },
];

export default function CheckoutPage() {
  const { cart, subtotal, shipping, discount, total, clearCart, cartCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handlePlaceOrder() {
    setError("");

    if (!user) {
      addToast("Please login to place an order", "error");
      router.push("/login");
      return;
    }

    if (!formData.firstName || !formData.address || !formData.city) {
      setError("Please fill all required shipping fields.");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        image: item.image,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: formData,
          paymentMethod,
          subtotal,
          shipping,
          discount,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to place order");

      setOrderPlaced(true);
      setOrderId(data.order.id);
      clearCart();
      addToast("Order placed successfully! 🎉", "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <CheckCircle size={72} style={{ color: "var(--color-primary)", marginBottom: 16 }} />
          <h2 className="empty-state__title">Order Placed Successfully! 🎉</h2>
          <p className="empty-state__text">
            Your order <strong>{orderId}</strong> has been confirmed.<br />
            We&apos;ll send you an email with tracking details.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
            <Link href="/account" className="btn btn--primary">View Orders</Link>
            <Link href="/" className="btn btn--outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <h2 className="empty-state__title">No items to checkout</h2>
          <p className="empty-state__text">Add items to your cart first.</p>
          <Link href="/" className="btn btn--primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      {error && (
        <div style={{
          background: "#FEE2E2",
          color: "#DC2626",
          padding: "12px 16px",
          borderRadius: 8,
          fontSize: "0.85rem",
          fontWeight: 500,
          marginBottom: 24,
        }}>
          {error}
        </div>
      )}

      <div className="checkout-page__layout">
        {/* Left - Form */}
        <div>
          {/* Step 1: Review Items */}
          <div className="checkout-section">
            <h2 className="checkout-section__title">
              <span className="checkout-section__title-num">1</span>
              Review Item And Shipping
            </h2>
            {cart.map((item) => (
              <div className="checkout-item" key={`${item.productId}-${item.color}`}>
                <div className="checkout-item__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="checkout-item__details">
                  <h4 className="checkout-item__name">{item.name}</h4>
                  <p className="checkout-item__meta">{item.color ? `Color: ${item.color}` : item.brand}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="checkout-item__price">
                    {item.currency}{item.price.toFixed(2)}
                  </p>
                  <p className="checkout-item__qty">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Step 2: Delivery Information */}
          <div className="checkout-section">
            <h2 className="checkout-section__title">
              <span className="checkout-section__title-num">2</span>
              Delivery Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-firstName">First Name *</label>
                <input className="form-input" type="text" id="checkout-firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-lastName">Last Name</label>
                <input className="form-input" type="text" id="checkout-lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-email">Email</label>
                <input className="form-input" type="email" id="checkout-email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-phone">Phone</label>
                <input className="form-input" type="tel" id="checkout-phone" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label" htmlFor="checkout-address">Street Address *</label>
                <input className="form-input" type="text" id="checkout-address" name="address" placeholder="123, Street Name, Area" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-city">City *</label>
                <input className="form-input" type="text" id="checkout-city" name="city" placeholder="Mumbai" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-postalCode">Postal Code</label>
                <input className="form-input" type="text" id="checkout-postalCode" name="postalCode" placeholder="400001" value={formData.postalCode} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-country">Country</label>
                <select className="form-input" id="checkout-country" name="country" value={formData.country} onChange={handleChange}>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="checkout-section">
            <h2 className="checkout-section__title">
              <span className="checkout-section__title-num">3</span>
              Payment Details
            </h2>
            <div className="payment-methods">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    className={`payment-method ${paymentMethod === option.id ? "payment-method--active" : ""}`}
                    onClick={() => setPaymentMethod(option.id)}
                  >
                    <div className="payment-method__radio" />
                    <Icon size={20} />
                    <span className="payment-method__label">{option.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "card" && (
              <div className="form-grid" style={{ marginTop: 20 }}>
                <div className="form-group form-group--full">
                  <label className="form-label" htmlFor="checkout-cardNumber">Card Number</label>
                  <input className="form-input" type="text" id="checkout-cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-expiry">Expiry Date</label>
                  <input className="form-input" type="text" id="checkout-expiry" placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-cvv">CVV</label>
                  <input className="form-input" type="text" id="checkout-cvv" placeholder="123" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="order-summary">
          <h3 className="order-summary__title">Order Summary</h3>

          <div className="order-summary__row">
            <span>Subtotal ({cartCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="order-summary__row">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? "var(--color-success)" : undefined, fontWeight: 600 }}>
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </span>
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

          <button
            className="btn btn--primary order-summary__btn"
            style={{ marginTop: 24 }}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Placing Order...</> : "Place Order"}
          </button>

          {!user && (
            <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--color-danger)", textAlign: "center" }}>
              Please <Link href="/login" style={{ fontWeight: 600, textDecoration: "underline" }}>login</Link> to place your order.
            </p>
          )}

          <p style={{ marginTop: 12, fontSize: "0.75rem", color: "var(--color-text-light)", textAlign: "center", lineHeight: 1.5 }}>
            By placing this order, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
