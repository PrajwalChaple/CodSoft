"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();

  function handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      addToast("Please enter a valid email address", "error");
      return;
    }
    addToast("Successfully subscribed to newsletter! 🎉", "success");
    setEmail("");
  }

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <ShoppingCart size={22} />
              <span>Trendify</span>
            </div>
            <p className="footer__desc">
              Your one-stop destination for premium products at unbeatable prices.
              Shop the latest trends with free shipping on orders over $50.
            </p>
            <div className="footer__social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer__col-title">Quick Links</h4>
            <div className="footer__links">
              <Link href="/" className="footer__link">Home</Link>
              <Link href="/?sort=price-asc" className="footer__link">Shop</Link>
              <Link href="/?sort=price-asc" className="footer__link">Deals</Link>
              <Link href="/?sort=newest" className="footer__link">What&apos;s New</Link>
              <Link href="/account" className="footer__link">My Account</Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="footer__col-title">Customer Service</h4>
            <div className="footer__links">
              <Link href="/account?tab=orders" className="footer__link">Track Order</Link>
              <Link href="/account?tab=orders" className="footer__link">Returns & Refunds</Link>
              <Link href="/cart" className="footer__link">Shopping Cart</Link>
              <Link href="/account?tab=settings" className="footer__link">Settings</Link>
              <Link href="/login" className="footer__link">Contact Us</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer__col-title">Newsletter</h4>
            <p className="footer__desc" style={{ marginBottom: 12 }}>
              Subscribe to get special offers and weekly deals.
            </p>
            <form className="footer__newsletter-input" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                id="footer-newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <span>&copy; 2026 Trendify. All rights reserved.</span>
          <span>Privacy Policy &middot; Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
