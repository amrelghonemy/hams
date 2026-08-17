"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { SizeSelector } from "@/components/admin/SizeSelector";
import { TagsInput } from "@/components/admin/TagsInput";

const PRESET_TAGS = [
  "summer", "winter", "casual", "formal", "party", "office", "street",
  "cotton", "silk", "linen", "denim", "leather",
  "dress", "top", "set", "jumpsuit", "skirt", "pants", "cardigan",
  "new", "sale", "trending", "limited",
];

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
    sizes: ["S", "M", "L", "XL"],
    colors: "",
    images: "",
    is_new: false,
    is_bestseller: false,
    is_active: true,
    meta_title_en: "",
    meta_title_ar: "",
    meta_description_en: "",
    meta_description_ar: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

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
          sizes: JSON.stringify(form.sizes),
          colors: JSON.stringify(form.colors.split(",").filter((c) => c.trim()).map((c) => c.trim())),
          images: JSON.stringify([...imageUrls, ...form.images.split("\n").filter((u) => u.trim())]),
          tags: JSON.stringify(tags),
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

        {/* Basic Info */}
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "البيانات الأساسية" : "Basic Info"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Name (EN) *</label>
              <input required className="input-field" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
            </div>
            <div>
              <label className="label-text">الاسم (AR) *</label>
              <input required className="input-field" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label-text">Slug</label>
            <input className="input-field" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
          </div>
          <div>
            <label className="label-text">Description (EN)</label>
            <textarea className="input-field h-24 resize-none" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
          </div>
          <div>
            <label className="label-text">الوصف (AR)</label>
            <textarea className="input-field h-24 resize-none" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "السعر والمخزون" : "Pricing & Inventory"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Price (EGP) *</label>
              <input required type="number" step="0.01" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="label-text">Sale Price (EGP)</label>
              <input type="number" step="0.01" className="input-field" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
            </div>
            <div>
              <label className="label-text">Stock *</label>
              <input required type="number" className="input-field" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">SKU</label>
              <input className="input-field" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="HS-001" />
            </div>
            <div>
              <label className="label-text">{locale === "ar" ? "القسم" : "Category"}</label>
              <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="">--</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{locale === "ar" ? c.name_ar : c.name_en}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sizes & Colors */}
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "المقاسات والألوان" : "Sizes & Colors"}
          </h2>
          <SizeSelector
            selected={form.sizes}
            onChange={(sizes) => setForm({ ...form, sizes })}
            label={locale === "ar" ? "المقاسات" : "Sizes"}
          />
          <div>
            <label className="label-text">{locale === "ar" ? "الألوان" : "Colors"} (comma separated)</label>
            <input className="input-field" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="أسود, أبيض, وردي" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "الصور" : "Images"}
          </h2>
          <div>
            <label className="label-text">{locale === "ar" ? "رفع صور" : "Upload Images"}</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="input-field file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blush-400 file:text-white file:text-sm file:cursor-pointer file:font-medium"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files) return;
                setUploading(true);
                for (const file of Array.from(files)) {
                  const fd = new FormData();
                  fd.append("file", file);
                  try {
                    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                    const data = await res.json();
                    if (data.url) setImageUrls((prev) => [...prev, data.url]);
                  } catch (err) {
                    console.error(err);
                  }
                }
                setUploading(false);
              }}
            />
            {uploading && <p className="text-xs text-charcoal-400 mt-2">{locale === "ar" ? "جاري الرفع..." : "Uploading..."}</p>}
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-cream-300" />
                    <button
                      type="button"
                      onClick={() => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="label-text">{locale === "ar" ? "روابط صور إضافية" : "Image URLs"} ({locale === "ar" ? "رابط لكل سطر" : "one per line"})</label>
            <textarea className="input-field h-24 font-mono text-xs resize-none" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "الوسوم" : "Tags"}
          </h2>
          <TagsInput
            tags={tags}
            onChange={setTags}
            label={locale === "ar" ? "وسوم المنتج" : "Product Tags"}
            placeholder={locale === "ar" ? "أضف وسوم وافتح Enter" : "Add tags and press Enter"}
          />
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTags([...tags, tag])}
                className="px-2.5 py-1 bg-cream-100 hover:bg-rose-50 text-charcoal-500 text-xs rounded-lg transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* SEO / Meta */}
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "تحسين محركات البحث (SEO)" : "SEO Metadata"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Meta Title (EN)</label>
              <input className="input-field" value={form.meta_title_en} onChange={(e) => setForm({ ...form, meta_title_en: e.target.value })} placeholder="Product page title for Google" />
            </div>
            <div>
              <label className="label-text">العنوان (AR)</label>
              <input className="input-field" value={form.meta_title_ar} onChange={(e) => setForm({ ...form, meta_title_ar: e.target.value })} placeholder="عنوان صفحة المنتج لجوجل" />
            </div>
          </div>
          <div>
            <label className="label-text">Meta Description (EN)</label>
            <textarea className="input-field h-16 resize-none" value={form.meta_description_en} onChange={(e) => setForm({ ...form, meta_description_en: e.target.value })} placeholder="Short description for search results (150-160 chars)" />
          </div>
          <div>
            <label className="label-text">الوصف (AR)</label>
            <textarea className="input-field h-16 resize-none" value={form.meta_description_ar} onChange={(e) => setForm({ ...form, meta_description_ar: e.target.value })} placeholder="وصف مختصر لنتائج البحث" />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <h2 className="font-semibold text-charcoal-700">
            {locale === "ar" ? "الإعدادات" : "Settings"}
          </h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2.5 text-sm text-charcoal-600 cursor-pointer">
              <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="w-4 h-4 rounded border-cream-300 text-blush-400 focus:ring-rose-100" />
              {locale === "ar" ? "جديد" : "New Arrival"}
            </label>
            <label className="flex items-center gap-2.5 text-sm text-charcoal-600 cursor-pointer">
              <input type="checkbox" checked={form.is_bestseller} onChange={(e) => setForm({ ...form, is_bestseller: e.target.checked })} className="w-4 h-4 rounded border-cream-300 text-blush-400 focus:ring-rose-100" />
              {locale === "ar" ? "الأكثر مبيعاً" : "Bestseller"}
            </label>
            <label className="flex items-center gap-2.5 text-sm text-charcoal-600 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-cream-300 text-blush-400 focus:ring-rose-100" />
              {locale === "ar" ? "نشط (يظهر في المتجر)" : "Active (visible in shop)"}
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
