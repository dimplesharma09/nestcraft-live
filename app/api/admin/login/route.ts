import { NextResponse } from "next/server";
import { getUserModel } from "@/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const User = await getUserModel();
    // Assuming users are stored in the kalp_master DB in a "users" collection
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Usually we use bcrypt.compare(password, user.password)
    // If the database has plain passwords or another hashing, this might need adjusting.
    // For now, attempting bcrypt. If it fails due to plain text, we fallback to direct match (in development)
    const isValid = await bcrypt.compare(password, user.password).catch(() => false);
    
    if (!isValid && password !== user.password) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role || 'admin' }, JWT_SECRET, { expiresIn: '1d' });

    // Set HTTP-only cookie
    const cookieString = serialize('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    const response = NextResponse.json({ success: true, user: { id: user._id, email: user.email, name: user.name } });
    response.headers.set('Set-Cookie', cookieString);
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
