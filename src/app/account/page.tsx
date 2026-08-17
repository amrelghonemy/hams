"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";
import { t } from "@/lib/i18n";

export default function AccountPage() {
  const { locale } = useLanguage();
  const { items: wishlistItems } = useWishlist();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(locale === "ar" ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!");
        if (data.user.role === "admin") {
          window.location.href = "/admin";
        }
      } else {
        setMessage(data.error || "Error");
      }
    } catch {
      setMessage("Error");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(locale === "ar" ? "تم إنشاء الحساب بنجاح!" : "Account created!");
        setTab("login");
      } else {
        setMessage(data.error || "Error");
      }
    } catch {
      setMessage("Error");
    }
  };

  return (
    <div className="container-custom py-12 max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="text-xl font-display font-bold text-charcoal-900">HAMS <span className="font-light text-nude-500">STYLE</span></Link>
      </div>

      <div className="flex bg-charcoal-50 mb-6">
        <button
          onClick={() => setTab("login")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "login" ? "bg-white text-charcoal-900" : "text-charcoal-500"}`}
        >
          {t(locale, "login")}
        </button>
        <button
          onClick={() => setTab("register")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "register" ? "bg-white text-charcoal-900" : "text-charcoal-500"}`}
        >
          {t(locale, "register")}
        </button>
      </div>

      {message && (
        <div className={`p-3 text-sm mb-4 ${message.includes("success") || message.includes("بنجاح") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      {tab === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label-text">{t(locale, "email")}</label>
            <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label-text">{t(locale, "quantity").replace("الكمية", "كلمة المرور").replace("Quantity", "Password")}</label>
            <input type="password" required className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">{t(locale, "login")}</button>
          <p className="text-center text-sm text-charcoal-400">
            {locale === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => setTab("register")} className="text-charcoal-900 underline">
              {t(locale, "register")}
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="label-text">{t(locale, "fullName")}</label>
            <input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label-text">{t(locale, "email")}</label>
            <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label-text">{t(locale, "mobileNumber")}</label>
            <input type="tel" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label-text">Password</label>
            <input type="password" required className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">{t(locale, "register")}</button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-sm font-semibold mb-4">{t(locale, "wishlist")} ({wishlistItems.length})</h3>
        <Link href="/account/wishlist" className="btn-secondary w-full text-sm text-center block">
          {locale === "ar" ? "عرض المفضلة" : "View Wishlist"}
        </Link>
      </div>
    </div>
  );
}
