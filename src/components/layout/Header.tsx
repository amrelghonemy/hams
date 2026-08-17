"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
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
  const { items: wishlistItems } = useWishlist();
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
    return () => { document.body.style.overflow = ""; };
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
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-charcoal-900 text-white text-center py-2 text-xs tracking-wider">
          <p className="container-custom">
            {locale === "ar" ? "شحن مجاني للطلبات فوق 500 جنيه" : "Free shipping on orders over 500 EGP"}
          </p>
        </div>

        {/* Main Header */}
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -me-2"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-display font-bold tracking-tight text-charcoal-900">
                HAMS
              </span>
              <span className="text-xl md:text-2xl font-display font-light tracking-tight text-nude-500">
                STYLE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors relative group"
                >
                  {t(locale, link.key)}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-charcoal-900 group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1">
              {/* Language Switcher */}
              <button
                onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
                className="px-2.5 py-1.5 text-xs font-bold border border-charcoal-200 hover:border-charcoal-400 transition-colors"
                aria-label="Switch language"
              >
                {locale === "ar" ? "EN" : "عربي"}
              </button>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors relative"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-charcoal-900 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24" onClick={() => setSearchOpen(false)}>
          <div
            className="bg-white w-full max-w-lg mx-4 p-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(locale, "searchPlaceholder")}
                className="input-field flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary">
                {t(locale, "search")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 start-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl animate-slide-in-left flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" className="text-lg font-display font-bold text-charcoal-900" onClick={() => setMobileMenuOpen(false)}>
                HAMS STYLE
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-6 py-3.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900 transition-colors"
                >
                  {t(locale, link.key)}
                </Link>
              ))}
              <div className="border-t my-4" />
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-6 py-3.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50"
              >
                {t(locale, "myAccount")}
              </Link>
              <Link
                href="/account/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-6 py-3.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50"
              >
                {t(locale, "wishlist")}
              </Link>
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={() => {
                  setLocale(locale === "ar" ? "en" : "ar");
                  setMobileMenuOpen(false);
                }}
                className="btn-secondary w-full text-sm"
              >
                {locale === "ar" ? "English" : "عربي"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
