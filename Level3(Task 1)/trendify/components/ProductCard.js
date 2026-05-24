"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product, filled = false }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const priceParts = product.price.toFixed(2).split(".");
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const productId = product._id || product.id;
  const wishlisted = isInWishlist(productId);

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart({
      _id: productId,
      name: product.name,
      price: product.price,
      images: product.images,
      brand: product.brand,
      currency: product.currency,
      stock: product.stock,
    });
    addToast(`${product.name} added to cart!`, "success");
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ ...product, _id: productId });
    addToast(
      wishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist ❤️`,
      wishlisted ? "info" : "success"
    );
  }

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        {discount && (
          <span className="product-card__badge">-{discount}%</span>
        )}
        <button
          className={`product-card__wishlist ${wishlisted ? "product-card__wishlist--active" : ""}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <Link href={`/product/${productId}`}>
          <img
            className="product-card__image"
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="product-card__info">
        <div className="product-card__header">
          <Link href={`/product/${productId}`}>
            <h3 className="product-card__name">{product.name}</h3>
          </Link>
          <div className="product-card__price-wrap">
            <span className="product-card__price">
              {product.currency}{priceParts[0]}
            </span>
            <span className="product-card__price-cents">{priceParts[1]}</span>
            {product.originalPrice && (
              <span className="product-card__original-price">
                {product.currency}{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__rating">
          <StarRating rating={product.rating} />
          <span className="product-card__rating-count">({product.reviews})</span>
        </div>
        <button
          className={`product-card__add-btn ${filled ? "product-card__add-btn--filled" : ""}`}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
