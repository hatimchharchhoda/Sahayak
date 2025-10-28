import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface TokenPayload {
  id: string;
  role: "USER" | "PROVIDER" | "ADMIN";
  email?: string;
  name?: string;
  specialization?: string; // for providers
  status?: string; // ✅ add this
  city?: string;   // 🆕 add this
  district?: string;    
}

export async function verifyAuth(token?: string): Promise<TokenPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // ✅ Cast to TokenPayload safely
    const typedPayload: TokenPayload = {
      id: (payload.userId as string) || (payload.id as string),
      role: payload.role as "USER" | "PROVIDER" | "ADMIN",
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      specialization: payload.specialization as string | undefined,
      city: payload.city as string | undefined,
      district: payload.district as string | undefined,
      status: payload.status as string | undefined,
    };

    return typedPayload;
  } catch (error) {
    console.warn("Token verification failed:", error);
    return null;
  }
}
