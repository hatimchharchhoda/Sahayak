import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { senderId, receiverId, content } = await req.json();

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: "senderId, receiverId, and content are required" },
        { status: 400 }
      );
    }

    console.log(
      "Creating message and sending to:",
      receiverId,
      "Content:",
      content
    );

    // Save the message to DB
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });

    // Send message using Axios to your backend socket API
    const response = await axios.post(
      "https://sahayak-socket.onrender.com/api/send-message",
      {
        receiverId,
        content,
        newMessage,
      }
    );

    return NextResponse.json({
      status: "Message Saved & Sent",
      message: newMessage,
      socketResponse: response.data,
    });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error sending message:", error?.message || error);

    return NextResponse.json(
      {
        error: "Failed to send and save message",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
