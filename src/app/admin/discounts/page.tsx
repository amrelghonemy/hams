"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDiscountsPage() {
  const { locale } = useLanguage();
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", min_order: "", max_uses: "", expires_at: "" });

  useEffect(() => {
    fetch("/api/admin/discounts").then((r) => r.json()).then((d) => setDiscounts(d.discounts || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, value: parseFloat(form.value), min_order: parseFloat(form.min_order) || 0, max_uses: parseInt(form.max_uses) || null }),
    });
    const data = await res.json();
    if (data.discount) {
      setDiscounts([...discounts, data.discount]);
      setShowForm(false);
      setForm({ code: "", type: "percentage", value: "", min_order: "", max_uses: "", expires_at: "" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display">{locale === "ar" ? "الخصومات" : "Discounts"}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">+ {locale === "ar" ? "إضافة خصم" : "Add Discount"}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="label-text">Code *</label><input required className="input-field" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
            <div><label className="label-text">Type</label><select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="percentage">%</option><option value="fixed">EGP</option></select></div>
            <div><label className="label-text">Value *</label><input required type="number" className="input-field" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-text">Min Order</label><input type="number" className="input-field" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} /></div>
            <div><label className="label-text">Max Uses</label><input type="number" className="input-field" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">{locale === "ar" ? "حفظ" : "Save"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
          </div>
        </form>
      )}

      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-charcoal-50"><th className="text-start p-3 font-medium">Code</th><th className="text-start p-3 font-medium">Type</th><th className="text-start p-3 font-medium">Value</th><th className="text-start p-3 font-medium">Uses</th><th className="text-start p-3 font-medium">Status</th></tr></thead>
          <tbody>
            {discounts.map((d: any) => (
              <tr key={d.id} className="border-b hover:bg-charcoal-50">
                <td className="p-3 font-mono">{d.code}</td>
                <td className="p-3">{d.type}</td>
                <td className="p-3">{d.type === "percentage" ? `${d.value}%` : `${d.value} EGP`}</td>
                <td className="p-3">{d.used_count}/{d.max_uses || "∞"}</td>
                <td className="p-3"><span className={`text-xs px-2 py-0.5 ${d.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{d.is_active ? "Active" : "Inactive"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
