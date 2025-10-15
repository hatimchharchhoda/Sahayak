import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Always mark async and await params properly
export async function DELETE(_request: Request, context: any) {
  const { id } = await context.params; 
  console.log("Deleting service with ID:", id);

  try {
    // 1️⃣ Delete all dependent records that reference this service
    await prisma.rating.deleteMany({ where: { serviceId: id } }); // Delete ratings
    await prisma.booking.deleteMany({ where: { serviceId: id } }); // Delete bookings
    await prisma.serviceProviderService.deleteMany({ where: { serviceId: id } }); // Delete link table entries

    // 2️⃣ Now safely delete the service
    const deletedService = await prisma.service.delete({
      where: { id },
    });

    console.log("✅ Service deleted successfully:", deletedService.name);

    return NextResponse.json(
      { message: "Service deleted successfully", deletedService },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error deleting service:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}