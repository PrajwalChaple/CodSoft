import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { getAuthUser } from "../../../../lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.error("[Auth/Me] Database connection failed:", dbError.message);
      return NextResponse.json({ user: null }, { status: 503 });
    }

    const user = await User.findById(authUser.userId).select("-password");
    if (!user) {
      console.warn("[Auth/Me] Token valid but user not found in DB. userId:", authUser.userId);
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("[Auth/Me] ❌ Error:", error.message);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
