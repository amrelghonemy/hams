"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, totalItems, freeShippingThreshold, shippingCost } = useCart();
  const { locale } = useLanguage();

  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - subtotal;

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 bottom-0 z-50 w-full max-w-md bg-white/95 backdrop-blur-md shadow-[-8px_0_32px_rgba(219,166,166,0.15)] flex flex-col rounded-l-3xl [dir=rtl]:rounded-l-none [dir=rtl]:rounded-r-3xl animate-slide-in-[from_right] [dir=ltr]:slide-in-from-right [dir=rtl]:slide-in-from-left transition-all duration-500">
        <div className="flex items-center justify-between px-6 py-5 border-b border-blush-100">
          <h2 className="text-lg font-display font-semibold text-charcoal-800">
            {t(locale, "cart")} ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blush-50 text-charcoal-500 hover:bg-blush-100 hover:text-rose-500 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {subtotal > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-blush-50 to-rose-50 border-b border-blush-100">
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-charcoal-600">
                {remaining > 0
                  ? `${locale === "ar" ? "متبقي" : "Remaining"} ${formatPrice(remaining, locale)} ${locale === "ar" ? "للشحن المجاني" : "for free shipping"}`
                  : `✓ ${t(locale, "freeShippingProgress")}`}
              </span>
            </div>
            <div className="w-full h-2 bg-blush-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blush-300 to-rose-400"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-blush-50 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-blush-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <p className="text-charcoal-500 text-sm mb-5">{t(locale, "yourCartIsEmpty")}</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blush-400 to-rose-400 text-white text-sm font-semibold shadow-[0_4px_16px_rgba(219,166,166,0.35)] hover:shadow-[0_6px_24px_rgba(219,166,166,0.45)] hover:scale-105 transition-all duration-300"
              >
                {t(locale, "shopNow")}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-blush-100">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 p-4 hover:bg-blush-50/50 transition-colors duration-200">
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-blush-50 shrink-0 shadow-sm">
                    <Image
                      src={item.image}
                      alt={locale === "ar" ? item.name_ar : item.name_en}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-charcoal-800 line-clamp-1">
                      {locale === "ar" ? item.name_ar : item.name_en}
                    </h3>
                    <div className="text-xs text-charcoal-400 mt-0.5">
                      {item.size && <span>{locale === "ar" ? "المقاس" : "Size"}: {item.size}</span>}
                      {item.color && <span className="ms-2">{locale === "ar" ? "اللون" : "Color"}: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center rounded-full bg-blush-50 border border-blush-100">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal-500 hover:text-rose-500 rounded-full transition-colors duration-200"
                        >
                          −
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center text-xs font-medium text-charcoal-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal-500 hover:text-rose-500 rounded-full transition-colors duration-200"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-charcoal-800">
                        {formatPrice((item.sale_price || item.price) * item.quantity, locale)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="p-1.5 self-start rounded-full text-charcoal-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-blush-100 px-6 py-5 space-y-3 bg-white/80 backdrop-blur-sm rounded-b-3xl [dir=rtl]:rounded-b-none [dir=rtl]:rounded-br-3xl">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-500">{t(locale, "subtotal")}</span>
                <span className="font-medium text-charcoal-800">{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">{t(locale, "shipping")}</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-500">{locale === "ar" ? "مجاني" : "Free"}</span>
                  ) : (
                    <span className="text-charcoal-800">{formatPrice(shippingCost, locale)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-blush-100">
                <span className="text-charcoal-800">{t(locale, "total")}</span>
                <span className="text-charcoal-900">{formatPrice(subtotal + shippingCost, locale)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center py-3 rounded-full bg-gradient-to-r from-blush-400 to-rose-400 text-white text-sm font-semibold shadow-[0_4px_16px_rgba(219,166,166,0.35)] hover:shadow-[0_6px_24px_rgba(219,166,166,0.45)] hover:scale-[1.02] transition-all duration-300"
            >
              {t(locale, "proceedToCheckout")}
            </Link>
            <Link
              href="/shop"
              onClick={onClose}
              className="block w-full text-center py-2.5 rounded-full text-sm text-charcoal-500 hover:text-rose-500 hover:bg-blush-50 transition-all duration-300"
            >
              {t(locale, "continueShopping")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
