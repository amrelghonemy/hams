"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminCustomersPage() {
  const { locale } = useLanguage();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal-700 mb-8">
        {locale === "ar" ? "العملاء" : "Customers"}
      </h1>
      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100/50">
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "الاسم" : "Name"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "البريد" : "Email"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "الهاتف" : "Phone"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "عدد الطلبات" : "Orders"}
                </th>
                <th className="text-start p-4 font-medium text-charcoal-500 uppercase tracking-wider text-xs">
                  {locale === "ar" ? "الإنفاق" : "Spent"}
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr
                  key={c.id}
                  className="border-b border-cream-200/50 hover:bg-cream-100/30 transition-colors"
                >
                  <td className="p-4 font-medium text-charcoal-700">{c.name}</td>
                  <td className="p-4 text-charcoal-400">{c.email}</td>
                  <td className="p-4 text-charcoal-500">{c.phone || "-"}</td>
                  <td className="p-4 text-charcoal-500">{c.order_count || 0}</td>
                  <td className="p-4 text-charcoal-500">
                    {c.total_spent
                      ? `${c.total_spent.toLocaleString()} EGP`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && !loading && (
          <div className="p-12 text-center">
            <p className="text-charcoal-400">
              {locale === "ar" ? "لا يوجد عملاء" : "No customers"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
