import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";
import { products } from "../../../data/products";

// Seed database with products from static data
export async function POST() {
  try {
    await dbConnect();

    // Clear existing products
    await Product.deleteMany({});

    // Insert all products
    const created = await Product.insertMany(products);

    return NextResponse.json({
      message: `Successfully seeded ${created.length} products`,
      count: created.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
