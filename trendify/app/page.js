import HeroBanner from "../components/HeroBanner";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { products, categories } from "../data/products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured);
  const similarProducts = products.slice(6, 10);
  const recentProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Filter Bar */}
      <FilterBar />

      {/* Main Content with Sidebar */}
      <div className="section" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          <div className="section__header">
            <h2 className="section__title">Headphones For You!</h2>
            <Link href="/" className="section__view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} filled={i === 1} />
            ))}
          </div>
        </div>

        {/* Sidebar - Categories */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20 }}>
            Popular Categories
          </h3>
          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.name} category={cat} />
            ))}
          </div>
        </div>
      </div>

      {/* Similar Items */}
      <div className="section" style={{ background: "var(--color-bg-cream)", marginLeft: 0, marginRight: 0, maxWidth: "100%", padding: "40px calc((100% - var(--max-width)) / 2 + 24px)" }}>
        <div className="section__header">
          <h2 className="section__title" style={{ fontStyle: "italic" }}>
            Similar Items You Might Like
          </h2>
          <Link href="/" className="section__view-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="section">
        <div className="section__header">
          <h2 className="section__title" style={{ fontStyle: "italic" }}>
            Recently Viewed
          </h2>
          <Link href="/" className="section__view-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {recentProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} filled={i === 1} />
          ))}
        </div>
      </div>
    </>
  );
}
