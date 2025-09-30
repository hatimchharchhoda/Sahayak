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
    const token = req.cookies.get("providerToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuth(token);

    const formData = await req.formData();
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const customerName = formData.get("customerName") as string | null;
    const customerMobile = formData.get("customerMobile") as string | null;
    const customerAddress = formData.get("customerAddress") as string | null;
    const image = formData.get("image") as File | null;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;
      const upload = await cloudinary.uploader.upload(base64, {
        folder: "tickets",
        resource_type: "image",
        transformation: [{ quality: "auto" }],
      });
      imageUrl = upload.secure_url;
    }

    const ticket = await prisma.ticket.create({
      data: {
        providerId: payload!.id as string,
        subject,
        message,
        customerName: customerName ?? "",
        customerMobile: customerMobile ?? "",
        customerAddress: customerAddress ?? "",
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create ticket", details: err instanceof Error ? err.message : err },
      { status: 500 }
    );
  }
}