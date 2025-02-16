import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const allProvider = await prisma.serviceProvider.findMany();
    return NextResponse.json(allProvider);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
