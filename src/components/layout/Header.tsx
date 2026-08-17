"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";
import { CartDrawer } from "@/components/cart/CartDrawer";

const navLinks = [
  { key: "home", href: "/" },
  { key: "shop", href: "/shop" },
  { key: "newArrivals", href: "/shop?sort=newest" },
  { key: "bestSellers", href: "/shop?sort=bestseller" },
  { key: "offers", href: "/shop?filter=sale" },
  { key: "aboutUs", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const { locale, setLocale } = useLanguage();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery]
  );

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-cream-50/95 backdrop-blur-md shadow-[0_8px_32px_rgba(244,114,182,0.08)]"
            : "bg-cream-50"
        }`}
      >
        <div className="bg-gradient-to-r from-rose-100/80 via-blush-100/60 to-rose-100/80 text-center py-2.5 text-xs tracking-wider">
          <p className="container-custom text-rose-500 font-medium">
            {locale === "ar"
              ? "شحن مجاني للطلبات فوق 500 جنيه"
              : "Free shipping on orders over 500 EGP"}
          </p>
        </div>

        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 -me-2 rounded-2xl hover:bg-rose-50 transition-colors duration-300"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6 text-charcoal-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            <Link href="/" className="flex items-center group">
              <img
                src="/logo.png"
                alt="Hams Style"
                className="h-40 md:h-60 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-charcoal-600 hover:text-rose-600 bg-rose-50/0 hover:bg-rose-50 rounded-full transition-all duration-300 ease-out"
                >
                  {t(locale, link.key)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
                className="px-3.5 py-1.5 text-xs font-bold rounded-full border border-rose-200 text-charcoal-600 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
                aria-label="Switch language"
              >
                {locale === "ar" ? "EN" : "عربي"}
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-2xl text-charcoal-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2.5 rounded-2xl text-charcoal-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 relative"
                aria-label="Cart"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-400 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-900/20 backdrop-blur-sm flex items-start justify-center pt-24 transition-opacity duration-300"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-cream-50/95 backdrop-blur-md w-full max-w-lg mx-4 p-6 rounded-3xl shadow-[0_20px_60px_rgba(244,114,182,0.12)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(locale, "searchPlaceholder")}
                className="flex-1 px-5 py-3.5 bg-white border border-rose-100 rounded-full text-sm text-charcoal-700 placeholder:text-charcoal-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-300"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-rose-400 hover:bg-rose-500 text-white text-sm font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {t(locale, "search")}
              </button>
            </form>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <>
          <div
            className="menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 start-0 h-full w-80 max-w-[85vw] bg-cream-50 z-50 shadow-[10px_0_40px_rgba(244,114,182,0.1)] animate-slide-in-left flex flex-col rounded-e-[2rem]">
            <div className="flex items-center justify-between p-6 border-b border-rose-100/60">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img src="/logo.png" alt="Hams Style" className="h-40 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-2xl hover:bg-rose-50 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5 text-charcoal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-6 py-3.5 mx-3 text-sm font-medium text-charcoal-600 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300"
                >
                  {t(locale, link.key)}
                </Link>
              ))}
              <div className="border-t border-rose-100/60 my-4 mx-6" />
            </nav>
            <div className="p-6 border-t border-rose-100/60">
              <button
                onClick={() => {
                  setLocale(locale === "ar" ? "en" : "ar");
                  setMobileMenuOpen(false);
                }}
                className="w-full px-5 py-2.5 text-sm font-medium rounded-full border border-rose-200 text-charcoal-600 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
              >
                {locale === "ar" ? "English" : "عربي"}
              </button>
            </div>
          </div>
        </>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
