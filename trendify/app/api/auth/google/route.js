import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { signToken } from "../../../../lib/auth";

// POST — Handle Google OAuth login
// Receives Google user profile, finds/creates MongoDB user, issues JWT cookie
export async function POST(request) {
  try {
    const { email, name, googleId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.error("[Google Auth] Database connection failed:", dbError.message);
      return NextResponse.json(
        { error: "Unable to connect to database. Please try again later." },
        { status: 503 }
      );
    }

    // Find existing user by email
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // If user exists but was created with email/password, update with Google info
      if (user.authProvider === "email" && googleId) {
        user.authProvider = "google";
        user.googleId = googleId;
        await user.save();
      }
      console.log("[Google Auth] ✅ Existing user logged in:", user.email);
    } else {
      // Create new user (no password needed for Google auth)
      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        authProvider: "google",
        googleId: googleId || "",
      });
      console.log("[Google Auth] ✅ New user created:", user.email);
    }

    // Issue JWT token (same as email/password login)
    const token = signToken({ userId: user._id, email: user.email, name: user.name });

    const response = NextResponse.json({
      message: "Google login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Google Auth] ❌ Error:", error.message);
    console.error("[Google Auth] Stack:", error.stack);

    if (error.code === 11000) {
      // Duplicate key — user already exists, try to log them in
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: (await request.clone().json()).email?.toLowerCase() });
        if (existingUser) {
          const token = signToken({ userId: existingUser._id, email: existingUser.email, name: existingUser.name });
          const response = NextResponse.json({
            message: "Google login successful",
            user: { id: existingUser._id, name: existingUser.name, email: existingUser.email },
          });
          response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });
          return response;
        }
      } catch {
        // fall through to error
      }
    }

    return NextResponse.json({ error: "Google login failed. Please try again." }, { status: 500 });
  }
}
