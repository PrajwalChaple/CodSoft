"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Truck, RotateCcw, ArrowRight } from "lucide-react";
import { products } from "../../../data/products";
import StarRating from "../../../components/StarRating";
import ColorSwatches from "../../../components/ColorSwatches";
import QuantitySelector from "../../../components/QuantitySelector";
import ProductCard from "../../../components/ProductCard";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find((p) => p.id === Number(params.id));
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="pdp">
        <div className="empty-state">
          <h2 className="empty-state__title">Product Not Found</h2>
          <p className="empty-state__text">The product you are looking for does not exist.</p>
          <Link href="/" className="btn btn--primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const recentProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="pdp">
      {/* Breadcrumb */}
      <div className="pdp__breadcrumb">
        <Link href="/">Home</Link>
        <span className="pdp__breadcrumb-sep">/</span>
        <Link href="/">{product.category}</Link>
        <span className="pdp__breadcrumb-sep">/</span>
        <span className="pdp__breadcrumb-current">{product.name}</span>
      </div>

      {/* Product Layout */}
      <div className="pdp__layout">
        {/* Gallery */}
        <div className="pdp__gallery">
          <div className="pdp__main-image">
            <img src={product.images[activeImage] || product.images[0]} alt={product.name} />
          </div>
          {product.images.length > 1 && (
            <div className="pdp__thumbnails">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp__thumbnail ${activeImage === i ? "pdp__thumbnail--active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="pdp__details">
          <h1 className="pdp__name">{product.name}</h1>

          <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            {product.longDescription}
          </p>

          <div className="pdp__rating-row">
            <StarRating rating={product.rating} />
            <span className="pdp__rating-text">({product.reviews})</span>
          </div>

          <div className="pdp__price-section">
            <span className="pdp__price">
              {product.currency}{product.price.toFixed(2)}
              {product.originalPrice && (
                <span style={{ fontSize: "0.9rem", color: "var(--color-text-light)", textDecoration: "line-through", marginLeft: 12, fontWeight: 400 }}>
                  {product.currency}{product.originalPrice.toFixed(2)}
                </span>
              )}
            </span>
            {product.monthlyPrice && (
              <span className="pdp__monthly">
                or {product.currency}{product.monthlyPrice}/month
                <br />
                Suggested payments with 6 months special <a href="#">financing</a>
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors.length > 0 && (
            <ColorSwatches colors={product.colors} colorNames={product.colorNames} />
          )}

          {/* Quantity & Stock */}
          <div className="pdp__actions-row">
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock))}
              onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
            />
            <div>
              <p className="pdp__stock">
                Only <span>{product.stock} Items</span> Left!
              </p>
              <p className="pdp__stock-warning">Don&apos;t miss it</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="pdp__buttons">
            <button className="btn btn--primary" style={{ flex: 1 }}>Buy Now</button>
            <button className="btn btn--outline" style={{ flex: 1 }}>Add to Cart</button>
          </div>

          {/* Info Cards */}
          <div className="pdp__info-cards">
            <div className="pdp__info-card">
              <Truck size={20} className="pdp__info-card-icon" />
              <div>
                <h5>Free Delivery</h5>
                <p>Enter your Postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="pdp__info-card">
              <RotateCcw size={20} className="pdp__info-card-icon" />
              <div>
                <h5>Return Delivery</h5>
                <p>Free 30 Days Delivery Returns. <a href="#">Details</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Items */}
      {similarProducts.length > 0 && (
        <div className="section" style={{ padding: "40px 0" }}>
          <div className="section__header">
            <h2 className="section__title" style={{ fontStyle: "italic" }}>
              Similar Items You Might Like
            </h2>
            <Link href="/" className="section__view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      <div className="section" style={{ padding: "40px 0" }}>
        <div className="section__header">
          <h2 className="section__title" style={{ fontStyle: "italic" }}>
            Recently Viewed
          </h2>
          <Link href="/" className="section__view-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {recentProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} filled={i === 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
