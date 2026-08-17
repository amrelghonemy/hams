"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

export function Hero() {
  const { locale } = useLanguage();

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden rounded-b-[3rem]">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
          alt="Fashion"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5c3a3a]/70 via-[#8c6262]/30 to-[#f5e6e0]/20" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="container-custom w-full">
          <div className="max-w-2xl animate-fade-in">
            <p className="text-[#f5e6e0]/80 text-sm tracking-[0.3em] uppercase mb-4 font-light">
              {locale === "ar" ? "مجموعة جديدة" : "New Collection"}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white leading-tight mb-6 drop-shadow-lg">
              {t(locale, "heroTitle")}
            </h1>
            <p className="text-[#fae8e4]/90 text-base md:text-lg mb-8 max-w-md leading-relaxed">
              {t(locale, "heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="bg-[#c97b7b] hover:bg-[#b56868] text-white px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg shadow-[#c97b7b]/25 hover:shadow-xl hover:shadow-[#c97b7b]/30 hover:-translate-y-0.5"
              >
                {t(locale, "shopNow")}
              </Link>
              <Link
                href="/shop?sort=newest"
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-[#8c6262] px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg shadow-black/5 hover:-translate-y-0.5"
              >
                {t(locale, "exploreCollection")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
