"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

const reviews = [
  {
    name: "سارة أحمد",
    rating: 5,
    text: "الخامة جميلة جداً والمقاس كان مضبوط، أكيد هطلب مرة تانية.",
    textEn: "The fabric is beautiful and the size was perfect. I'll definitely order again.",
  },
  {
    name: "نور محمد",
    rating: 5,
    text: "توصيل سريع والمنتج أحسن مما توقعت، شكراً Hams Style!",
    textEn: "Fast delivery and the product exceeded my expectations. Thank you Hams Style!",
  },
  {
    name: "ريم حسن",
    rating: 4,
    text: "التصميم أنيق جداً والقماش مريح، أنصح بالشراء.",
    textEn: "Elegant design and comfortable fabric. I recommend buying.",
  },
  {
    name: "مريم خالد",
    rating: 5,
    text: "أحلى متجر لبس لقيته، كل قطعة أجمل من التانية.",
    textEn: "The best fashion store I've found, every piece is more beautiful than the other.",
  },
  {
    name: "فاطمة علي",
    rating: 5,
    text: "الخدمة ممتازة والمنتجات أصلية، هفضل أطلب منكم.",
    textEn: "Excellent service and authentic products. I'll keep ordering from you.",
  },
];

export function ReviewsSection() {
  const { locale } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#fdf6f3] to-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">{t(locale, "customerReviews")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 text-center shadow-md shadow-[#d4a5a5]/10 hover:shadow-lg hover:shadow-[#c97b7b]/15 transition-all duration-400 hover:-translate-y-1 border border-[#f5e6e0]/60"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#f5e6e0] to-[#eeddd6] flex items-center justify-center">
                <span className="text-[#c97b7b] font-display text-lg font-semibold">
                  {review.name.charAt(0)}
                </span>
              </div>
              <div className="flex items-center justify-center gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    className={`w-4 h-4 ${j < review.rating ? "text-[#d4a576]" : "text-[#f0e4dc]"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-[#8c6262] leading-relaxed mb-4 italic">
                &ldquo;{locale === "ar" ? review.text : review.textEn}&rdquo;
              </p>
              <p className="text-xs font-semibold text-[#5c3a3a] tracking-wide">
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
