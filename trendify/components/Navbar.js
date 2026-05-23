"use client";
import Link from "next/link";
import { ShoppingCart, Search, User, Phone, ChevronDown, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  }

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
          <div className={`navbar__links ${mobileOpen ? "navbar__links--open" : ""}`}>
            <Link href="/" className="navbar__link" onClick={() => setMobileOpen(false)}>
              Categories <ChevronDown size={14} />
            </Link>
            <Link href="/?sort=price-asc" className="navbar__link" onClick={() => setMobileOpen(false)}>Deals</Link>
            <Link href="/?sort=newest" className="navbar__link" onClick={() => setMobileOpen(false)}>What&apos;s New</Link>
            <Link href="/" className="navbar__link" onClick={() => setMobileOpen(false)}>Delivery</Link>

            {/* Mobile-only links */}
            {mobileOpen && (
              <>
                <div className="navbar__mobile-divider" />
                <Link href={user ? "/account" : "/login"} className="navbar__link" onClick={() => setMobileOpen(false)}>
                  <User size={18} /> {user ? "My Account" : "Login"}
                </Link>
                <Link href="/cart" className="navbar__link" onClick={() => setMobileOpen(false)}>
                  <ShoppingCart size={18} /> Cart ({cartCount})
                </Link>
              </>
            )}
          </div>

          {/* Search */}
          <form className="navbar__search" onSubmit={handleSearch}>
            <input
              type="text"
              className="navbar__search-input"
              placeholder="Search Product"
              id="navbar-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="navbar__search-btn" aria-label="Search">
              <Search className="navbar__search-icon" />
            </button>
          </form>

          {/* Actions */}
          <div className="navbar__actions">
            <Link href={user ? "/account" : "/login"} className="navbar__action-btn">
              <User size={20} />
              <span>{user ? user.name.split(" ")[0] : "Account"}</span>
            </Link>
            <Link href="/account?tab=wishlist" className="navbar__action-btn">
              <Heart size={20} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="navbar__cart-badge">{wishlistCount}</span>
              )}
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

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="navbar__overlay" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
