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
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer animate-slide-in-[from_right] [dir=ltr]:slide-in-from-right [dir=rtl]:slide-in-from-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-display font-semibold">
            {t(locale, "cart")} ({totalItems})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-charcoal-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress */}
        {subtotal > 0 && (
          <div className="px-4 py-3 bg-nude-50 border-b">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-charcoal-600">
                {remaining > 0
                  ? `${locale === "ar" ? "متبقي" : "Remaining"} ${formatPrice(remaining, locale)} ${locale === "ar" ? "للشحن المجاني" : "for free shipping"}`
                  : `✓ ${t(locale, "freeShippingProgress")}`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-charcoal-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-charcoal-900 rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <svg className="w-16 h-16 text-charcoal-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-charcoal-500 text-sm mb-4">{t(locale, "yourCartIsEmpty")}</p>
              <Link href="/shop" onClick={onClose} className="btn-primary text-sm">
                {t(locale, "shopNow")}
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 p-4">
                  <div className="relative w-20 h-24 bg-charcoal-50 shrink-0">
                    <Image
                      src={item.image}
                      alt={locale === "ar" ? item.name_ar : item.name_en}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-1">
                      {locale === "ar" ? item.name_ar : item.name_en}
                    </h3>
                    <div className="text-xs text-charcoal-500 mt-0.5">
                      {item.size && <span>{locale === "ar" ? "المقاس" : "Size"}: {item.size}</span>}
                      {item.color && <span className="ms-2">{locale === "ar" ? "اللون" : "Color"}: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-charcoal-200">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal-600 hover:bg-charcoal-50"
                        >
                          −
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center text-xs font-medium border-x border-charcoal-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal-600 hover:bg-charcoal-50"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatPrice((item.sale_price || item.price) * item.quantity, locale)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="p-1 self-start text-charcoal-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3 bg-white">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-500">{t(locale, "subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">{t(locale, "shipping")}</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">{locale === "ar" ? "مجاني" : "Free"}</span>
                  ) : (
                    formatPrice(shippingCost, locale)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t">
                <span>{t(locale, "total")}</span>
                <span>{formatPrice(subtotal + shippingCost, locale)}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={onClose} className="btn-primary w-full text-center block">
              {t(locale, "proceedToCheckout")}
            </Link>
            <Link href="/shop" onClick={onClose} className="btn-ghost w-full text-center block text-xs">
              {t(locale, "continueShopping")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
