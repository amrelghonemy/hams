"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  const navItems = [
    { href: "/admin", label: locale === "ar" ? "لوحة التحكم" : "Dashboard", icon: "📊" },
    { href: "/admin/products", label: locale === "ar" ? "المنتجات" : "Products", icon: "📦" },
    { href: "/admin/orders", label: locale === "ar" ? "الطلبات" : "Orders", icon: "🛒" },
    { href: "/admin/customers", label: locale === "ar" ? "العملاء" : "Customers", icon: "👥" },
    { href: "/admin/categories", label: locale === "ar" ? "الأقسام" : "Categories", icon: "🏷️" },
    { href: "/admin/discounts", label: locale === "ar" ? "الخصومات" : "Discounts", icon: "💰" },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-display font-bold text-charcoal-900">
              HAMS <span className="font-light text-nude-500">STYLE</span>
            </Link>
            <span className="text-[10px] bg-charcoal-900 text-white px-2 py-0.5 font-bold tracking-wider">ADMIN</span>
          </div>
          <Link href="/" className="text-sm text-charcoal-500 hover:text-charcoal-900">
            {locale === "ar" ? "عرض الموقع" : "View Site"} →
          </Link>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white border-s min-h-[calc(100vh-65px)] hidden md:block">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal-600 hover:bg-charcoal-50 rounded transition-colors"
              >
                <span>{item.icon}</span>
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
