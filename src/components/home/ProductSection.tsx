"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductSectionProps {
  title: string;
  products: any[];
  viewAllHref?: string;
}

export function ProductSection({ title, products, viewAllHref = "/shop" }: ProductSectionProps) {
  const { locale } = useLanguage();

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h2 className="section-title">{title}</h2>
          <Link href={viewAllHref} className="text-sm font-medium text-charcoal-500 hover:text-charcoal-900 transition-colors flex items-center gap-1 group">
            {t(locale, "viewAll")}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
