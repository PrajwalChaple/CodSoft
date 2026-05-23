"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      addToast("Welcome back! 🎉", "success");
      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleForgotPassword() {
    if (!email.trim()) {
      addToast("Please enter your email address first", "info");
      return;
    }
    addToast(`Password reset link sent to ${email} 📧`, "success");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">Sign in to your Trendify account</p>

        {error && (
          <div style={{
            background: "#FEE2E2",
            color: "#DC2626",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: "0.85rem",
            fontWeight: 500,
            marginBottom: 16,
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type="email"
                id="login-email"
                placeholder="you@example.com"
                style={{ paddingLeft: 40 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-light)",
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  float: "right",
                  fontWeight: 400,
                  color: "var(--color-primary)",
                  fontSize: "0.8rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot Password?
              </button>
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder="Enter your password"
                style={{ paddingLeft: 40, paddingRight: 40 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-light)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-light)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Signing In...</> : "Sign In"}
          </button>
        </form>

        <div className="auth-card__divider">
          <span>or</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: 8 }}>
            Don&apos;t have an account?
          </p>
          <Link href="/register" className="btn btn--outline btn--full">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
