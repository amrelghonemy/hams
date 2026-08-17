import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "hams-style-secret";

export interface AdminUser {
  id: number;
  email: string;
  role: string;
}

export async function verifyAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hams-token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    if (!decoded || decoded.role !== "admin") return null;
    return decoded;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
