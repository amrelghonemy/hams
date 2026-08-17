"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { locale } = useLanguage();

  return (
    <div className="container-custom py-12 md:py-20 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-display text-blush-400 text-center mb-10">
        {locale === "ar" ? "من نحن" : "About Us"}
      </h1>

      <div className="space-y-8 text-charcoal-500 leading-relaxed text-sm md:text-base">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "قصتنا" : "Our Story"}
          </h2>
          <p>
            {locale === "ar"
              ? "Hams Style هي وجهتك الأولى للأزياء العصرية الأنيقة للمرأة العصرية في مصر. بدأت رحلتنا بشغف تقديم تشكيلة فريدة من الملابس والإكسسوارات التي تجمع بين الأناقة والراحة."
              : "Hams Style is your go-to destination for trendy, elegant women's fashion in Egypt. Our journey began with a passion for curating a unique collection of clothing and accessories that blend style with comfort."}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "رؤيتنا" : "Our Vision"}
          </h2>
          <p>
            {locale === "ar"
              ? "نسعى لتكون Hams Style الخيار الأول للمرأة العصرية الباحثة عن أناقة تجمع بين الجودة العالية والأسعار المناسبة. نؤمن بأن كل مرأة تستحق أن تشعر بالثقة والتميز."
              : "We aim to be the top choice for modern women seeking elegance that combines high quality with affordable prices. We believe every woman deserves to feel confident and outstanding."}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "قيمنا" : "Our Values"}
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar" ? "الجودة أولاً — كل منتج يمر بعمليات فحص صارمة" : "Quality First — Every product undergoes strict quality checks"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar" ? "رضا العميل — سعادتنا تكمن في رضاكم" : "Customer Satisfaction — Our happiness lies in your satisfaction"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar" ? "الشحن السريع والتوصيل الموحد" : "Fast shipping and reliable delivery"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar" ? "خدمة عملاء متميزة متاحة على مدار الساعة" : "Outstanding customer service available around the clock"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
