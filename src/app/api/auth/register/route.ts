import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "customer",
      })
      .select("id, name, email, role")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
