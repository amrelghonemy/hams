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
    <div className="container-custom py-16 max-w-md mx-auto px-4">
      <div className="text-center mb-10">
        <Link href="/" className="text-2xl font-display font-bold text-charcoal-700">
          HAMS <span className="font-light text-blush-300">STYLE</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-soft-lg p-8">
        <div className="flex bg-cream-100 rounded-2xl p-1 mb-8">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
              tab === "login"
                ? "bg-white text-blush-400 shadow-soft"
                : "text-charcoal-400 hover:text-charcoal-600"
            }`}
          >
            {t(locale, "login")}
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
              tab === "register"
                ? "bg-white text-blush-400 shadow-soft"
                : "text-charcoal-400 hover:text-charcoal-600"
            }`}
          >
            {t(locale, "register")}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 text-sm rounded-2xl mb-6 ${
              message.includes("success") || message.includes("بنجاح")
                ? "bg-rose-100/60 text-blush-400"
                : "bg-rose-100 text-blush-400"
            }`}
          >
            {message}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label-text">{t(locale, "email")}</label>
              <input
                type="email"
                required
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">
                {locale === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <input
                type="password"
                required
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              {t(locale, "login")}
            </button>
            <p className="text-center text-sm text-charcoal-400">
              {locale === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setTab("register")}
                className="text-blush-400 font-medium hover:text-blush-300 transition-colors"
              >
                {t(locale, "register")}
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="label-text">{t(locale, "fullName")}</label>
              <input
                type="text"
                required
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">{t(locale, "email")}</label>
              <input
                type="email"
                required
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">{t(locale, "mobileNumber")}</label>
              <input
                type="tel"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">
                {locale === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <input
                type="password"
                required
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              {t(locale, "register")}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 bg-white rounded-3xl shadow-soft p-6 text-center">
        <h3 className="text-sm font-medium text-charcoal-500 mb-4">
          {t(locale, "wishlist")} ({wishlistItems.length})
        </h3>
        <Link
          href="/account/wishlist"
          className="btn-secondary w-full text-sm justify-center"
        >
          {locale === "ar" ? "عرض المفضلة" : "View Wishlist"}
        </Link>
      </div>
    </div>
  );
}
