"use client";
import { useState } from "react";
import { User, ShoppingBag, Heart, Settings, LogOut, Package } from "lucide-react";
import { products } from "../../data/products";

const sidebarItems = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

const orders = [
  {
    id: "ORD-2026-001",
    date: "May 20, 2026",
    status: "delivered",
    statusLabel: "Delivered",
    items: [
      { productId: 2, quantity: 1 },
      { productId: 10, quantity: 1 },
    ],
    total: 608.0,
    timelineStep: 3,
  },
  {
    id: "ORD-2026-002",
    date: "May 22, 2026",
    status: "shipped",
    statusLabel: "Shipped",
    items: [{ productId: 1, quantity: 2 }],
    total: 178.0,
    timelineStep: 2,
  },
  {
    id: "ORD-2026-003",
    date: "May 23, 2026",
    status: "processing",
    statusLabel: "Processing",
    items: [
      { productId: 8, quantity: 1 },
      { productId: 15, quantity: 1 },
    ],
    total: 1228.0,
    timelineStep: 1,
  },
];

const timelineSteps = ["Order Placed", "Processing", "Shipped", "Delivered"];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");

  const getProduct = (id) => products.find((p) => p.id === id);

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
              P
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: "0.95rem" }}>Prajwal</h4>
              <p style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                prajwal@email.com
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
          <button className="account-sidebar__item" style={{ color: "var(--color-danger)", marginTop: 8 }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === "orders" && (
            <>
              <h2 className="account-content__title">My Orders</h2>
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-card__header">
                    <div>
                      <p className="order-card__id">{order.id}</p>
                      <p className="order-card__date">{order.date}</p>
                    </div>
                    <span className={`order-card__status order-card__status--${order.status}`}>
                      {order.statusLabel}
                    </span>
                  </div>
                  <div className="order-card__items">
                    {order.items.map((item) => {
                      const product = getProduct(item.productId);
                      if (!product) return null;
                      return (
                        <div className="order-card__item" key={item.productId}>
                          <div className="order-card__item-image">
                            <img src={product.images[0]} alt={product.name} />
                          </div>
                          <span className="order-card__item-name">
                            {product.name} × {item.quantity}
                          </span>
                          <span className="order-card__item-price">
                            ${(product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Timeline */}
                  <div className="order-timeline">
                    {timelineSteps.map((step, i) => (
                      <div
                        key={step}
                        className={`order-timeline__step ${i < order.timelineStep ? "order-timeline__step--done" : ""}`}
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
                    <button className="btn btn--sm btn--outline">View Details</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "profile" && (
            <>
              <h2 className="account-content__title">My Profile</h2>
              <div style={{ maxWidth: 500 }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-firstName">First Name</label>
                    <input className="form-input" type="text" id="profile-firstName" defaultValue="Prajwal" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-lastName">Last Name</label>
                    <input className="form-input" type="text" id="profile-lastName" defaultValue="Chaple" />
                  </div>
                  <div className="form-group form-group--full">
                    <label className="form-label" htmlFor="profile-email">Email</label>
                    <input className="form-input" type="email" id="profile-email" defaultValue="prajwal@email.com" />
                  </div>
                  <div className="form-group form-group--full">
                    <label className="form-label" htmlFor="profile-phone">Phone</label>
                    <input className="form-input" type="tel" id="profile-phone" defaultValue="+91 98765 43210" />
                  </div>
                </div>
                <button className="btn btn--primary" style={{ marginTop: 24 }}>Save Changes</button>
              </div>
            </>
          )}

          {activeTab === "wishlist" && (
            <>
              <h2 className="account-content__title">Wishlist</h2>
              <div className="product-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="order-card" style={{ padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="order-card__item-image" style={{ width: 64, height: 64 }}>
                        <img src={product.images[0]} alt={product.name} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.88rem" }}>{product.name}</p>
                        <p style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: 4 }}>
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button className="btn btn--primary btn--sm btn--full" style={{ marginTop: 12 }}>
                      Add to Cart
                    </button>
                  </div>
                ))}
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
