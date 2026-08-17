"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLoginPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(locale === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials");
        setLoading(false);
        return;
      }
      if (data.user.role !== "admin") {
        setError(locale === "ar" ? "غير مصرح لك بالدخول" : "Unauthorized");
        setLoading(false);
        return;
      }
      router.push("/admin");
    } catch {
      setError(locale === "ar" ? "حدث خطأ" : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Hams Style" className="h-20 w-auto mx-auto object-contain" />
          <p className="text-charcoal-400 mt-2 text-sm">
            {locale === "ar" ? "لوحة التحكم" : "Admin Panel"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center">{error}</div>
          )}
          <div>
            <label className="label-text">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="label-text">{locale === "ar" ? "كلمة المرور" : "Password"}</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "..." : locale === "ar" ? "دخول" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
