import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { signToken } from "../../../../lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Connect to MongoDB
    try {
      await dbConnect();
    } catch (dbError) {
      console.error("[Login] Database connection failed:", dbError.message);
      return NextResponse.json(
        { error: "Unable to connect to database. Please try again later." },
        { status: 503 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({ userId: user._id, email: user.email, name: user.name });

    console.log("[Login] ✅ User logged in:", user.email);

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Login] ❌ Error:", error.message);
    console.error("[Login] Stack:", error.stack);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
