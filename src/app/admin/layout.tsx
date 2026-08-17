"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthorized(true);
      setChecking(false);
      return;
    }
    fetch("/api/admin/auth")
      .then((r) => {
        if (r.ok) {
          setAuthorized(true);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setChecking(false));
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-charcoal-400 text-sm">...</div>
      </div>
    );
  }

  if (!authorized) return null;

  const navItems = [
    { href: "/admin", label: locale === "ar" ? "لوحة التحكم" : "Dashboard", icon: "📊" },
    { href: "/admin/products", label: locale === "ar" ? "المنتجات" : "Products", icon: "📦" },
    { href: "/admin/orders", label: locale === "ar" ? "الطلبات" : "Orders", icon: "🛒" },
    { href: "/admin/customers", label: locale === "ar" ? "العملاء" : "Customers", icon: "👥" },
    { href: "/admin/categories", label: locale === "ar" ? "الأقسام" : "Categories", icon: "🏷️" },
    { href: "/admin/discounts", label: locale === "ar" ? "الخصومات" : "Discounts", icon: "💰" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-cream-300 px-6 py-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Hams Style" className="h-40 w-auto object-contain" />
            </Link>
            <span className="text-[10px] bg-blush-400 text-white px-3 py-1 font-bold tracking-wider rounded-full">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-charcoal-400 hover:text-blush-400 transition-colors"
            >
              {locale === "ar" ? "عرض الموقع" : "View Site"} →
            </Link>
            <button
              onClick={() => {
                document.cookie = "hams-token=; path=/; max-age=0";
                router.push("/admin/login");
              }}
              className="text-sm text-charcoal-400 hover:text-red-400 transition-colors"
            >
              {locale === "ar" ? "خروج" : "Logout"}
            </button>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white/60 backdrop-blur-sm border-e border-cream-300 min-h-[calc(100vh-65px)] hidden md:block shadow-soft">
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blush-400/10 text-blush-400 font-medium shadow-soft"
                    : "text-charcoal-500 hover:bg-rose-100/50 hover:text-charcoal-700"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
