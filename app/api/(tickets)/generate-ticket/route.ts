import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const userToken = req.cookies.get("userToken")?.value;
    console.log(userToken);
    if (!userToken) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      );
    }

    const payload = await verifyAuth(userToken);
    console.log(payload);

    const formData = await req.formData();

    const subject = formData.get("subject") as string;
    const bookingId = formData.get("serviceId") as string;
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convert buffer to base64 data URI for uploader.upload
      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

      // Upload to Cloudinary using uploader.upload
      const uploadResponse = await cloudinary.uploader.upload(base64, {
        resource_type: "image",
        folder: "tickets",
        transformation: [{ quality: "auto" }],
      });

      imageUrl = uploadResponse.secure_url;
    }

    const ticketData = {
      subject,
      message,
      imageUrl: imageUrl ?? "",
      userId: payload!.userId as string,
      bookingId,
    };

    console.log(ticketData);
    console.log({ ticketData });
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ticket created successfully",
        data: ticket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing ticket:", error);

    return NextResponse.json(
      {
        error: "Failed to process ticket",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
