import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Correct type signature for dynamic routes in Next.js 15+
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ← Promise wrapper is important
) {
  try {
    // ✅ Await params because Next.js 15 treats them as async
    const { id } = await context.params;
    const body = await req.json();

    // 1. Check if provider exists
    const provider = await prisma.serviceProvider.findUnique({ where: { id } });
    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    // 2. Check if email already exists (exclude current provider)
    if (body.email) {
      const existingEmail = await prisma.serviceProvider.findFirst({
        where: { email: body.email, NOT: { id } },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // 3. Check if phone already exists (exclude current provider)
    if (body.phone) {
      const existingPhone = await prisma.serviceProvider.findFirst({
        where: { phone: body.phone, NOT: { id } },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "Phone number already in use" },
          { status: 400 }
        );
      }
    }

    // 4. Update provider
    const updatedProvider = await prisma.serviceProvider.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      { message: "Provider updated successfully", provider: updatedProvider },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update provider error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}