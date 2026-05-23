"use client";
import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ quantity = 1, onIncrease, onDecrease }) {
  return (
    <div className="qty-selector">
      <button className="qty-selector__btn" onClick={onDecrease} aria-label="Decrease quantity">
        <Minus size={16} />
      </button>
      <span className="qty-selector__value">{quantity}</span>
      <button className="qty-selector__btn" onClick={onIncrease} aria-label="Increase quantity">
        <Plus size={16} />
      </button>
    </div>
  );
}
