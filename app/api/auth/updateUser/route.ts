// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, email, name, phone, address, district, city } = data;
    console.log({ id, email, name, phone, address, district, city });
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!JWT_SECRET)
      return NextResponse.json(
        { error: "JWT secret required" },
        { status: 400 }
      );

    // Find and update the user
    const updatedUser = await prisma.user.update({
      where: { id }, // Ensure the user exists
      data: {
        email,
        name,
        phone,
        address,
        city,
        district,
      },
    });

    const token = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name,
        city: updatedUser.city,
        district: updatedUser.district,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token as a cookie
    const response = NextResponse.json(
      { message: "User Updated", updatedUser },
      { status: 200 }
    );

    response.cookies.set("userToken", token, {
      httpOnly: true, // Prevents JavaScript access to cookies
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
