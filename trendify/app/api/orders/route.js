import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { getAuthUser } from "../../../lib/auth";

// GET all orders for authenticated user
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({ user: authUser.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST create a new order
export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, subtotal, shipping, discount, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Order must have at least one item" }, { status: 400 });
    }

    const order = await Order.create({
      user: authUser.userId,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      subtotal,
      shipping: shipping || 0,
      discount: discount || 0,
      total,
      status: "processing",
    });

    return NextResponse.json({
      message: "Order placed successfully!",
      order: { id: order._id, status: order.status, total: order.total },
    }, { status: 201 });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
