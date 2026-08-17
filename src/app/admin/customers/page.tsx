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
      .then((data) => { setCustomers(data.customers || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-display mb-6">{locale === "ar" ? "العملاء" : "Customers"}</h1>
      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-charcoal-50">
              <th className="text-start p-3 font-medium">{locale === "ar" ? "الاسم" : "Name"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "البريد" : "Email"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "الهاتف" : "Phone"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "عدد الطلبات" : "Orders"}</th>
              <th className="text-start p-3 font-medium">{locale === "ar" ? "الإنفاق" : "Spent"}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-charcoal-50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-charcoal-500">{c.email}</td>
                <td className="p-3">{c.phone || "-"}</td>
                <td className="p-3">{c.order_count || 0}</td>
                <td className="p-3">{c.total_spent ? `${c.total_spent.toLocaleString()} EGP` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && !loading && (
          <p className="p-8 text-center text-charcoal-400">{locale === "ar" ? "لا يوجد عملاء" : "No customers"}</p>
        )}
      </div>
    </div>
  );
}
