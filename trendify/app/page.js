"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import HeroBanner from "../components/HeroBanner";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { products, categories } from "../data/products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "";

  // Filter products
  let filteredProducts = [...products];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  // Sort
  switch (sortBy) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
    default:
      // Featured first
      filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const isFiltered = searchQuery || categoryFilter || sortBy;
  const featuredProducts = isFiltered ? filteredProducts : filteredProducts.filter((p) => p.featured);
  const similarProducts = products.slice(6, 10);
  const recentProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Filter Bar */}
      <FilterBar />

      {/* Search Results Header */}
      {isFiltered && (
        <div className="section" style={{ paddingBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : categoryFilter
                ? `Category: ${categoryFilter}`
                : `Sorted by: ${sortBy.replace("-", " ")}`}
              <span style={{ fontWeight: 400, color: "var(--color-text-secondary)", fontSize: "0.9rem", marginLeft: 8 }}>
                ({filteredProducts.length} products)
              </span>
            </h2>
            <Link
              href="/"
              style={{
                fontSize: "0.85rem",
                color: "var(--color-primary)",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Clear Filters
            </Link>
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="section" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          {!isFiltered && (
            <div className="section__header">
              <h2 className="section__title">Headphones For You!</h2>
              <Link href="/?category=Headphones" className="section__view-all">
                View All <ArrowRight size={16} />
              </Link>
            </div>
          )}
          {filteredProducts.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <h3 className="empty-state__title">No products found</h3>
              <p className="empty-state__text">Try a different search or filter.</p>
              <Link href="/" className="btn btn--primary btn--sm">View All Products</Link>
            </div>
          ) : (
            <div className="product-grid">
              {(isFiltered ? filteredProducts : featuredProducts).map((product, i) => (
                <ProductCard key={product.id} product={product} filled={i === 1} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Categories */}
        <div style={{ width: 280, flexShrink: 0 }} className="home-sidebar">
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
      {!isFiltered && (
        <div className="section" style={{ background: "var(--color-bg-cream)", marginLeft: 0, marginRight: 0, maxWidth: "100%", padding: "40px calc((100% - var(--max-width)) / 2 + 24px)" }}>
          <div className="section__header">
            <h2 className="section__title" style={{ fontStyle: "italic" }}>
              Similar Items You Might Like
            </h2>
            <Link href="/?sort=rating" className="section__view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {!isFiltered && (
        <div className="section">
          <div className="section__header">
            <h2 className="section__title" style={{ fontStyle: "italic" }}>
              Recently Viewed
            </h2>
            <Link href="/?sort=newest" className="section__view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {recentProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} filled={i === 1} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 80 }}>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
