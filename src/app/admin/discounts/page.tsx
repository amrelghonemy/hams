"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDiscountsPage() {
  const { locale } = useLanguage();
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    min_order: "",
    max_uses: "",
    expires_at: "",
  });

  useEffect(() => {
    fetch("/api/admin/discounts")
      .then((r) => r.json())
      .then((d) => {
        setDiscounts(d.discounts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        value: parseFloat(form.value),
        min_order: parseFloat(form.min_order) || 0,
        max_uses: parseInt(form.max_uses) || null,
      }),
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display text-charcoal-700">
          {locale === "ar" ? "الخصومات" : "Discounts"}
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm"
        >
          + {locale === "ar" ? "إضافة خصم" : "Add Discount"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-soft p-6 mb-6 space-y-5"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Code *</label>
              <input
                required
                className="input-field font-mono"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
              />
            </div>
            <div>
              <label className="label-text">Type</label>
              <select
                className="input-field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="percentage">%</option>
                <option value="fixed">EGP</option>
              </select>
            </div>
            <div>
              <label className="label-text">Value *</label>
              <input
                required
                type="number"
                className="input-field"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Min Order</label>
              <input
                type="number"
                className="input-field"
                value={form.min_order}
                onChange={(e) =>
                  setForm({ ...form, min_order: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label-text">Max Uses</label>
              <input
                type="number"
                className="input-field"
                value={form.max_uses}
                onChange={(e) =>
                  setForm({ ...form, max_uses: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">
              {locale === "ar" ? "حفظ" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-ghost text-sm"
            >
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100/50">
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  Code
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  Type
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  Value
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  Uses
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d: any) => (
                <tr
                  key={d.id}
                  className="border-b border-cream-200/50 hover:bg-cream-100/30 transition-colors"
                >
                  <td className="p-4 font-mono font-medium text-charcoal-700">
                    {d.code}
                  </td>
                  <td className="p-4 text-charcoal-500">{d.type}</td>
                  <td className="p-4 font-medium text-charcoal-700">
                    {d.type === "percentage" ? `${d.value}%` : `${d.value} EGP`}
                  </td>
                  <td className="p-4 text-charcoal-500">
                    {d.used_count}/{d.max_uses || "∞"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        d.is_active
                          ? "bg-rose-100/60 text-blush-400"
                          : "bg-cream-300 text-charcoal-500"
                      }`}
                    >
                      {d.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {discounts.length === 0 && !loading && (
          <div className="p-12 text-center">
            <p className="text-charcoal-400">
              {locale === "ar" ? "لا توجد خصومات" : "No discounts"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
