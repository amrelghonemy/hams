"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { locale } = useLanguage();

  return (
    <div className="container-custom py-16 md:py-24 text-center">
      <div className="max-w-md mx-auto animate-fade-in">
        <div className="bg-white rounded-3xl shadow-soft-md p-10">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-blush-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blush-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-display text-blush-400 mb-4">
            {t(locale, "orderConfirmed")}
          </h1>
          {orderNumber && (
            <p className="text-charcoal-500 mb-2">
              {t(locale, "orderNumber")}:{" "}
              <span className="font-semibold text-blush-400">{orderNumber}</span>
            </p>
          )}
          <p className="text-sm text-charcoal-400 mb-8 leading-relaxed">
            {locale === "ar"
              ? "سيتم التواصل معك قريباً لتأكيد الطلب. يمكنك تتبع حالة طلبك من خلال صفحة التتبع."
              : "We'll contact you soon to confirm the order. You can track your order status from the tracking page."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/tracking?order=${orderNumber || ""}`}
              className="btn-primary rounded-full"
            >
              {t(locale, "trackOrder")}
            </Link>
            <Link href="/shop" className="btn-secondary rounded-full">
              {t(locale, "continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-16 md:py-24 text-center">
        <div className="max-w-md mx-auto animate-pulse">
          <div className="bg-white rounded-3xl shadow-soft p-10">
            <div className="w-20 h-20 bg-cream-300 rounded-full mx-auto mb-6" />
            <div className="h-8 bg-cream-300 rounded-2xl w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-cream-300 rounded-xl w-1/2 mx-auto mb-8" />
            <div className="flex gap-3 justify-center">
              <div className="h-12 bg-cream-300 rounded-full w-36" />
              <div className="h-12 bg-cream-300 rounded-full w-36" />
            </div>
          </div>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
