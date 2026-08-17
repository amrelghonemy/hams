"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { locale } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const statusColors: Record<string, string> = {
    pending: "bg-peach-100/60 text-peach-300",
    confirmed: "bg-mauve-100/60 text-mauve-300",
    preparing: "bg-rose-100/60 text-blush-400",
    shipped: "bg-blush-100/60 text-blush-400",
    delivered: "bg-rose-100/60 text-blush-400",
    cancelled: "bg-cream-300 text-charcoal-500",
  };

  const statusLabels: Record<string, { en: string; ar: string }> = {
    pending: { en: "Pending", ar: "قيد الانتظار" },
    confirmed: { en: "Confirmed", ar: "مؤكد" },
    preparing: { en: "Preparing", ar: "جاري التجهيز" },
    shipped: { en: "Shipped", ar: "تم الشحن" },
    delivered: { en: "Delivered", ar: "تم التوصيل" },
    cancelled: { en: "Cancelled", ar: "ملغي" },
  };

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal-700 mb-8">
        {locale === "ar" ? "الطلبات" : "Orders"}
      </h1>
      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100/50">
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  #
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "العميل" : "Customer"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "الإجمالي" : "Total"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "الحالة" : "Status"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "التاريخ" : "Date"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "إجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-cream-200/50 hover:bg-cream-100/30 transition-colors"
                >
                  <td className="p-4 font-mono text-xs text-charcoal-500">
                    {o.order_number}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-charcoal-700">{o.customer_name}</p>
                    <p className="text-xs text-charcoal-400 mt-0.5">{o.customer_phone}</p>
                  </td>
                  <td className="p-4 font-medium text-charcoal-700">
                    {formatPrice(o.total, locale)}
                  </td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 cursor-pointer ${
                        statusColors[o.status] || ""
                      }`}
                    >
                      {Object.entries(statusLabels).map(([key, val]) => (
                        <option key={key} value={key}>
                          {locale === "ar" ? val.ar : val.en}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-xs text-charcoal-400">
                    {new Date(o.created_at).toLocaleDateString(
                      locale === "ar" ? "ar-EG" : "en-US"
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-charcoal-400 font-medium">
                      {o.payment_method === "cod" ? "COD" : "Card"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && !loading && (
          <div className="p-12 text-center">
            <p className="text-charcoal-400">
              {locale === "ar" ? "لا توجد طلبات" : "No orders yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
