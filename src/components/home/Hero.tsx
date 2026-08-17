"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

export function Hero() {
  const { locale } = useLanguage();

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
          alt="Fashion"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container-custom w-full">
          <div className="max-w-2xl animate-fade-in">
            <p className="text-white/70 text-sm tracking-[0.3em] uppercase mb-4 font-light">
              {locale === "ar" ? "مجموعة جديدة" : "New Collection"}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white leading-tight mb-6">
              {t(locale, "heroTitle")}
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-md leading-relaxed">
              {t(locale, "heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                {t(locale, "shopNow")}
              </Link>
              <Link href="/shop?sort=newest" className="btn-white">
                {t(locale, "exploreCollection")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
