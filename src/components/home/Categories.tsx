"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

const categories = [
  {
    slug: "dresses",
    name_en: "Dresses",
    name_ar: "فساتين",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    slug: "tops",
    name_en: "Tops",
    name_ar: "بلوزات",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
  },
  {
    slug: "pants",
    name_en: "Pants",
    name_ar: "بناطيل",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
  {
    slug: "sets",
    name_en: "Sets",
    name_ar: "طقم كامل",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  },
  {
    slug: "outerwear",
    name_en: "Outerwear",
    name_ar: "عبايات",
    image: "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600&q=80",
  },
  {
    slug: "accessories",
    name_en: "Accessories",
    name_ar: "إكسسوارات",
    image: "https://images.unsplash.com/photo-1502716119720-b23a1e3b8b11?w=600&q=80",
  },
];

export function FeaturedCategories() {
  const { locale } = useLanguage();

  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="section-title">{t(locale, "featuredCategories")}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-charcoal-50"
            >
              <Image
                src={cat.image}
                alt={locale === "ar" ? cat.name_ar : cat.name_en}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-display text-lg md:text-xl mb-1">
                  {locale === "ar" ? cat.name_ar : cat.name_en}
                </h3>
                <span className="text-white/70 text-xs tracking-wider uppercase">
                  {t(locale, "shopNow")}
                </span>
              </div>
              <div className="absolute bottom-4 inset-x-0 text-center group-hover:opacity-0 transition-opacity">
                <h3 className="text-charcoal-900 font-display text-base md:text-lg bg-white/80 backdrop-blur-sm inline-block px-4 py-1.5">
                  {locale === "ar" ? cat.name_ar : cat.name_en}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
