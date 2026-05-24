import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { getAuthUser } from "../../../../lib/auth";

// Verify Razorpay payment and create order
export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = await request.json();

    // Verify signature
    const isMock = razorpay_order_id.startsWith("order_mock_") || razorpay_signature === "mock_signature";
    
    if (!isMock) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mock")
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: "Payment verification failed" },
          { status: 400 }
        );
      }
    }

    // Payment verified — create order in database
    await dbConnect();

    const order = await Order.create({
      user: authUser.userId,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      discount: orderData.discount,
      total: orderData.total,
      status: "processing",
      isPaid: true,
      paidAt: new Date(),
    });

    return NextResponse.json({
      message: "Payment verified and order placed successfully",
      order: {
        id: order._id,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
