"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";
import { ProductCard } from "@/components/product/ProductCard";

export default function ShopContent() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (currentCategory) params.set("category", currentCategory);
    if (currentSort) params.set("sort", currentSort);
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", currentPage.toString());

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentSort, currentSearch, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const categories = [
    { slug: "", name: locale === "ar" ? "الكل" : "All" },
    { slug: "dresses", name: locale === "ar" ? "فساتين" : "Dresses" },
    { slug: "tops", name: locale === "ar" ? "بلوزات" : "Tops" },
    { slug: "pants", name: locale === "ar" ? "بناطيل" : "Pants" },
    { slug: "sets", name: locale === "ar" ? "طقم كامل" : "Sets" },
    { slug: "outerwear", name: locale === "ar" ? "عبايات" : "Outerwear" },
    { slug: "accessories", name: locale === "ar" ? "إكسسوارات" : "Accessories" },
  ];

  const sortOptions = [
    { value: "newest", label: t(locale, "newest") },
    { value: "price_asc", label: t(locale, "priceLowToHigh") },
    { value: "price_desc", label: t(locale, "priceHighToLow") },
    { value: "top_rated", label: t(locale, "topRated") },
    { value: "bestseller", label: locale === "ar" ? "الأكثر مبيعاً" : "Best Sellers" },
  ];

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display text-charcoal-900">
          {currentCategory
            ? categories.find((c) => c.slug === currentCategory)?.name || t(locale, "shop")
            : currentSearch
            ? `${locale === "ar" ? "نتائج البحث:" : "Search:"} ${currentSearch}`
            : t(locale, "shop")}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-charcoal-900 uppercase tracking-wider mb-3">
                {t(locale, "categories")}
              </h3>
              <ul className="space-y-1.5">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => updateParam("category", cat.slug)}
                      className={`w-full text-start text-sm py-1.5 px-3 transition-colors ${
                        currentCategory === cat.slug
                          ? "text-charcoal-900 font-medium bg-charcoal-50"
                          : "text-charcoal-500 hover:text-charcoal-900"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-charcoal-900 uppercase tracking-wider mb-3">
                {locale === "ar" ? "نطاق السعر" : "Price Range"}
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={locale === "ar" ? "من" : "Min"}
                  className="input-field text-sm py-2"
                  onBlur={(e) => updateParam("minPrice", e.target.value)}
                />
                <span className="text-charcoal-400">-</span>
                <input
                  type="number"
                  placeholder={locale === "ar" ? "إلى" : "Max"}
                  className="input-field text-sm py-2"
                  onBlur={(e) => updateParam("maxPrice", e.target.value)}
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden btn-ghost text-sm"
            >
              <svg className="w-5 h-5 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              {t(locale, "filterBy")}
            </button>
            <p className="text-sm text-charcoal-500">
              {products.length} {t(locale, "products")}
            </p>
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="input-field text-sm py-2 w-auto max-w-[200px]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="skeleton-image" />
                  <div className="p-3 space-y-2">
                    <div className="skeleton-text" />
                    <div className="skeleton w-1/3 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-charcoal-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-charcoal-500">{t(locale, "noProducts")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam("page", (i + 1).toString())}
                  className={`w-10 h-10 text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-charcoal-900 text-white"
                      : "bg-white text-charcoal-600 hover:bg-charcoal-50 border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 start-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{t(locale, "filterBy")}</h2>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">{t(locale, "categories")}</h3>
                <ul className="space-y-1.5">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <button
                        onClick={() => {
                          updateParam("category", cat.slug);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-start text-sm py-2 px-3 rounded ${
                          currentCategory === cat.slug ? "bg-charcoal-50 font-medium" : ""
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">{locale === "ar" ? "نطاق السعر" : "Price Range"}</h3>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="input-field text-sm py-2" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="input-field text-sm py-2" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
