"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

const instagramImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
  "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
];

export function InstagramSection() {
  const { locale } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#fdf6f3]">
      <div className="container-custom text-center mb-8">
        <h2 className="section-title">{t(locale, "followUs")}</h2>
        <p className="section-subtitle">{t(locale, "followSubtitle")}</p>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 px-4 md:px-8">
        {instagramImages.map((img, i) => (
          <a
            key={i}
            href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-md shadow-[#d4a5a5]/10 hover:shadow-lg hover:shadow-[#c97b7b]/20 transition-all duration-400"
          >
            <img
              src={img}
              alt={`Instagram ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#c97b7b]/0 to-[#c97b7b]/0 group-hover:from-[#c97b7b]/50 group-hover:to-transparent transition-all duration-300 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
          </a>
        ))}
      </div>
      <div className="text-center mt-10">
        <a
          href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c97b7b] hover:text-[#a85c5c] text-sm font-medium inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#c97b7b]/30 hover:border-[#c97b7b]/60 hover:bg-[#f5e6e0]/50 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          @hamss_tyle
        </a>
      </div>
    </section>
  );
}
