"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

export default function AccountOrdersPage() {
  const { locale } = useLanguage();
  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl md:text-3xl font-display text-charcoal-900 mb-8">{t(locale, "myOrders")}</h1>
      <div className="bg-white p-8 text-center">
        <p className="text-charcoal-500 mb-4">{locale === "ar" ? "سجلي الدخول لعرض طلباتك" : "Login to view your orders"}</p>
        <Link href="/account" className="btn-primary text-sm">{t(locale, "login")}</Link>
      </div>
    </div>
  );
}
