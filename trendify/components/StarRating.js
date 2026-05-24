"use client";
import { Star } from "lucide-react";

export default function StarRating({ rating = 0, size = 14 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={i <= Math.floor(rating) ? "star-rating__star" : "star-rating__star star-rating__star--empty"}
        size={size}
        fill={i <= Math.floor(rating) ? "#F59E0B" : "none"}
        strokeWidth={i <= Math.floor(rating) ? 0 : 1.5}
      />
    );
  }

  return <div className="star-rating">{stars}</div>;
}
