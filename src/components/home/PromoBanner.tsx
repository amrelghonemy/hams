"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

export function PromoBanner() {
  const { locale } = useLanguage();

  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f5e6e0] via-[#eeddd6] to-[#e8ccc2] shadow-xl shadow-[#c97b7b]/10">
          <div className="absolute inset-0 opacity-15">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="relative px-8 py-12 md:px-16 md:py-20 text-center">
            <p className="text-[#a85c5c] text-sm tracking-[0.2em] uppercase mb-3 font-medium">
              {locale === "ar" ? "مجموعة حصرية" : "Exclusive Collection"}
            </p>
            <h2 className="text-2xl md:text-4xl font-display text-[#5c3a3a] mb-3">
              {locale === "ar" ? "ارتقِ بإطلالتك اليومية" : "Elevate Your Everyday Style"}
            </h2>
            <p className="text-[#8c6262] text-sm md:text-base mb-8 max-w-lg mx-auto">
              {locale === "ar"
                ? "قطع مختارة بعناية لتناسب كل لحظة."
                : "Carefully curated pieces to suit every moment."}
            </p>
            <Link
              href="/shop"
              className="bg-[#c97b7b] hover:bg-[#b56868] text-white px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg shadow-[#c97b7b]/25 hover:shadow-xl hover:-translate-y-0.5 inline-block"
            >
              {t(locale, "shopCollection")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
