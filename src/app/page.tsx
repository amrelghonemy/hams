"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/Categories";
import { ProductSection } from "@/components/home/ProductSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { WhyUs } from "@/components/home/WhyUs";
import { InstagramSection } from "@/components/home/InstagramSection";

export default function HomePage() {
  const { locale } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const newArrivals = products.filter((p) => p.is_new === 1);
  const bestSellers = products.filter((p) => p.is_bestseller === 1);

  return (
    <>
      <Hero />
      <FeaturedCategories />

      {!loading && newArrivals.length > 0 && (
        <ProductSection
          title={t(locale, "newArrivals")}
          products={newArrivals}
          viewAllHref="/shop?sort=newest"
        />
      )}

      <PromoBanner />

      {!loading && bestSellers.length > 0 && (
        <ProductSection
          title={t(locale, "bestSellers")}
          products={bestSellers}
          viewAllHref="/shop?sort=bestseller"
        />
      )}

      <WhyUs />
      <InstagramSection />
    </>
  );
}
