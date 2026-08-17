"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

function TrackingContent() {
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders?order_number=${orderNumber}&phone=${phone}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        setError(locale === "ar" ? "الطلب غير موجود" : "Order not found");
      }
    } catch {
      setError(locale === "ar" ? "حدث خطأ" : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    { key: "pending", label: t(locale, "orderPlaced") },
    { key: "confirmed", label: t(locale, "confirmed") },
    { key: "preparing", label: t(locale, "preparing") },
    { key: "shipped", label: t(locale, "shipped") },
    { key: "delivered", label: t(locale, "delivered") },
  ];

  const statusOrder: Record<string, number> = {
    pending: 0, confirmed: 1, preparing: 2, shipped: 3, delivered: 4, cancelled: -1,
  };

  const currentStep = order ? statusOrder[order.status] ?? 0 : 0;

  return (
    <div className="container-custom py-12 md:py-20 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-display text-charcoal-900 text-center mb-8">{t(locale, "orderTracking")}</h1>

      <form onSubmit={handleTrack} className="bg-white p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label-text">{t(locale, "orderNumber")}</label>
            <input type="text" required className="input-field" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
          </div>
          <div>
            <label className="label-text">{t(locale, "mobileNumber")}</label>
            <input type="tel" required className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "..." : t(locale, "track")}
        </button>
        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
      </form>

      {order && (
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-charcoal-400">{t(locale, "orderNumber")}</p>
              <p className="font-semibold">{order.order_number}</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-charcoal-50">{order.total} EGP</span>
          </div>

          <div className="space-y-0">
            {statuses.map((s, i) => {
              const isActive = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={s.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      isActive ? "bg-charcoal-900 text-white" : "bg-charcoal-100 text-charcoal-400"
                    } ${isCurrent ? "ring-4 ring-charcoal-100" : ""}`}>
                      {isActive ? "✓" : i + 1}
                    </div>
                    {i < statuses.length - 1 && (
                      <div className={`w-0.5 h-10 ${isActive ? "bg-charcoal-900" : "bg-charcoal-100"}`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm font-medium ${isActive ? "text-charcoal-900" : "text-charcoal-400"}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-12 md:py-20 max-w-2xl">
        <div className="h-8 bg-charcoal-100 rounded w-1/2 mx-auto mb-8 animate-pulse" />
        <div className="bg-white p-6 animate-pulse">
          <div className="h-4 bg-charcoal-100 rounded w-1/3 mb-4" />
          <div className="h-10 bg-charcoal-100 rounded w-full mb-4" />
          <div className="h-10 bg-charcoal-100 rounded w-full" />
        </div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
