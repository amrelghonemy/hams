"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAnalytics } from "@/context/AnalyticsContext";
import { t } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { governorates } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingCost, clearCart } = useCart();
  const { locale } = useLanguage();
  const { trackInitiateCheckout, trackPurchase } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tracked, setTracked] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    governorate: "",
    city: "",
    area: "",
    street: "",
    building: "",
    apartment: "",
    address_notes: "",
    payment_method: "cod",
  });

  const total = subtotal - discountAmount + shippingCost;

  useEffect(() => {
    if (items.length > 0 && !tracked) {
      trackInitiateCheckout(
        items.map((item) => ({
          id: String(item.productId),
          name: locale === "ar" ? item.name_ar : item.name_en,
          price: item.sale_price || item.price,
          quantity: item.quantity,
        })),
        subtotal
      );
      setTracked(true);
    }
  }, [items, tracked]);

  const handleApplyDiscount = async () => {
    if (!discountCode) return;
    try {
      const res = await fetch(`/api/discounts?code=${discountCode}&subtotal=${subtotal}`);
      const data = await res.json();
      if (data.discount) {
        setDiscountAmount(data.discount.amount);
      }
    } catch {
      setDiscountAmount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            product_id: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
          discount_code: discountCode || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        trackPurchase(
          data.order.order_number,
          items.map((item) => ({
            id: String(item.productId),
            name: locale === "ar" ? item.name_ar : item.name_en,
            price: item.sale_price || item.price,
            quantity: item.quantity,
          })),
          total
        );
        clearCart();
        router.push(`/confirmation?order=${data.order.order_number}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="bg-white rounded-3xl shadow-soft p-12 max-w-md mx-auto">
          <p className="text-charcoal-500 mb-4">{locale === "ar" ? "سلتك فارغة" : "Your cart is empty"}</p>
          <a href="/shop" className="btn-primary rounded-full">{t(locale, "shopNow")}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-display text-blush-400 text-center mb-10">
        {t(locale, "proceedToCheckout")}
      </h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="text-lg font-display text-blush-400 mb-5">{t(locale, "customerInfo")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">{t(locale, "fullName")} *</label>
                <input
                  type="text"
                  required
                  className="input-field rounded-xl"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "mobileNumber")} *</label>
                <input
                  type="tel"
                  required
                  className="input-field rounded-xl"
                  placeholder="01XXXXXXXXX"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">{t(locale, "email")}</label>
                <input
                  type="email"
                  className="input-field rounded-xl"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="text-lg font-display text-blush-400 mb-5">{t(locale, "deliveryAddress")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">{t(locale, "governorate")} *</label>
                <select
                  required
                  className="input-field rounded-xl cursor-pointer"
                  value={form.governorate}
                  onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                >
                  <option value="">{locale === "ar" ? "اختر المحافظة" : "Select"}</option>
                  {governorates.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">{t(locale, "city")} *</label>
                <input
                  type="text"
                  required
                  className="input-field rounded-xl"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "area")}</label>
                <input
                  type="text"
                  className="input-field rounded-xl"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "street")} *</label>
                <input
                  type="text"
                  required
                  className="input-field rounded-xl"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "building")}</label>
                <input
                  type="text"
                  className="input-field rounded-xl"
                  value={form.building}
                  onChange={(e) => setForm({ ...form, building: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "apartment")}</label>
                <input
                  type="text"
                  className="input-field rounded-xl"
                  value={form.apartment}
                  onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">{t(locale, "additionalNotes")}</label>
                <textarea
                  className="input-field h-20 resize-none rounded-xl"
                  value={form.address_notes}
                  onChange={(e) => setForm({ ...form, address_notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="text-lg font-display text-blush-400 mb-5">{t(locale, "paymentMethod")}</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-cream-300 cursor-pointer has-[:checked]:border-blush-400 has-[:checked]:bg-rose-100 transition-all duration-300">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment_method === "cod"}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  className="accent-blush-400"
                />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blush-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-charcoal-700">{t(locale, "cashOnDelivery")}</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-cream-300 cursor-not-allowed opacity-50">
                <input type="radio" name="payment" value="card" disabled className="accent-blush-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-charcoal-500">
                    {t(locale, "creditCard")} ({locale === "ar" ? "قريباً" : "Coming Soon"})
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-soft sticky top-24">
            <h2 className="text-lg font-display text-blush-400 mb-5">{t(locale, "orderSummary")}</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                  <span className="text-charcoal-500">
                    {locale === "ar" ? item.name_ar : item.name_en} × {item.quantity}
                  </span>
                  <span className="font-medium text-charcoal-700">
                    {formatPrice((item.sale_price || item.price) * item.quantity, locale)}
                  </span>
                </div>
              ))}
            </div>
            <div className="divider" />

            <div className="flex gap-2 my-4">
              <input
                type="text"
                placeholder={locale === "ar" ? "كود الخصم" : "Discount code"}
                className="input-field text-sm py-2.5 rounded-xl"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                className="btn-secondary btn-sm whitespace-nowrap rounded-xl"
              >
                {locale === "ar" ? "تطبيق" : "Apply"}
              </button>
            </div>
            <div className="divider" />

            <div className="space-y-2.5 text-sm mt-4">
              <div className="flex justify-between">
                <span className="text-charcoal-400">{t(locale, "subtotal")}</span>
                <span className="text-charcoal-700">{formatPrice(subtotal, locale)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>{t(locale, "discount")}</span>
                  <span>-{formatPrice(discountAmount, locale)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-charcoal-400">{t(locale, "shipping")}</span>
                <span className="text-charcoal-700">
                  {shippingCost === 0 ? (locale === "ar" ? "مجاني" : "Free") : formatPrice(shippingCost, locale)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-cream-300">
                <span className="text-blush-400">{t(locale, "total")}</span>
                <span className="text-blush-400">{formatPrice(total, locale)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-6 rounded-full"
              disabled={loading}
            >
              {loading ? "..." : t(locale, "placeOrder")}
            </button>

            <p className="text-center text-xs text-charcoal-400 mt-4 flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4 text-blush-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              {locale === "ar" ? "الدفع آمن ومؤمن بالكامل" : "Secure checkout"}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
