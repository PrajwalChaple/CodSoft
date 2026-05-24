import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Product from "../../../../models/Product";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    let product;
    // Try finding by MongoDB _id first, then by numeric id field
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      // Fallback: find by slug or by a custom numeric id
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
