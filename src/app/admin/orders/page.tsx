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
      .then((data) => { setOrders(data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders(orders.map((o) => o.id === id ? { ...o, status } : o));
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    preparing: "bg-purple-50 text-purple-700",
    shipped: "bg-indigo-50 text-indigo-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
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
      <h1 className="text-2xl font-display mb-6">{locale === "ar" ? "الطلبات" : "Orders"}</h1>
      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-charcoal-50">
              <th className="text-start p-3 font-medium">#</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "العميل" : "Customer"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "الإجمالي" : "Total"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "الحالة" : "Status"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "التاريخ" : "Date"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-charcoal-50">
                <td className="p-3 font-mono text-xs">{o.order_number}</td>
                <td className="p-3">
                  <p>{o.customer_name}</p>
                  <p className="text-xs text-charcoal-400">{o.customer_phone}</p>
                </td>
                <td className="p-3 font-medium">{formatPrice(o.total, locale)}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`text-xs px-2 py-1 border-0 font-medium ${statusColors[o.status] || ""}`}
                  >
                    {Object.entries(statusLabels).map(([key, val]) => (
                      <option key={key} value={key}>{locale === "ar" ? val.ar : val.en}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-xs text-charcoal-400">
                  {new Date(o.created_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
                </td>
                <td className="p-3">
                  <span className="text-xs text-charcoal-400">{o.payment_method === "cod" ? "COD" : "Card"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && (
          <p className="p-8 text-center text-charcoal-400">{locale === "ar" ? "لا توجد طلبات" : "No orders yet"}</p>
        )}
      </div>
    </div>
  );
}
