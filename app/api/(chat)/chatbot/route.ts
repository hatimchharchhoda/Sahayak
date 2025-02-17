// @ts-nocheck

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini API

// Interface for the main response from the query
interface QueryData {
  categories?: ServiceCategory[];
  services?: Service[];
  bookings?: Booking[];
  ratings?: Rating[];
  providers?: ServiceProvider[];
  users?: User[];
}

// Interfaces for database models
interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
}
interface Service {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  description?: string;
}
interface Booking {
  id: number;
  userId: number;
  serviceId: number;
  providerId: number;
  status: "scheduled" | "completed" | "cancelled";
  bookedAt: Date;
  completedAt?: Date;
}
interface Rating {
  id: number;
  userId: number;
  providerId: number;
  rating: number;
  review?: string;
}
interface ServiceProvider {
  id: number;
  name: string;
  serviceIds: number[]; // IDs of services the provider offers
  rating?: number;
  description?: string;
}
interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
}

// Initialize Gemini API with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { question, chatHistory }: ChatRequest = await req.json();
    const data: QueryData = await getQuery(question.toLowerCase(), prisma);

    const formattedChatHistory = chatHistory
      .map(
        (msg) => `${msg.sender === "user" ? "User" : "Sahayak"}: ${msg.text}`
      )
      .join("\n");

    const context = `
      You are Sahayak, a helpful assistant for an Indian home services booking platform. 
      Your personality combines professional expertise with warm Indian hospitality.
      
      IMPORTANT GUIDELINES FOR YOUR RESPONSES:
      1. Use a mix of English with occasional Hindi/Hinglish words for warmth, but keep it primarily English
      2. Always emphasize important information between **double asterisks**
      3. Common Hindi words to naturally incorporate:
         - Namaste/Namaskar (for greetings)
         - Ji (for respect)
         - Dhanyavaad (for thank you)
         - Maaf kijiye (for apologies)
         - Bilkul (for absolutely)
         - Zaroor (for surely)
      4. For prices, use "₹" symbol and mention "rupees" occasionally
      5. Time references should use IST (Indian Standard Time)
      6. When mentioning service providers, add "ji" after their names
      7. Use phrases like "aapka swagat hai" for welcomes
      8. For confirmations, use "bilkul" or "zaroor"
      9. For apologies, start with "maaf kijiye"
      
      EXAMPLE RESPONSES:
      - "Namaste! The **home cleaning service** costs ₹999. Sharma ji is available tomorrow."
      - "Bilkul! Your **booking is confirmed** for tomorrow at 10:00 AM IST."
      - "Maaf kijiye, but the **service is currently unavailable** in your area."
      
      Previous conversation:
      ${formattedChatHistory}

      Available data:
      ${JSON.stringify(data, null, 2)}
      
      Current date: ${new Date().toISOString()}

      Remember to:
      1. Keep responses professional but warm
      2. Emphasize key information with **asterisks**
      3. Use Hindi words naturally, not forcefully
      4. Be precise with prices, times, and availability
      5. Show respect and courtesy in Indian style
      6. Consider the full conversation context
      
      Current User Question: ${question}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(context);
    const response: ChatResponse = { response: result.response.text() };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      response:
        "Maaf kijiye, there seems to be a **technical issue**. Please try again.",
    } as ChatResponse);
  }
}

async function getQuery(query: string, prisma: any) {
  let queryData: QueryData = {};

  // Service Categories queries
  if (
    query.includes("category") ||
    query.includes("categories") ||
    query.includes("type of service")
  ) {
    queryData.categories = await prisma.serviceCategory.findMany();
  }

  // Services queries
  if (
    query.includes("service") ||
    query.includes("cleaning") ||
    query.includes("plumbing") ||
    query.includes("electrical") ||
    query.includes("price")
  ) {
    queryData.services = await prisma.service.findMany();
  }

  // Booking queries
  if (
    query.includes("booking") ||
    query.includes("appointment") ||
    query.includes("scheduled") ||
    query.includes("completed") ||
    query.includes("cancelled")
  ) {
    queryData.bookings = await prisma.booking.findMany();
  }

  // Rating queries
  if (
    query.includes("rating") ||
    query.includes("review") ||
    query.includes("feedback") ||
    query.includes("experience") ||
    query.includes("stars")
  ) {
    queryData.ratings = await prisma.rating.findMany();
  }

  // Provider queries
  if (
    query.includes("provider") ||
    query.includes("professional") ||
    query.includes("expert") ||
    query.includes("worker")
  ) {
    queryData.providers = await prisma.serviceProvider.findMany();
  }

  // User queries (only fetch if necessary, but do not expose sensitive info)
  if (
    query.includes("user") ||
    query.includes("customer") ||
    query.includes("client")
  ) {
    queryData.users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  // If no specific query matches, return data from all collections for context
  if (Object.keys(queryData).length === 0) {
    queryData = {
      categories: await prisma.serviceCategory.findMany(),
      services: await prisma.service.findMany(),
      bookings: await prisma.booking.findMany(),
      ratings: await prisma.rating.findMany(),
      providers: await prisma.serviceProvider.findMany(),
      users: await prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    };
  }

  return queryData;
}
