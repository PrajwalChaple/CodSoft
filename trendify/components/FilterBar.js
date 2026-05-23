"use client";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";

const filters = [
  "Headphone Type",
  "Price",
  "Review",
  "Color",
  "Material",
  "Offer",
];

export default function FilterBar() {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-chip ${activeFilter === filter ? "filter-chip--active" : ""}`}
          onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
        >
          {filter}
          <ChevronDown size={13} />
        </button>
      ))}
      <button className="filter-chip filter-chip--all">
        <SlidersHorizontal size={14} />
        All Filters
      </button>
      <div className="filter-bar__spacer" />
      <button className="filter-bar__sort">
        Sort by <ChevronDown size={14} />
      </button>
    </div>
  );
}
