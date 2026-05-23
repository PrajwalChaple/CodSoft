"use client";
import Link from "next/link";
import { ShoppingCart, Search, User, Phone, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount } = useCart();

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-bar__content">
          <div className="announcement-bar__left">
            <Phone size={13} />
            <span>+1 (012) 345-6789</span>
          </div>
          <div className="announcement-bar__center">
            <span>Get 50% Off on Selected Items</span>
            <span>|</span>
            <Link href="/">Shop Now</Link>
          </div>
          <div className="announcement-bar__right">
            <span>Eng <ChevronDown size={12} /></span>
            <span>Location <ChevronDown size={12} /></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="navbar__container">
          {/* Logo */}
          <Link href="/" className="navbar__logo">
            <ShoppingCart className="navbar__logo-icon" />
            <span>Trendify</span>
          </Link>

          {/* Nav Links */}
          <div className="navbar__links">
            <Link href="/" className="navbar__link">
              Categories <ChevronDown size={14} />
            </Link>
            <Link href="/" className="navbar__link">Deals</Link>
            <Link href="/" className="navbar__link">What&apos;s New</Link>
            <Link href="/" className="navbar__link">Delivery</Link>
          </div>

          {/* Search */}
          <div className="navbar__search">
            <input
              type="text"
              className="navbar__search-input"
              placeholder="Search Product"
              id="navbar-search"
            />
            <Search className="navbar__search-icon" />
          </div>

          {/* Actions */}
          <div className="navbar__actions">
            <Link href={user ? "/account" : "/login"} className="navbar__action-btn">
              <User size={20} />
              <span>{user ? user.name.split(" ")[0] : "Account"}</span>
            </Link>
            <Link href="/cart" className="navbar__action-btn">
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="navbar__cart-badge">{cartCount}</span>
              )}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </>
  );
}
