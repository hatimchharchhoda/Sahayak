import citiesData from "@/app/lib/cityData.json";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cities = await prisma.gujaratCity.findMany();

    const allDistrict = cities.map((c) => c.district);

    console.log("✅ Gujarat city data seeded successfully.");
    return NextResponse.json({ allDistrict });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load city data" },
      { status: 500 }
    );
  }
}
