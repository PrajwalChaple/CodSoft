import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({});

    return NextResponse.json({
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      paidOrders: orders.filter((o) => o.isPaid).length,
      codOrders: orders.filter((o) => o.paymentMethod === "cod").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
