import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = db.prepare(
      "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)"
    ).run(name, email, hashedPassword, phone || null);

    return NextResponse.json({
      success: true,
      user: { id: result.lastInsertRowid, name, email, role: "customer" },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
