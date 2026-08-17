"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { t } from "@/lib/i18n";

interface ProductCardProps {
  product: {
    id: number;
    name_en: string;
    name_ar: string;
    slug: string;
    price: number;
    sale_price: number | null;
    images: string;
    sizes: string;
    colors: string;
    is_new: number;
    is_bestseller: number;
    rating: number;
    review_count: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale } = useLanguage();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addItem } = useCart();

  const images = JSON.parse(product.images || "[]");
  const sizes = JSON.parse(product.sizes || "[]");
  const colors = JSON.parse(product.colors || "[]");
  const discount = product.sale_price ? getDiscountPercentage(product.price, product.sale_price) : 0;
  const inWishlist = isInWishlist(product.id);
  const name = locale === "ar" ? product.name_ar : product.name_en;
  const imageUrl = images[0] || "https://placehold.co/600x800/f3ede8/5d453d?text=Hams+Style";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name_en: product.name_en,
      name_ar: product.name_ar,
      price: product.price,
      sale_price: product.sale_price,
      image: imageUrl,
      size: sizes[0] || "",
      color: colors[0] || "",
      quantity: 1,
      stock: 10,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-blush-50 shadow-[0_4px_20px_rgba(219,166,166,0.15)] hover:shadow-[0_8px_32px_rgba(219,166,166,0.25)] transition-shadow duration-500">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {product.is_new === 1 && (
          <span className="absolute top-3 left-3 z-10 px-3 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-rose-400 text-white shadow-sm">
            {t(locale, "new")}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 z-10 px-3 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-blush-400 text-white shadow-sm">
            -{discount}%
          </span>
        )}
        {product.is_bestseller === 1 && !product.is_new && discount === 0 && (
          <span className="absolute top-3 left-3 z-10 px-3 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-mauve-400 text-white shadow-sm">
            {locale === "ar" ? "الأكثر مبيعاً" : "Bestseller"}
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        <div className="absolute inset-x-0 bottom-0 p-4 flex items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-white/95 backdrop-blur-sm text-rose-700 text-xs font-semibold py-2.5 rounded-full hover:bg-rose-400 hover:text-white transition-all duration-300 shadow-md"
          >
            {t(locale, "addToCart")}
          </button>
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 ${
              inWishlist
                ? "text-rose-500 hover:bg-rose-50"
                : "text-charcoal-400 hover:text-rose-500 hover:bg-rose-50"
            }`}
          >
            <svg className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pt-3 px-1">
        <h3 className="text-sm font-medium text-charcoal-800 line-clamp-1 group-hover:text-rose-600 transition-colors duration-300">
          {name}
        </h3>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(product.rating) ? "text-amber-400" : "text-blush-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-charcoal-400">({product.review_count})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-sm font-semibold ${discount > 0 ? "text-blush-500" : "text-charcoal-900"}`}>
            {formatPrice(product.sale_price || product.price, locale)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-charcoal-400 line-through">
              {formatPrice(product.price, locale)}
            </span>
          )}
        </div>

        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {colors.slice(0, 4).map((color: string, i: number) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] text-charcoal-400">+{colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
