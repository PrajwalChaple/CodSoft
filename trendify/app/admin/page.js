"use client";
import { useState } from "react";
import { Download, FileSpreadsheet, Loader2, ShieldCheck, Package, IndianRupee, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  async function handleDownloadExcel() {
    setDownloading(true);
    try {
      const res = await fetch("/api/orders/export");
      if (!res.ok) throw new Error("Failed to download");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Trendify_Orders_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast("Excel file downloaded! 📊", "success");
    } catch (err) {
      addToast("Failed to download Excel: " + err.message, "error");
    } finally {
      setDownloading(false);
    }
  }

  async function loadStats() {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/orders/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      addToast("Failed to load stats", "error");
    } finally {
      setLoadingStats(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page" style={{ textAlign: "center", padding: 80 }}>
        <Loader2 size={40} style={{ animation: "spin 1s linear infinite", color: "var(--color-primary)" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <ShieldCheck size={48} className="empty-state__icon" />
          <h2 className="empty-state__title">Admin Access Required</h2>
          <p className="empty-state__text">Please login to access admin panel.</p>
          <Link href="/login" className="btn btn--primary btn--sm">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>📊 Admin Dashboard</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: 32 }}>
          Manage orders, download reports, and track business metrics.
        </p>

        {/* Quick Stats */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            <div className="admin-stat-card">
              <Package size={24} />
              <div>
                <p className="admin-stat-card__value">{stats.totalOrders}</p>
                <p className="admin-stat-card__label">Total Orders</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <IndianRupee size={24} />
              <div>
                <p className="admin-stat-card__value">₹{stats.totalRevenue?.toLocaleString("en-IN")}</p>
                <p className="admin-stat-card__label">Total Revenue</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <TrendingUp size={24} />
              <div>
                <p className="admin-stat-card__value">{stats.paidOrders}</p>
                <p className="admin-stat-card__label">Paid Orders</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {/* Download Excel */}
          <div className="admin-card">
            <div className="admin-card__icon" style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
              <FileSpreadsheet size={28} />
            </div>
            <h3 className="admin-card__title">Download Orders Excel</h3>
            <p className="admin-card__desc">
              Download complete order data with customer details, payment info, products, shipping address — all in one Excel file with Summary sheet.
            </p>
            <button
              className="btn btn--primary"
              onClick={handleDownloadExcel}
              disabled={downloading}
              style={{ width: "100%" }}
            >
              {downloading ? (
                <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Downloading...</>
              ) : (
                <><Download size={18} /> Download Excel (.xlsx)</>
              )}
            </button>
          </div>

          {/* Load Stats */}
          <div className="admin-card">
            <div className="admin-card__icon" style={{ background: "#DBEAFE", color: "#3B82F6" }}>
              <TrendingUp size={28} />
            </div>
            <h3 className="admin-card__title">Business Analytics</h3>
            <p className="admin-card__desc">
              View quick business stats — total orders, revenue, paid vs COD orders, and order status breakdown.
            </p>
            <button
              className="btn btn--outline"
              onClick={loadStats}
              disabled={loadingStats}
              style={{ width: "100%" }}
            >
              {loadingStats ? (
                <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading...</>
              ) : (
                <><TrendingUp size={18} /> Load Stats</>
              )}
            </button>
          </div>
        </div>

        {/* Stats Detail */}
        {stats && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>📋 Detailed Breakdown</h3>
            <div style={{ background: "#fff", border: "1px solid var(--color-border-light)", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <tbody>
                  {[
                    ["Total Orders", stats.totalOrders],
                    ["Total Revenue", `₹${stats.totalRevenue?.toLocaleString("en-IN")}`],
                    ["Paid Online", stats.paidOrders],
                    ["Cash on Delivery", stats.codOrders],
                    ["Processing", stats.processing],
                    ["Shipped", stats.shipped],
                    ["Delivered", stats.delivered],
                    ["Cancelled", stats.cancelled],
                  ].map(([label, value], i) => (
                    <tr key={label} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 500, background: i % 2 === 0 ? "var(--color-bg-secondary)" : "#fff" }}>{label}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, background: i % 2 === 0 ? "var(--color-bg-secondary)" : "#fff" }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
