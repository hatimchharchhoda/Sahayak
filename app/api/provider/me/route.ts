// // app/api/provider/me/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get("providerToken")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized: No token found" },
//         { status: 401 }
//       );
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

//     if (!decoded?.id) {
//       return NextResponse.json(
//         { success: false, error: "Invalid token" },
//         { status: 403 }
//       );
//     }

//     // Only fetch profile fields + related data
//     const provider = await prisma.serviceProvider.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phone: true,
//         address: true,
//         city: true,
//         district: true,
//         services: {
//           include: { Service: true },
//         },
//         bookings: {
//           include: { Service: true },
//         },
//       },
//     });

//     if (!provider) {
//       return NextResponse.json(
//         { success: false, error: "Provider not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(provider);
//   } catch (error) {
//     console.error("Error in provider/me:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch provider details" },
//       { status: 500 }
//     );
//   }
// }
