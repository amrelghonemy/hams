"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function ShippingContent() {
  const { locale } = useLanguage();

  return (
    <div className="container-custom py-12 md:py-20 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-display text-blush-400 text-center mb-10">
        {locale === "ar" ? "سياسة الشحن" : "Shipping Policy"}
      </h1>

      <div className="space-y-8 text-charcoal-500 leading-relaxed text-sm md:text-base">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "الشحن والتوصيل" : "Shipping & Delivery"}
          </h2>
          <p className="mb-4">
            {locale === "ar"
              ? "نعمل مع أفضل شركات الشحن لتوصيل طلبك بأمان وفي الوقت المحدد."
              : "We partner with the best shipping companies to deliver your order safely and on time."}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-rose-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-blush-400 mb-1">1-2</p>
              <p className="text-xs text-charcoal-400">
                {locale === "ar" ? "أيام عمل — القاهرة والجيزة" : "Business days — Cairo & Giza"}
              </p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-blush-400 mb-1">3-5</p>
              <p className="text-xs text-charcoal-400">
                {locale === "ar" ? "أيام عمل — المحافظات الأخرى" : "Business days — Other governorates"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "رسوم الشحن" : "Shipping Fees"}
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "شحن مجاني على جميع الطلبات فوق 500 جنيه مصري"
                : "Free shipping on all orders over 500 EGP"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "رسوم الشحن للطلبات أقل من 500 جنيه: 50 جنيه فقط"
                : "Shipping fee for orders under 500 EGP: only 50 EGP"}
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "ملاحظات مهمة" : "Important Notes"}
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "يجب التواجد على العنوان المحدد عند التوصيل"
                : "You must be present at the specified address during delivery"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "سيتم التواصل معك قبل التوصيل لتأكيد الموعد"
                : "We will contact you before delivery to confirm the appointment"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "يمكنك الدفع عند الاستلام نقداً أو بالبطاقة"
                : "You can pay cash on delivery with cash or card"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
