"use client";
import { useState } from "react";
import { products } from "../../data/products";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

const checkoutItems = [
  { productId: 2, quantity: 1, color: "Pink" },
  { productId: 1, quantity: 2, color: "Black" },
];

const paymentOptions = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI Payment", icon: Smartphone },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getProduct = (id) => products.find((p) => p.id === id);

  const subtotal = checkoutItems.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      <div className="checkout-page__layout">
        {/* Left - Form */}
        <div>
          {/* Step 1: Review Items */}
          <div className="checkout-section">
            <h2 className="checkout-section__title">
              <span className="checkout-section__title-num">1</span>
              Review Item And Shipping
            </h2>
            {checkoutItems.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              return (
                <div className="checkout-item" key={item.productId}>
                  <div className="checkout-item__image">
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                  <div className="checkout-item__details">
                    <h4 className="checkout-item__name">{product.name}</h4>
                    <p className="checkout-item__meta">Color: {item.color}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="checkout-item__price">
                      {product.currency}{product.price.toFixed(2)}
                    </p>
                    <p className="checkout-item__qty">Quantity: {item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step 2: Delivery Information */}
          <div className="checkout-section">
            <h2 className="checkout-section__title">
              <span className="checkout-section__title-num">2</span>
              Delivery Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-firstName">First Name</label>
                <input
                  className="form-input"
                  type="text"
                  id="checkout-firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-lastName">Last Name</label>
                <input
                  className="form-input"
                  type="text"
                  id="checkout-lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-email">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  id="checkout-email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-phone">Phone Number</label>
                <input
                  className="form-input"
                  type="tel"
                  id="checkout-phone"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label" htmlFor="checkout-address">Street Address</label>
                <input
                  className="form-input"
                  type="text"
                  id="checkout-address"
                  name="address"
                  placeholder="123, Street Name, Area"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-city">City</label>
                <input
                  className="form-input"
                  type="text"
                  id="checkout-city"
                  name="city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-postalCode">Postal Code</label>
                <input
                  className="form-input"
                  type="text"
                  id="checkout-postalCode"
                  name="postalCode"
                  placeholder="400001"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-country">Country</label>
                <select
                  className="form-input"
                  id="checkout-country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
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
                  <input
                    className="form-input"
                    type="text"
                    id="checkout-cardNumber"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-expiry">Expiry Date</label>
                  <input
                    className="form-input"
                    type="text"
                    id="checkout-expiry"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-cvv">CVV</label>
                  <input
                    className="form-input"
                    type="text"
                    id="checkout-cvv"
                    placeholder="123"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="order-summary">
          <h3 className="order-summary__title">Order Summary</h3>

          <div className="order-summary__row">
            <span>Subtotal ({checkoutItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="order-summary__row">
            <span>Shipping</span>
            <span style={{ color: "var(--color-success)", fontWeight: 600 }}>FREE</span>
          </div>
          <div className="order-summary__row order-summary__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="btn btn--primary order-summary__btn" style={{ marginTop: 24 }}>
            Place Order
          </button>

          <p style={{ marginTop: 16, fontSize: "0.75rem", color: "var(--color-text-light)", textAlign: "center", lineHeight: 1.5 }}>
            By placing this order, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
