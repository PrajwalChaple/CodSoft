import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAuthUser } from "../../../../lib/auth";

// Initialize Razorpay only if keys are present (avoid crashing on startup)
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;
if (keyId && keyId !== "rzp_test_XXXXXXXXXX" && keySecret && keySecret !== "XXXXXXXXXXXXXXXXXX") {
  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// Create a Razorpay order
export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { amount, currency = "INR", receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Check if we are in mock/demo payment mode
    if (!razorpay) {
      console.log("[Payment] Razorpay keys are placeholder/missing. Using mock payment mode.");
      return NextResponse.json({
        orderId: `order_mock_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        key: "rzp_test_XXXXXXXXXX",
        isMock: true,
      });
    }

    // Real Razorpay integration
    try {
      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: {
          userId: authUser.userId,
        },
      };

      const order = await razorpay.orders.create(options);

      console.log("[Payment] ✅ Razorpay order created:", order.id);

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: keyId,
        isMock: false,
      });
    } catch (razorpayError) {
      console.error("[Payment] ❌ Razorpay API error:", razorpayError.message);

      // Fallback to mock in case of API error with Razorpay
      return NextResponse.json({
        orderId: `order_mock_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        key: "rzp_test_XXXXXXXXXX",
        isMock: true,
        warn: "Failed to connect to Razorpay, using Mock fallback",
      });
    }
  } catch (error) {
    console.error("[Payment] ❌ Create order error:", error.message);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
