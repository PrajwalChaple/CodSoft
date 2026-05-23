import Link from "next/link";
import { Armchair, Headphones, Footprints, ShoppingBag, Laptop, BookOpen } from "lucide-react";

const iconMap = {
  Armchair,
  Headphones,
  Footprints,
  ShoppingBag,
  Laptop,
  BookOpen,
};

export default function CategoryCard({ category }) {
  const IconComp = iconMap[category.icon] || ShoppingBag;

  return (
    <Link href="/" className="category-card">
      <div className="category-card__icon">
        <IconComp size={22} />
      </div>
      <div className="category-card__info">
        <h4>{category.name}</h4>
        <p>{category.items} Item Available</p>
      </div>
    </Link>
  );
}
