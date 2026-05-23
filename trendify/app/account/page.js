"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, Heart, Settings, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

const sidebarItems = [
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "profile", label: "My Profile", icon: User },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

const timelineSteps = ["Order Placed", "Processing", "Shipped", "Delivered"];

function getTimelineStep(status) {
  switch (status) {
    case "processing": return 1;
    case "shipped": return 2;
    case "delivered": return 3;
    case "cancelled": return 0;
    default: return 1;
  }
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="account-page" style={{ textAlign: "center", padding: 80 }}>
        <Loader2 size={40} style={{ animation: "spin 1s linear infinite", color: "var(--color-primary)" }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="account-page">
      <div className="account-page__layout">
        {/* Sidebar */}
        <div className="account-sidebar">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 16px 24px",
              borderBottom: "1px solid var(--color-border-light)",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--color-primary)",
                color: "var(--color-white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                fontWeight: 700,
              }}
            >
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: "0.95rem" }}>{user.name}</h4>
              <p style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                {user.email}
              </p>
            </div>
          </div>

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`account-sidebar__item ${activeTab === item.id ? "account-sidebar__item--active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
          <button
            className="account-sidebar__item"
            style={{ color: "var(--color-danger)", marginTop: 8 }}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === "orders" && (
            <>
              <h2 className="account-content__title">My Orders</h2>
              {loadingOrders ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "var(--color-primary)" }} />
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <ShoppingBag size={48} className="empty-state__icon" />
                  <h3 className="empty-state__title">No Orders Yet</h3>
                  <p className="empty-state__text">Start shopping to see your orders here.</p>
                  <Link href="/" className="btn btn--primary btn--sm">Shop Now</Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div className="order-card" key={order._id}>
                    <div className="order-card__header">
                      <div>
                        <p className="order-card__id">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="order-card__date">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`order-card__status order-card__status--${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="order-card__items">
                      {order.items.map((item, i) => (
                        <div className="order-card__item" key={i}>
                          <div className="order-card__item-image">
                            {item.image && <img src={item.image} alt={item.name} />}
                          </div>
                          <span className="order-card__item-name">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="order-card__item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Timeline */}
                    <div className="order-timeline">
                      {timelineSteps.map((step, i) => (
                        <div
                          key={step}
                          className={`order-timeline__step ${i < getTimelineStep(order.status) ? "order-timeline__step--done" : ""}`}
                        >
                          <div className="order-timeline__dot" />
                          <span className="order-timeline__label">{step}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 16,
                        paddingTop: 12,
                        borderTop: "1px solid var(--color-border-light)",
                      }}
                    >
                      <span style={{ fontSize: "0.88rem", fontWeight: 700 }}>
                        Total: ${order.total.toFixed(2)}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "card" ? "Card Payment" : "UPI"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "profile" && (
            <>
              <h2 className="account-content__title">My Profile</h2>
              <div style={{ maxWidth: 500 }}>
                <div className="form-grid">
                  <div className="form-group form-group--full">
                    <label className="form-label" htmlFor="profile-name">Full Name</label>
                    <input className="form-input" type="text" id="profile-name" defaultValue={user.name} />
                  </div>
                  <div className="form-group form-group--full">
                    <label className="form-label" htmlFor="profile-email">Email</label>
                    <input className="form-input" type="email" id="profile-email" defaultValue={user.email} readOnly style={{ background: "var(--color-bg-secondary)" }} />
                  </div>
                  <div className="form-group form-group--full">
                    <label className="form-label" htmlFor="profile-phone">Phone</label>
                    <input className="form-input" type="tel" id="profile-phone" defaultValue={user.phone || ""} placeholder="+91 98765 43210" />
                  </div>
                </div>
                <button className="btn btn--primary" style={{ marginTop: 24 }}>Save Changes</button>
              </div>
            </>
          )}

          {activeTab === "wishlist" && (
            <>
              <h2 className="account-content__title">Wishlist</h2>
              <div className="empty-state">
                <Heart size={48} className="empty-state__icon" />
                <h3 className="empty-state__title">Wishlist is empty</h3>
                <p className="empty-state__text">Browse products and add your favorites!</p>
                <Link href="/" className="btn btn--primary btn--sm">Browse Products</Link>
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <>
              <h2 className="account-content__title">Settings</h2>
              <div style={{ maxWidth: 500 }}>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label" htmlFor="settings-language">Language</label>
                  <select className="form-input" id="settings-language" defaultValue="English">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label" htmlFor="settings-currency">Currency</label>
                  <select className="form-input" id="settings-currency" defaultValue="USD">
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <input type="checkbox" id="settings-notifications" defaultChecked />
                  <label htmlFor="settings-notifications" style={{ fontSize: "0.88rem" }}>
                    Email notifications for orders and deals
                  </label>
                </div>
                <button className="btn btn--primary">Save Settings</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
