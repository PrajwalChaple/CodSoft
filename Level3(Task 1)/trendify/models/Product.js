import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    currency: { type: String, default: "$" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    category: { type: String, required: true },
    brand: { type: String, default: "" },
    colors: [String],
    colorNames: [String],
    stock: { type: Number, default: 0 },
    images: [String],
    featured: { type: Boolean, default: false },
    deal: { type: Boolean, default: false },
    monthlyPrice: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
