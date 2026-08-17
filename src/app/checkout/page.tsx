"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { governorates } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingCost, clearCart } = useCart();
  const { locale } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
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
        <p className="text-charcoal-500 mb-4">{locale === "ar" ? "سلتك فارغة" : "Your cart is empty"}</p>
        <a href="/shop" className="btn-primary">{t(locale, "shopNow")}</a>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-display text-charcoal-900 mb-8">{t(locale, "proceedToCheckout")}</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <div className="bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">{t(locale, "customerInfo")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">{t(locale, "fullName")} *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "mobileNumber")} *</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="01XXXXXXXXX"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">{t(locale, "email")}</label>
                <input
                  type="email"
                  className="input-field"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">{t(locale, "deliveryAddress")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">{t(locale, "governorate")} *</label>
                <select
                  required
                  className="input-field"
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
                  className="input-field"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "area")}</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "street")} *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">{t(locale, "building")}</label>
                <input type="text" className="input-field" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
              </div>
              <div>
                <label className="label-text">{t(locale, "apartment")}</label>
                <input type="text" className="input-field" value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">{t(locale, "additionalNotes")}</label>
                <textarea className="input-field h-20 resize-none" value={form.address_notes} onChange={(e) => setForm({ ...form, address_notes: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">{t(locale, "paymentMethod")}</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border cursor-pointer has-[:checked]:border-charcoal-900 has-[:checked]:bg-charcoal-50">
                <input type="radio" name="payment" value="cod" checked={form.payment_method === "cod"} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="accent-charcoal-900" />
                <span className="text-sm">{t(locale, "cashOnDelivery")}</span>
              </label>
              <label className="flex items-center gap-3 p-3 border cursor-pointer has-[:checked]:border-charcoal-900 has-[:checked]:bg-charcoal-50 opacity-60">
                <input type="radio" name="payment" value="card" disabled className="accent-charcoal-900" />
                <span className="text-sm">{t(locale, "creditCard")} ({locale === "ar" ? "قريباً" : "Coming Soon"})</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">{t(locale, "orderSummary")}</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                  <span className="text-charcoal-600">
                    {locale === "ar" ? item.name_ar : item.name_en} × {item.quantity}
                  </span>
                  <span>{formatPrice((item.sale_price || item.price) * item.quantity, locale)}</span>
                </div>
              ))}
            </div>
            <div className="divider" />

            {/* Discount Code */}
            <div className="flex gap-2 my-4">
              <input
                type="text"
                placeholder={locale === "ar" ? "كود الخصم" : "Discount code"}
                className="input-field text-sm py-2"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button type="button" onClick={handleApplyDiscount} className="btn-secondary btn-sm whitespace-nowrap">
                {locale === "ar" ? "تطبيق" : "Apply"}
              </button>
            </div>
            <div className="divider" />

            <div className="space-y-2 text-sm mt-4">
              <div className="flex justify-between">
                <span className="text-charcoal-500">{t(locale, "subtotal")}</span>
                <span>{formatPrice(subtotal, locale)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t(locale, "discount")}</span>
                  <span>-{formatPrice(discountAmount, locale)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-charcoal-500">{t(locale, "shipping")}</span>
                <span>{shippingCost === 0 ? (locale === "ar" ? "مجاني" : "Free") : formatPrice(shippingCost, locale)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>{t(locale, "total")}</span>
                <span>{formatPrice(total, locale)}</span>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-6" disabled={loading}>
              {loading ? "..." : t(locale, "placeOrder")}
            </button>

            <p className="text-center text-xs text-charcoal-400 mt-4 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
