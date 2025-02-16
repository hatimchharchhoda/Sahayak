// @ts-nocheck
// app/api/provider/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, specialization } = await req.json();

    // Check if provider already exists
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { email },
    });

    if (existingProvider) {
      return NextResponse.json(
        { error: "Provider already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new provider
    const provider = await prisma.serviceProvider.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        specialization,
        role: "PROVIDER",
      },
    });
    // Generate JWT token
    const token = jwt.sign(
      {
        id: provider.id,
        name: provider.name,
        email: provider.email,
        role: provider.role,
        specialization: provider.specialization,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    if (!JWT_SECRET)
      return NextResponse.json(
        { error: "JWT secret required" },
        { status: 400 }
      );

    // Send token as a cookie
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.cookies.set("providerToken", token, {
      httpOnly: true, // Prevents JavaScript access to cookies
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
