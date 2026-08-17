"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface AnalyticsData {
  summary: {
    totalEvents: number;
    pageViews: number;
    productViews: number;
    addToCarts: number;
    purchases: number;
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    conversionRate: string;
    cartAbandonmentRate: string;
  };
  eventCounts: Record<string, number>;
  dailyEvents: Record<string, Record<string, number>>;
}

const EVENT_LABELS: Record<string, { en: string; ar: string; icon: string; color: string }> = {
  page_view: { en: "Page Views", ar: "مشاهدات الصفحة", icon: "👁️", color: "bg-blue-50 text-blue-600" },
  view_content: { en: "Product Views", ar: "مشاهدات المنتج", icon: "📦", color: "bg-purple-50 text-purple-600" },
  add_to_cart: { en: "Add to Cart", ar: "أضيف للسلة", icon: "🛒", color: "bg-orange-50 text-orange-600" },
  remove_from_cart: { en: "Remove from Cart", ar: "حذف من السلة", icon: "🗑️", color: "bg-red-50 text-red-600" },
  initiate_checkout: { en: "Checkout Started", ar: "بدء الدفع", icon: "💳", color: "bg-yellow-50 text-yellow-600" },
  purchase: { en: "Purchases", ar: "المشتريات", icon: "✅", color: "bg-green-50 text-green-600" },
  search: { en: "Searches", ar: "البحث", icon: "🔍", color: "bg-teal-50 text-teal-600" },
};

export default function AdminAnalyticsPage() {
  const { locale } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "settings">("overview");
  const [pixelId, setPixelId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [testCode, setTestCode] = useState("");
  const [gaId, setGaId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => {
        if (!r.ok) throw new Error("auth");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setData({
          summary: { totalEvents: 0, pageViews: 0, productViews: 0, addToCarts: 0, purchases: 0, totalRevenue: 0, totalOrders: 0, completedOrders: 0, conversionRate: "0.00", cartAbandonmentRate: "0.00" },
          eventCounts: {},
          dailyEvents: {},
        });
        setLoading(false);
      });
  }, [days]);

  useEffect(() => {
    fetch("/api/admin/marketing-settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        setPixelId(s.meta_pixel_id || "");
        setAccessToken(s.meta_access_token || "");
        setTestCode(s.meta_test_event_code || "");
        setGaId(s.ga_measurement_id || "");
      });
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    await fetch("/api/admin/marketing-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meta_pixel_id: pixelId,
        meta_access_token: accessToken,
        meta_test_event_code: testCode,
        ga_measurement_id: gaId,
      }),
    });
    setSaving(false);
  };

  const summary = data?.summary;
  const statCards = summary
    ? [
        { label: locale === "ar" ? "مشاهدات الصفحة" : "Page Views", value: summary.pageViews.toLocaleString(), icon: "👁️", color: "bg-blue-50 border-blue-200" },
        { label: locale === "ar" ? "مشاهدات المنتج" : "Product Views", value: summary.productViews.toLocaleString(), icon: "📦", color: "bg-purple-50 border-purple-200" },
        { label: locale === "ar" ? "أضيف للسلة" : "Add to Cart", value: summary.addToCarts.toLocaleString(), icon: "🛒", color: "bg-orange-50 border-orange-200" },
        { label: locale === "ar" ? "المشتريات" : "Purchases", value: summary.purchases.toLocaleString(), icon: "✅", color: "bg-green-50 border-green-200" },
        { label: locale === "ar" ? "معدل التحويل" : "Conversion Rate", value: `${summary.conversionRate}%`, icon: "📈", color: "bg-rose-50 border-rose-200" },
        { label: locale === "ar" ? "إهمال السلة" : "Cart Abandonment", value: `${summary.cartAbandonmentRate}%`, icon: "📉", color: "bg-red-50 border-red-200" },
        { label: locale === "ar" ? "إجمالي الإيرادات" : "Total Revenue", value: `${summary.totalRevenue.toLocaleString()} EGP`, icon: "💰", color: "bg-emerald-50 border-emerald-200" },
        { label: locale === "ar" ? "الطلبات" : "Total Orders", value: summary.totalOrders.toLocaleString(), icon: "🛒", color: "bg-amber-50 border-amber-200" },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display text-charcoal-700">
          {locale === "ar" ? "التحليلات والتسويق" : "Analytics & Marketing"}
        </h1>
        <select
          className="input-field w-auto"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
        >
          <option value={7}>7 {locale === "ar" ? "أيام" : "days"}</option>
          <option value={30}>30 {locale === "ar" ? "يوم" : "days"}</option>
          <option value={90}>90 {locale === "ar" ? "يوم" : "days"}</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-cream-300 pb-3">
        {(["overview", "events", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              activeTab === tab
                ? "bg-blush-400 text-white"
                : "bg-cream-100 text-charcoal-500 hover:bg-cream-200"
            }`}
          >
            {tab === "overview"
              ? locale === "ar" ? "نظرة عامة" : "Overview"
              : tab === "events"
              ? locale === "ar" ? "الأحداث" : "Events"
              : locale === "ar" ? "الإعدادات" : "Settings"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-soft animate-pulse">
              <div className="h-4 bg-cream-200 rounded w-20 mb-3" />
              <div className="h-8 bg-cream-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Conversion Funnel */}
              <div className="bg-white rounded-3xl shadow-soft p-6 mb-6">
                <h2 className="font-semibold text-charcoal-700 mb-4">
                  {locale === "ar" ? "قمع التحويل" : "Conversion Funnel"}
                </h2>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {[
                    { label: locale === "ar" ? "مشاهدات" : "Views", count: summary?.pageViews || 0, pct: 100 },
                    { label: locale === "ar" ? "منتج" : "Products", count: summary?.productViews || 0, pct: summary?.pageViews ? ((summary?.productViews || 0) / summary.pageViews) * 100 : 0 },
                    { label: locale === "ar" ? "سلة" : "Cart", count: summary?.addToCarts || 0, pct: summary?.pageViews ? ((summary?.addToCarts || 0) / summary.pageViews) * 100 : 0 },
                    { label: locale === "ar" ? "شراء" : "Purchase", count: summary?.purchases || 0, pct: summary?.pageViews ? ((summary?.purchases || 0) / summary.pageViews) * 100 : 0 },
                  ].map((step, i) => (
                    <div key={i} className="flex-1 min-w-[100px]">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-charcoal-700">{step.count.toLocaleString()}</p>
                        <p className="text-xs text-charcoal-400 mt-1">{step.label}</p>
                        <div className="mt-2 h-2 bg-cream-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blush-400 rounded-full" style={{ width: `${Math.min(step.pct, 100)}%` }} />
                        </div>
                        <p className="text-[10px] text-charcoal-400 mt-1">{step.pct.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {statCards.map((card, i) => (
                  <div key={i} className={`rounded-2xl border p-5 ${card.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{card.icon}</span>
                      <span className="text-xs font-medium text-charcoal-500">{card.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-charcoal-700">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Daily Chart */}
              {data?.dailyEvents && Object.keys(data.dailyEvents).length > 0 && (
                <div className="bg-white rounded-3xl shadow-soft p-6">
                  <h2 className="font-semibold text-charcoal-700 mb-4">
                    {locale === "ar" ? "الأحداث اليومية" : "Daily Events"}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-charcoal-400 border-b border-cream-200">
                          <th className="text-start py-2 font-medium">{locale === "ar" ? "التاريخ" : "Date"}</th>
                          <th className="text-center py-2 font-medium">👁️</th>
                          <th className="text-center py-2 font-medium">📦</th>
                          <th className="text-center py-2 font-medium">🛒</th>
                          <th className="text-center py-2 font-medium">✅</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(data.dailyEvents)
                          .sort(([a], [b]) => b.localeCompare(a))
                          .slice(0, 14)
                          .map(([day, events]) => (
                            <tr key={day} className="border-b border-cream-100">
                              <td className="py-2 text-charcoal-600">{day}</td>
                              <td className="text-center py-2">{events.page_view || 0}</td>
                              <td className="text-center py-2">{events.view_content || 0}</td>
                              <td className="text-center py-2">{events.add_to_cart || 0}</td>
                              <td className="text-center py-2">{events.purchase || 0}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <h2 className="font-semibold text-charcoal-700 mb-4">
                {locale === "ar" ? "إحصائيات الأحداث" : "Event Statistics"}
              </h2>
              <div className="space-y-3">
                {Object.entries(data?.eventCounts || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, count]) => {
                    const meta = EVENT_LABELS[name] || { en: name, ar: name, icon: "📊", color: "bg-gray-50 text-gray-600" };
                    const maxCount = Math.max(...Object.values(data?.eventCounts || {}));
                    return (
                      <div key={name} className={`flex items-center gap-4 p-4 rounded-2xl ${meta.color}`}>
                        <span className="text-2xl">{meta.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{locale === "ar" ? meta.ar : meta.en}</span>
                            <span className="text-sm font-bold">{count.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                            <div className="h-full bg-current rounded-full opacity-40" style={{ width: `${(count / maxCount) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
                <h2 className="font-semibold text-charcoal-700 flex items-center gap-2">
                  <span className="text-xl">📘</span> Meta Pixel (Facebook)
                </h2>
                <div>
                  <label className="label-text">Pixel ID</label>
                  <input className="input-field" value={pixelId} onChange={(e) => setPixelId(e.target.value)} placeholder="1234567890123456" />
                </div>
                <div>
                  <label className="label-text">Conversions API Access Token</label>
                  <input className="input-field font-mono text-xs" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} placeholder="EAAx..." />
                </div>
                <div>
                  <label className="label-text">Test Event Code (optional)</label>
                  <input className="input-field" value={testCode} onChange={(e) => setTestCode(e.target.value)} placeholder="TEST1234" />
                </div>
                <p className="text-xs text-charcoal-400">
                  {locale === "ar"
                    ? "يتتبع الأحداث التلقائية: مشاهدة الصفحة، مشاهدة المنتج، أضف للسلة، بدء الدفع، الشراء"
                    : "Auto-tracks: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase"}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-soft p-6 space-y-5">
                <h2 className="font-semibold text-charcoal-700 flex items-center gap-2">
                  <span className="text-xl">📊</span> Google Analytics 4
                </h2>
                <div>
                  <label className="label-text">Measurement ID</label>
                  <input className="input-field" value={gaId} onChange={(e) => setGaId(e.target.value)} placeholder="G-XXXXXXXXXX" />
                </div>
              </div>

              <button onClick={saveSettings} className="btn-primary" disabled={saving}>
                {saving ? "..." : locale === "ar" ? "حفظ الإعدادات" : "Save Settings"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
