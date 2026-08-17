"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminProductsPage() {
  const { locale } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(locale === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display text-charcoal-700">
          {locale === "ar" ? "المنتجات" : "Products"}
        </h1>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          + {locale === "ar" ? "إضافة منتج" : "Add Product"}
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100/50">
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "المنتج" : "Product"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "السعر" : "Price"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "المخزون" : "Stock"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "الحالة" : "Status"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "إجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-cream-200/50 hover:bg-cream-100/30 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-charcoal-700">
                      {locale === "ar" ? p.name_ar : p.name_en}
                    </p>
                    <p className="text-xs text-charcoal-400 mt-0.5">{p.sku}</p>
                  </td>
                  <td className="p-4 font-medium text-charcoal-700">
                    {p.sale_price || p.price} EGP
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        p.stock > 0
                          ? "bg-rose-100/60 text-blush-400"
                          : "bg-cream-300 text-charcoal-500"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        p.is_active
                          ? "bg-rose-100/60 text-blush-400"
                          : "bg-cream-300 text-charcoal-500"
                      }`}
                    >
                      {p.is_active
                        ? locale === "ar"
                          ? "نشط"
                          : "Active"
                        : locale === "ar"
                        ? "معطل"
                        : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-xs font-medium text-blush-400 hover:text-blush-300 transition-colors"
                      >
                        {locale === "ar" ? "تعديل" : "Edit"}
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-xs font-medium text-charcoal-400 hover:text-blush-400 transition-colors"
                      >
                        {locale === "ar" ? "حذف" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && !loading && (
          <div className="p-12 text-center">
            <p className="text-charcoal-400">
              {locale === "ar" ? "لا توجد منتجات" : "No products"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
