"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, filled = false }) {
  const { addToCart } = useCart();
  const priceParts = product.price.toFixed(2).split(".");
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const productId = product._id || product.id;

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
  }

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        {discount && (
          <span className="product-card__badge">-{discount}%</span>
        )}
        <button className="product-card__wishlist" aria-label="Add to wishlist">
          <Heart size={16} />
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
