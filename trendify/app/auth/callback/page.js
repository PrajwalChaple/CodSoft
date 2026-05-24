"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const { addToast } = useToast();
  const [error, setError] = useState("");

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      if (!supabase) {
        setError("Supabase is not configured");
        return;
      }

      // Get the session from Supabase (handles the OAuth redirect)
      const { data, error: supaError } = await supabase.auth.getSession();

      if (supaError) {
        console.error("[Auth Callback] Supabase error:", supaError.message);
        setError("Authentication failed. Please try again.");
        return;
      }

      const session = data?.session;
      if (!session?.user) {
        setError("No user session found. Please try again.");
        return;
      }

      const googleUser = session.user;

      // Sync with our MongoDB backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.user_metadata?.full_name || googleUser.user_metadata?.name || googleUser.email.split("@")[0],
          googleId: googleUser.id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to complete login");
        return;
      }

      // Refresh auth state
      await checkAuth();
      addToast("Welcome! Google login successful 🎉", "success");
      router.push("/account");
    } catch (err) {
      console.error("[Auth Callback] Error:", err);
      setError("Something went wrong. Please try again.");
    }
  }

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h2 className="auth-card__title" style={{ color: "var(--color-danger)" }}>Login Failed</h2>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: 20 }}>{error}</p>
          <button className="btn btn--primary" onClick={() => router.push("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <Loader2 size={40} style={{ animation: "spin 1s linear infinite", color: "var(--color-primary)", marginBottom: 16 }} />
        <h2 className="auth-card__title">Completing Sign In...</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
