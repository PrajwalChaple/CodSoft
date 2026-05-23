"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      addToast("Account created successfully! Welcome to Trendify 🎉", "success");
      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Join Trendify for exclusive deals &amp; offers</p>

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
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type="text"
                id="register-name"
                placeholder="John Doe"
                style={{ paddingLeft: 40 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User
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
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type="email"
                id="register-email"
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
            <label className="form-label" htmlFor="register-password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                id="register-password"
                placeholder="Create a strong password"
                style={{ paddingLeft: 40, paddingRight: 40 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirmPassword">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type="password"
                id="register-confirmPassword"
                placeholder="Confirm your password"
                style={{ paddingLeft: 40 }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
            <input type="checkbox" id="register-terms" required style={{ marginTop: 4 }} />
            <label htmlFor="register-terms" style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
              I agree to the <a href="#" style={{ color: "var(--color-primary)", fontWeight: 500 }}>Terms of Service</a> and <a href="#" style={{ color: "var(--color-primary)", fontWeight: 500 }}>Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Creating Account...</> : "Create Account"}
          </button>
        </form>

        <div className="auth-card__divider">
          <span>or</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: 8 }}>
            Already have an account?
          </p>
          <Link href="/login" className="btn btn--outline btn--full">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
