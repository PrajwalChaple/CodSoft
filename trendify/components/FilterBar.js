"use client";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categoryFilters = [
  "Headphones",
  "Laptops",
  "Bags",
  "Shoes",
  "Furniture",
  "Books",
];

const sortOptions = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeSort = searchParams.get("sort") || "";
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCategoryClick(category) {
    if (activeCategory === category) {
      // Deselect
      router.push("/");
    } else {
      router.push(`/?category=${encodeURIComponent(category)}`);
    }
  }

  function handleSortClick(value) {
    setSortOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`/?${params.toString()}`);
  }

  function handleClearAll() {
    router.push("/");
  }

  const currentSortLabel = sortOptions.find((s) => s.value === activeSort)?.label || "Sort by";

  return (
    <div className="filter-bar">
      {categoryFilters.map((filter) => (
        <button
          key={filter}
          className={`filter-chip ${activeCategory === filter ? "filter-chip--active" : ""}`}
          onClick={() => handleCategoryClick(filter)}
        >
          {filter}
          <ChevronDown size={13} />
        </button>
      ))}
      <button
        className={`filter-chip filter-chip--all ${activeCategory || activeSort ? "filter-chip--active" : ""}`}
        onClick={handleClearAll}
      >
        <SlidersHorizontal size={14} />
        {activeCategory || activeSort ? "Clear All" : "All Filters"}
      </button>
      <div className="filter-bar__spacer" />
      <div className="filter-bar__sort-wrapper" ref={sortRef}>
        <button
          className="filter-bar__sort"
          onClick={() => setSortOpen(!sortOpen)}
        >
          {currentSortLabel} <ChevronDown size={14} style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
        {sortOpen && (
          <div className="filter-bar__sort-dropdown">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`filter-bar__sort-option ${activeSort === option.value ? "filter-bar__sort-option--active" : ""}`}
                onClick={() => handleSortClick(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
