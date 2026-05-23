import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <span className="hero__badge">🔥 Limited Time Offer</span>
          <h1 className="hero__title">
            Grab Upto <span>50% Off</span> On Selected Headphones
          </h1>
          <p className="hero__subtitle">
            Discover premium audio gear at unbeatable prices. Free shipping on all orders over $50.
          </p>
          <Link href="/" className="hero__cta">
            Buy Now <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero__image">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
            alt="Featured Headphones"
          />
        </div>
      </div>
    </section>
  );
}
