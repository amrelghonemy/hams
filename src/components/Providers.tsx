"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AnalyticsProvider } from "@/context/AnalyticsContext";
import { TrackingScripts } from "@/components/analytics/TrackingScripts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <WishlistProvider>
          <AnalyticsProvider>
            <TrackingScripts />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AnalyticsProvider>
        </WishlistProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
