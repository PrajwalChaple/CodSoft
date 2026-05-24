import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { signToken } from "../../../../lib/auth";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Connect to MongoDB — if this fails, the error will be caught below
    try {
      await dbConnect();
    } catch (dbError) {
      console.error("[Register] Database connection failed:", dbError.message);
      return NextResponse.json(
        { error: "Unable to connect to database. Please try again later." },
        { status: 503 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    console.log("[Register] ✅ User created:", user.email);

    const token = signToken({ userId: user._id, email: user.email, name: user.name });

    const response = NextResponse.json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    }, { status: 201 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Register] ❌ Error:", error.message);
    console.error("[Register] Stack:", error.stack);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
