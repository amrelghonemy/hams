"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminProductEditPage() {
  const params = useParams();
  const { locale } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products`)
      .then((r) => r.json())
      .then((data) => {
        const p = (data.products || []).find((x: any) => String(x.id) === String(params.id));
        if (p) {
          const parsedImages = typeof p.images === "string" ? JSON.parse(p.images || "[]") : (p.images || []);
          setForm({
            ...p,
            sizes: Array.isArray(p.sizes) ? p.sizes.join(", ") : JSON.parse(p.sizes || "[]").join(", "),
            colors: Array.isArray(p.colors) ? p.colors.join(", ") : JSON.parse(p.colors || "[]").join(", "),
            images: "",
          });
          setImageUrls(parsedImages);
        }
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/admin/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          name_en: form.name_en,
          name_ar: form.name_ar,
          price: parseFloat(form.price),
          sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
          stock: parseInt(form.stock) || 0,
          sizes: JSON.stringify(form.sizes.split(",").map((s: string) => s.trim())),
          colors: JSON.stringify(form.colors.split(",").map((c: string) => c.trim())),
          images: JSON.stringify([...imageUrls, ...form.images.split("\n").filter((u: string) => u.trim())]),
        }),
      });
      router.push("/admin/products");
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl shadow-soft p-6 animate-pulse">
            <div className="skeleton-title w-40 mb-4" />
            <div className="space-y-3">
              <div className="skeleton-text" />
              <div className="skeleton-text w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display text-charcoal-700 mb-8">
        {locale === "ar" ? "تعديل المنتج" : "Edit Product"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Name (EN)</label>
              <input
                className="input-field"
                value={form.name_en || ""}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">الاسم (AR)</label>
              <input
                className="input-field"
                value={form.name_ar || ""}
                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Price</label>
              <input
                type="number"
                className="input-field"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Sale Price</label>
              <input
                type="number"
                className="input-field"
                value={form.sale_price || ""}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Stock</label>
              <input
                type="number"
                className="input-field"
                value={form.stock || ""}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label-text">Sizes</label>
            <input
              className="input-field"
              value={form.sizes || ""}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">Colors</label>
            <input
              className="input-field"
              value={form.colors || ""}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">
              {locale === "ar" ? "رفع صور" : "Upload Images"}
            </label>
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
            <label className="label-text">
              {locale === "ar" ? "روابط صور إضافية" : "Additional Image URLs"} ({locale === "ar" ? "رابط لكل سطر" : "one per line"})
            </label>
            <textarea
              className="input-field h-24 font-mono text-xs resize-none"
              value={form.images || ""}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "..." : locale === "ar" ? "حفظ التعديلات" : "Save Changes"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </button>
        </div>
      </form>
    </div>
  );
}
