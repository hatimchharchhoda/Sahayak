import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const allUsers = await prisma.user.findMany();
    return NextResponse.json(allUsers);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
