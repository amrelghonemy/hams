"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminCategoriesPage() {
  const { locale } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name_en: "", name_ar: "", slug: "", description_en: "", description_ar: "" });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => { setCategories(data.categories || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.category) {
      setCategories([...categories, data.category]);
      setForm({ name_en: "", name_ar: "", slug: "", description_en: "", description_ar: "" });
      setShowForm(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display">{locale === "ar" ? "الأقسام" : "Categories"}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          + {locale === "ar" ? "إضافة قسم" : "Add Category"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-text">Name (EN) *</label><input required className="input-field" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></div>
            <div><label className="label-text">الاسم (AR) *</label><input required className="input-field" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></div>
          </div>
          <div><label className="label-text">Slug</label><input className="input-field" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">{locale === "ar" ? "حفظ" : "Save"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
          </div>
        </form>
      )}

      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-charcoal-50">
              <th className="text-start p-3 font-medium">EN</th>
              <th className="text-start p-3 font-medium">AR</th>
              <th className="text-start p-3 font-medium">Slug</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-charcoal-50">
                <td className="p-3">{c.name_en}</td>
                <td className="p-3">{c.name_ar}</td>
                <td className="p-3 text-charcoal-400 font-mono text-xs">{c.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
