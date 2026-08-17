"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import AdminLayout from "../layout";

export default function AdminProductsPage() {
  const { locale } = useLanguage();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(locale === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display">{locale === "ar" ? "المنتجات" : "Products"}</h1>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          + {locale === "ar" ? "إضافة منتج" : "Add Product"}
        </Link>
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-charcoal-50">
              <th className="text-start p-3 font-medium">{locale === "ar" ? "المنتج" : "Product"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "السعر" : "Price"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "المخزون" : "Stock"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "الحالة" : "Status"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-charcoal-50">
                <td className="p-3">
                  <p className="font-medium">{locale === "ar" ? p.name_ar : p.name_en}</p>
                  <p className="text-xs text-charcoal-400">{p.sku}</p>
                </td>
                <td className="p-3">{p.sale_price || p.price} EGP</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 ${p.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 ${p.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {p.is_active ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "معطل" : "Inactive")}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-blue-600 hover:underline text-xs">
                      {locale === "ar" ? "تعديل" : "Edit"}
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-xs">
                      {locale === "ar" ? "حذف" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !loading && (
          <p className="p-8 text-center text-charcoal-400">{locale === "ar" ? "لا توجد منتجات" : "No products"}</p>
        )}
      </div>
    </div>
  );
}
