// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isValidObjectId } from "mongoose"; // or use a helper

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, specialization, city, district } =
      await req.json();

    console.log({
      email,
      password,
      name,
      phone,
      specialization,
      city,
      district,
    });

    if (
      !specialization ||
      typeof specialization !== "string" ||
      specialization.length !== 24
    ) {
      return NextResponse.json(
        { error: "Invalid specialization/category ID" },
        { status: 400 }
      );
    }

    // Check for JWT_SECRET early
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT secret is required" },
        { status: 500 }
      );
    }

    // Check if provider already exists
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingProvider) {
      return NextResponse.json(
        { error: "Email already exists. Please try with a different email." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("before create");

    // Create the new provider
    const provider = await prisma.serviceProvider.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        district,
        city,
        phone,
        specialization,
        role: "PROVIDER",
      },
    });
    console.log("after create");
    // Fetch services under the selected category (specialization)
    const services = await prisma.service.findMany({
      where: {
        categoryId: specialization, // `specialization` is categoryId
      },
    });

    // Optional: handle case when no services found under the category
    if (services.length === 0) {
      return NextResponse.json(
        { error: "No services found for the selected category." },
        { status: 400 }
      );
    }

    // Create provider-service links
    const links = await Promise.all(
      services.map((service) =>
        prisma.serviceProviderService.create({
          data: {
            providerId: provider.id,
            serviceId: service.id,
          },
        })
      )
    );

    // Create token
    const token = jwt.sign(
      {
        id: provider.id,
        name: provider.name,
        email: provider.email,
        role: provider.role,
        city: provider.city,
        district: provider.district,
        specialization: provider.specialization,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send token as cookie
    const response = NextResponse.json(
      {
        message: "Signup successful",
        provider,
      },
      { status: 200 }
    );

    response.cookies.set("providerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
