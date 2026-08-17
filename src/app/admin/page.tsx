"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const { locale } = useLanguage();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
    ]).then(([statsData]) => {
      setStats(statsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const navItems = [
    { href: "/admin/products", icon: "📦", label: locale === "ar" ? "المنتجات" : "Products" },
    { href: "/admin/orders", icon: "🛒", label: locale === "ar" ? "الطلبات" : "Orders" },
    { href: "/admin/customers", icon: "👥", label: locale === "ar" ? "العملاء" : "Customers" },
    { href: "/admin/categories", icon: "🏷️", label: locale === "ar" ? "الأقسام" : "Categories" },
    { href: "/admin/discounts", icon: "💰", label: locale === "ar" ? "الخصومات" : "Discounts" },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Admin Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-display font-bold text-charcoal-900">
              HAMS <span className="font-light text-nude-500">STYLE</span>
            </Link>
            <span className="text-xs bg-charcoal-900 text-white px-2 py-0.5">{locale === "ar" ? "لوحة التحكم" : "ADMIN"}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-charcoal-500 hover:text-charcoal-900">
              {locale === "ar" ? "عرض الموقع" : "View Site"} →
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-s min-h-[calc(100vh-65px)] hidden md:block">
          <nav className="p-4 space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-charcoal-50 text-charcoal-900 rounded">
              📊 {locale === "ar" ? "الرئيسية" : "Dashboard"}
            </Link>
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

        {/* Main */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-display text-charcoal-900 mb-6">
            {locale === "ar" ? "لوحة التحكم" : "Dashboard"}
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: locale === "ar" ? "المنتجات" : "Products", value: stats.products, icon: "📦" },
              { label: locale === "ar" ? "الطلبات" : "Orders", value: stats.orders, icon: "🛒" },
              { label: locale === "ar" ? "الإيرادات" : "Revenue", value: formatPrice(stats.revenue, locale), icon: "💰" },
              { label: locale === "ar" ? "العملاء" : "Customers", value: stats.customers, icon: "👥" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-charcoal-900">{stat.value}</p>
                <p className="text-xs text-charcoal-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products" className="bg-white p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-charcoal-900 mb-2">{locale === "ar" ? "إدارة المنتجات" : "Manage Products"}</h3>
              <p className="text-sm text-charcoal-500">{locale === "ar" ? "إضافة وتعديل وحذف المنتجات" : "Add, edit, and delete products"}</p>
            </Link>
            <Link href="/admin/orders" className="bg-white p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-charcoal-900 mb-2">{locale === "ar" ? "إدارة الطلبات" : "Manage Orders"}</h3>
              <p className="text-sm text-charcoal-500">{locale === "ar" ? "متابعة وتحديث حالة الطلبات" : "Track and update order statuses"}</p>
            </Link>
            <Link href="/admin/categories" className="bg-white p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-charcoal-900 mb-2">{locale === "ar" ? "إدارة الأقسام" : "Manage Categories"}</h3>
              <p className="text-sm text-charcoal-500">{locale === "ar" ? "إضافة وتعديل الأقسام" : "Add and edit categories"}</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
