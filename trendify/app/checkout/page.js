"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Banknote, Smartphone, Loader2, CheckCircle, ShieldCheck, Download } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";
import Script from "next/script";

const paymentOptions = [
  { id: "razorpay", label: "Pay Online (UPI / Card / Net Banking)", icon: CreditCard, desc: "UPI, Credit/Debit Card, Net Banking, Wallets" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive your order" },
];

export default function CheckoutPage() {
  const { cart, subtotal, shipping, discount, total, clearCart, cartCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Simulated payment states
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockOrderData, setMockOrderData] = useState(null);
  const [mockResponseData, setMockResponseData] = useState(null);

  // Shipping form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateForm() {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city || !form.postalCode) {
      return "Please fill all shipping details";
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email address";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) return "Enter valid 10-digit phone number";
    if (!/^\d{6}$/.test(form.postalCode.replace(/\s/g, ""))) return "Enter valid 6-digit pin code";
    return null;
  }

  async function handlePlaceOrder() {
    setError("");

    if (!user) {
      addToast("Please login to place an order", "error");
      router.push("/login");
      return;
    }

    if (cartCount === 0) {
      setError("Your cart is empty");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const orderData = {
      items: cart.map((item) => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        image: item.image,
      })),
      shippingAddress: form,
      paymentMethod,
      subtotal,
      shipping,
      discount,
      total,
    };

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment(orderData);
    } else {
      await handleCODOrder(orderData);
    }
  }

  async function handleMockSuccess() {
    setShowMockModal(false);
    setLoading(true);
    try {
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: mockResponseData.orderId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock_signature",
          orderData: mockOrderData,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      setOrderPlaced(true);
      setOrderId(verifyData.order.id);
      clearCart();
      addToast("Payment successful! Order placed 🎉", "success");
    } catch (err) {
      setError("Payment verification failed: " + err.message);
      addToast("Payment verification failed", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleMockFail() {
    setShowMockModal(false);
    setError("Payment failed: Simulated failure");
    addToast("Payment failed", "error");
  }

  function handleMockCancel() {
    setShowMockModal(false);
    addToast("Payment cancelled", "info");
  }

  async function handleRazorpayPayment(orderData) {
    setLoading(true);
    try {
      // Step 1: Create Razorpay order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: `order_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment");

      if (data.isMock) {
        setMockOrderData(orderData);
        setMockResponseData(data);
        setShowMockModal(true);
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Trendify",
        description: `Order of ${cartCount} item(s)`,
        order_id: data.orderId,
        handler: async function (response) {
          // Step 3: Verify payment
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);

            setOrderPlaced(true);
            setOrderId(verifyData.order.id);
            clearCart();
            addToast("Payment successful! Order placed 🎉", "success");
          } catch (err) {
            setError("Payment verification failed: " + err.message);
            addToast("Payment verification failed", "error");
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#1B4332",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            addToast("Payment cancelled", "info");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description}`);
        addToast("Payment failed", "error");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCODOrder(orderData) {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

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
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <div className="order-success">
          <div className="order-success__icon">
            <CheckCircle size={64} />
          </div>
          <h2 className="order-success__title">Order Placed Successfully! 🎉</h2>
          <p className="order-success__id">
            Order ID: <strong>#{orderId?.toString().slice(-8).toUpperCase()}</strong>
          </p>
          <p className="order-success__text">
            {paymentMethod === "razorpay"
              ? "Payment received! Your order is being processed and will be shipped soon."
              : "Your order is confirmed. Please keep the exact amount ready for Cash on Delivery."}
          </p>
          <div className="order-success__actions">
            <Link href="/account?tab=orders" className="btn btn--primary">
              View My Orders
            </Link>
            <Link href="/" className="btn btn--outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartCount === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <h2 className="empty-state__title">Your Cart is Empty</h2>
          <p className="empty-state__text">Add some products before checkout.</p>
          <Link href="/" className="btn btn--primary btn--sm">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="checkout-page__title">Checkout</h1>

      <div className="checkout-page__layout">
        {/* Left — Shipping & Payment */}
        <div>
          {/* Shipping */}
          <div className="checkout-card">
            <h3 className="checkout-card__title">📦 Shipping Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-firstName">First Name *</label>
                <input className="form-input" type="text" id="checkout-firstName" name="firstName" value={form.firstName} onChange={handleInputChange} placeholder="Prajwal" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-lastName">Last Name *</label>
                <input className="form-input" type="text" id="checkout-lastName" name="lastName" value={form.lastName} onChange={handleInputChange} placeholder="Chaple" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-email">Email *</label>
                <input className="form-input" type="email" id="checkout-email" name="email" value={form.email} onChange={handleInputChange} placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-phone">Phone (10 digits) *</label>
                <input className="form-input" type="tel" id="checkout-phone" name="phone" value={form.phone} onChange={handleInputChange} placeholder="9876543210" required />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label" htmlFor="checkout-address">Address *</label>
                <input className="form-input" type="text" id="checkout-address" name="address" value={form.address} onChange={handleInputChange} placeholder="House No, Street, Area" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-city">City *</label>
                <input className="form-input" type="text" id="checkout-city" name="city" value={form.city} onChange={handleInputChange} placeholder="Mumbai" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-postalCode">PIN Code *</label>
                <input className="form-input" type="text" id="checkout-postalCode" name="postalCode" value={form.postalCode} onChange={handleInputChange} placeholder="400001" required maxLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-country">Country</label>
                <select className="form-input" id="checkout-country" name="country" value={form.country} onChange={handleInputChange}>
                  <option>India</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-card" style={{ marginTop: 24 }}>
            <h3 className="checkout-card__title">💳 Payment Method</h3>
            <div className="payment-options">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    className={`payment-option ${paymentMethod === opt.id ? "payment-option--active" : ""}`}
                    onClick={() => setPaymentMethod(opt.id)}
                  >
                    <div className="payment-option__radio">
                      <div className={`payment-option__radio-inner ${paymentMethod === opt.id ? "payment-option__radio-inner--active" : ""}`} />
                    </div>
                    <Icon size={22} />
                    <div>
                      <p className="payment-option__label">{opt.label}</p>
                      <p className="payment-option__desc">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "razorpay" && (
              <div style={{
                marginTop: 16,
                padding: "12px 16px",
                background: "var(--color-primary-light)",
                borderRadius: 10,
                fontSize: "0.83rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--color-primary)",
              }}>
                <ShieldCheck size={18} />
                <span>Secure payment powered by <strong>Razorpay</strong>. Supports UPI (Google Pay, PhonePe, Paytm), Cards, Net Banking & Wallets.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right — Order Summary */}
        <div>
          <div className="checkout-card checkout-card--summary">
            <h3 className="checkout-card__title">🧾 Order Summary</h3>

            <div className="checkout-items">
              {cart.map((item, i) => (
                <div key={i} className="checkout-item">
                  <div className="checkout-item__image">
                    {item.image && <img src={item.image} alt={item.name} />}
                  </div>
                  <div className="checkout-item__info">
                    <p className="checkout-item__name">{item.name}</p>
                    <p className="checkout-item__meta">
                      {item.color && <span>{item.color} · </span>}
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="checkout-item__price">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="checkout-summary">
              <div className="checkout-summary__row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? "var(--color-success)" : undefined }}>
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="checkout-summary__row" style={{ color: "var(--color-success)" }}>
                  <span>Discount (5%)</span>
                  <span>-₹{discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="checkout-summary__total">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {error && (
              <div style={{
                background: "#FEE2E2",
                color: "#DC2626",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: "0.83rem",
                fontWeight: 500,
                marginBottom: 12,
              }}>
                {error}
              </div>
            )}

            <button
              className="btn btn--primary btn--full"
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? (
                <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Processing...</>
              ) : paymentMethod === "razorpay" ? (
                `Pay ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
              ) : (
                "Place Order (COD)"
              )}
            </button>

            <p style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--color-text-light)",
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}>
              <ShieldCheck size={13} /> Your payment information is secure & encrypted
            </p>
          </div>
        </div>
      </div>

      {showMockModal && (
        <div className="mock-payment-overlay">
          <div className="mock-payment-modal animate-slide-up">
            <div className="mock-payment-header">
              <ShieldCheck className="mock-payment-icon" size={24} />
              <h3>Trendify Pay (Secure Checkout)</h3>
            </div>
            <div className="mock-payment-body">
              <span className="mock-payment-badge">Simulated Gateway</span>
              <p className="mock-payment-info">
                This is a demo payment mode simulating <strong>Razorpay</strong>. You can test both success and failure responses.
              </p>
              
              <div className="mock-payment-details">
                <div className="mock-payment-row">
                  <span>Merchant:</span>
                  <strong>Trendify India</strong>
                </div>
                <div className="mock-payment-row">
                  <span>Amount:</span>
                  <strong style={{ color: "var(--color-primary)" }}>
                    ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                <div className="mock-payment-row">
                  <span>Order Reference:</span>
                  <code>{mockResponseData?.orderId}</code>
                </div>
              </div>

              <div className="mock-payment-actions">
                <button className="btn btn--primary btn--full" onClick={handleMockSuccess} style={{ backgroundColor: "#2D6A4F", borderColor: "#2D6A4F" }}>
                  Simulate Success
                </button>
                <button className="btn btn--danger btn--full" onClick={handleMockFail} style={{ marginTop: 8 }}>
                  Simulate Failure
                </button>
                <button className="btn btn--outline btn--full" onClick={handleMockCancel} style={{ marginTop: 8 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
