import Link from "next/link";
import { Headphones, Smartphone, Laptop, Watch, Footprints, ShoppingBag, Shirt, Home } from "lucide-react";

const iconMap = {
  Headphones,
  Smartphone,
  Laptop,
  Watch,
  Footprints,
  ShoppingBag,
  Shirt,
  Home,
};

export default function CategoryCard({ category }) {
  const IconComp = iconMap[category.icon] || ShoppingBag;

  return (
    <Link href={`/?category=${encodeURIComponent(category.name)}`} className="category-card">
      <div className="category-card__icon">
        <IconComp size={22} />
      </div>
      <div className="category-card__info">
        <h4>{category.name}</h4>
        <p>{category.items} Items Available</p>
      </div>
    </Link>
  );
}
