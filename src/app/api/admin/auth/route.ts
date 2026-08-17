import { NextResponse } from "next/server";
import { verifyAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await verifyAdmin();
  if (!user) return unauthorized();
  return NextResponse.json({ authorized: true, user: { email: user.email, role: user.role } });
}
