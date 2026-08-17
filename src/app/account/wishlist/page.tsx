"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

export default function WishlistPage() {
  const { items: wishlistIds, removeItem } = useWishlist();
  const { locale } = useLanguage();

  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl md:text-3xl font-display text-charcoal-700 mb-8">
        {t(locale, "wishlist")}
      </h1>
      {wishlistIds.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-soft-lg text-center py-20 px-8">
          <svg
            className="w-16 h-16 text-rose-200 mx-auto mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <p className="text-charcoal-400 mb-6 text-lg">
            {locale === "ar" ? "المفضلة فارغة" : "Your wishlist is empty"}
          </p>
          <Link href="/shop" className="btn-primary">
            {t(locale, "shopNow")}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft p-6">
          <p className="text-charcoal-400 text-sm">
            {wishlistIds.length}{" "}
            {locale === "ar" ? "منتجات في المفضلة" : "items in wishlist"}
          </p>
        </div>
      )}
    </div>
  );
}
