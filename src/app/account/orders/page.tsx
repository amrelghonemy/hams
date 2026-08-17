"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

export default function AccountOrdersPage() {
  const { locale } = useLanguage();
  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl md:text-3xl font-display text-charcoal-700 mb-8">
        {t(locale, "myOrders")}
      </h1>
      <div className="bg-white rounded-3xl shadow-soft-lg p-12 text-center">
        <svg
          className="w-16 h-16 text-rose-200 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <p className="text-charcoal-400 mb-6 text-lg">
          {locale === "ar"
            ? "سجلي الدخول لعرض طلباتك"
            : "Login to view your orders"}
        </p>
        <Link href="/account" className="btn-primary">
          {t(locale, "login")}
        </Link>
      </div>
    </div>
  );
}
