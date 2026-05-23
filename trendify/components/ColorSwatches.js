"use client";
import { useState } from "react";

export default function ColorSwatches({ colors = [], colorNames = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!colors.length) return null;

  return (
    <div>
      <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 12 }}>
        Choose a Color
      </h4>
      <div className="color-swatches">
        {colors.map((color, i) => (
          <button
            key={i}
            className={`color-swatch ${activeIndex === i ? "color-swatch--active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => setActiveIndex(i)}
            aria-label={colorNames[i] || `Color ${i + 1}`}
            title={colorNames[i] || `Color ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
