"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const { locale } = useLanguage();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: locale === "ar" ? "المنتجات" : "Products",
      value: stats.products,
      icon: "📦",
      bg: "bg-mauve-100/50",
      border: "border-mauve-100",
    },
    {
      label: locale === "ar" ? "الطلبات" : "Orders",
      value: stats.orders,
      icon: "🛒",
      bg: "bg-rose-100/50",
      border: "border-rose-100",
    },
    {
      label: locale === "ar" ? "الإيرادات" : "Revenue",
      value: formatPrice(stats.revenue, locale),
      icon: "💰",
      bg: "bg-peach-100/50",
      border: "border-peach-100",
    },
    {
      label: locale === "ar" ? "العملاء" : "Customers",
      value: stats.customers,
      icon: "👥",
      bg: "bg-blush-100/50",
      border: "border-blush-100",
    },
  ];

  const quickActions = [
    {
      href: "/admin/products",
      title: locale === "ar" ? "إدارة المنتجات" : "Manage Products",
      desc: locale === "ar" ? "إضافة وتعديل وحذف المنتجات" : "Add, edit, and delete products",
    },
    {
      href: "/admin/orders",
      title: locale === "ar" ? "إدارة الطلبات" : "Manage Orders",
      desc: locale === "ar" ? "متابعة وتحديث حالة الطلبات" : "Track and update order statuses",
    },
    {
      href: "/admin/categories",
      title: locale === "ar" ? "إدارة الأقسام" : "Manage Categories",
      desc: locale === "ar" ? "إضافة وتعديل الأقسام" : "Add and edit categories",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal-700 mb-8">
        {locale === "ar" ? "لوحة التحكم" : "Dashboard"}
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-soft p-6 animate-pulse">
              <div className="skeleton w-12 h-12 rounded-2xl mb-4" />
              <div className="skeleton-title w-20 mb-2" />
              <div className="skeleton-text w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl shadow-soft p-6 border ${stat.border} transition-all duration-300 hover:shadow-soft-md`}
            >
              <div
                className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}
              >
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-charcoal-700">{stat.value}</p>
              <p className="text-xs text-charcoal-400 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="bg-white rounded-3xl shadow-soft p-6 hover:shadow-soft-md transition-all duration-300 group"
          >
            <h3 className="font-semibold text-charcoal-700 mb-2 group-hover:text-blush-400 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-charcoal-400">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
