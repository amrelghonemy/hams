"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminProductFormPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    slug: "",
    description_en: "",
    description_ar: "",
    price: "",
    sale_price: "",
    category_id: "",
    sku: "",
    stock: "",
    sizes: "S,M,L,XL",
    colors: "أسود,أبيض",
    images: "",
    is_new: false,
    is_bestseller: false,
    is_active: true,
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
          category_id: form.category_id ? parseInt(form.category_id) : null,
          stock: parseInt(form.stock) || 0,
          sizes: JSON.stringify(form.sizes.split(",").map((s) => s.trim())),
          colors: JSON.stringify(form.colors.split(",").map((c) => c.trim())),
          images: JSON.stringify(form.images.split("\n").filter((u) => u.trim())),
          is_new: form.is_new ? 1 : 0,
          is_bestseller: form.is_bestseller ? 1 : 0,
          is_active: form.is_active ? 1 : 0,
        }),
      });
      if (res.ok) router.push("/admin/products");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display text-charcoal-700 mb-8">
        {locale === "ar" ? "إضافة منتج جديد" : "Add New Product"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "البيانات الأساسية" : "Basic Info"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Name (EN) *</label>
              <input
                required
                className="input-field"
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">الاسم (AR) *</label>
              <input
                required
                className="input-field"
                value={form.name_ar}
                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label-text">Slug</label>
            <input
              className="input-field"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto-generated"
            />
          </div>
          <div>
            <label className="label-text">Description (EN)</label>
            <textarea
              className="input-field h-20 resize-none"
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">الوصف (AR)</label>
            <textarea
              className="input-field h-20 resize-none"
              value={form.description_ar}
              onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "السعر والمخزون" : "Pricing & Inventory"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Price *</label>
              <input
                required
                type="number"
                className="input-field"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Sale Price</label>
              <input
                type="number"
                className="input-field"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Stock *</label>
              <input
                required
                type="number"
                className="input-field"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">SKU</label>
              <input
                className="input-field"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">
                {locale === "ar" ? "القسم" : "Category"}
              </label>
              <select
                className="input-field"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">--</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {locale === "ar" ? c.name_ar : c.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "المقاسات والألوان" : "Sizes & Colors"}
          </h2>
          <div>
            <label className="label-text">
              {locale === "ar" ? "المقاسات" : "Sizes"} (comma separated)
            </label>
            <input
              className="input-field"
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">
              {locale === "ar" ? "الألوان" : "Colors"} (comma separated)
            </label>
            <input
              className="input-field"
              value={form.colors}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">
              {locale === "ar" ? "روابط الصور" : "Image URLs"} (one per line)
            </label>
            <textarea
              className="input-field h-32 font-mono text-xs resize-none"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "الإعدادات" : "Settings"}
          </h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2.5 text-sm text-charcoal-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_new}
                onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
                className="w-4 h-4 rounded border-cream-300 text-blush-400 focus:ring-rose-100"
              />
              {locale === "ar" ? "جديد" : "New"}
            </label>
            <label className="flex items-center gap-2.5 text-sm text-charcoal-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_bestseller}
                onChange={(e) => setForm({ ...form, is_bestseller: e.target.checked })}
                className="w-4 h-4 rounded border-cream-300 text-blush-400 focus:ring-rose-100"
              />
              {locale === "ar" ? "الأكثر مبيعاً" : "Bestseller"}
            </label>
            <label className="flex items-center gap-2.5 text-sm text-charcoal-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-cream-300 text-blush-400 focus:ring-rose-100"
              />
              {locale === "ar" ? "نشط" : "Active"}
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "..." : locale === "ar" ? "حفظ المنتج" : "Save Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </button>
        </div>
      </form>
    </div>
  );
}
