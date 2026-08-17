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

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          const p = data.product;
          setForm({
            ...p,
            sizes: JSON.parse(p.sizes || "[]").join(", "),
            colors: JSON.parse(p.colors || "[]").join(", "),
            images: JSON.parse(p.images || "[]").join("\n"),
          });
        }
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
          stock: parseInt(form.stock) || 0,
          sizes: JSON.stringify(form.sizes.split(",").map((s: string) => s.trim())),
          colors: JSON.stringify(form.colors.split(",").map((c: string) => c.trim())),
          images: JSON.stringify(form.images.split("\n").filter((u: string) => u.trim())),
        }),
      });
      router.push("/admin/products");
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display mb-6">{locale === "ar" ? "تعديل المنتج" : "Edit Product"}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-text">Name (EN)</label><input className="input-field" value={form.name_en || ""} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></div>
            <div><label className="label-text">الاسم (AR)</label><input className="input-field" value={form.name_ar || ""} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="label-text">Price</label><input type="number" className="input-field" value={form.price || ""} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div><label className="label-text">Sale Price</label><input type="number" className="input-field" value={form.sale_price || ""} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} /></div>
            <div><label className="label-text">Stock</label><input type="number" className="input-field" value={form.stock || ""} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          </div>
          <div><label className="label-text">Sizes</label><input className="input-field" value={form.sizes || ""} onChange={(e) => setForm({ ...form, sizes: e.target.value })} /></div>
          <div><label className="label-text">Colors</label><input className="input-field" value={form.colors || ""} onChange={(e) => setForm({ ...form, colors: e.target.value })} /></div>
          <div><label className="label-text">Images (URLs, one per line)</label><textarea className="input-field h-32 font-mono text-xs" value={form.images || ""} onChange={(e) => setForm({ ...form, images: e.target.value })} /></div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? "..." : (locale === "ar" ? "حفظ التعديلات" : "Save Changes")}</button>
          <button type="button" onClick={() => router.back()} className="btn-ghost">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
        </div>
      </form>
    </div>
  );
}
