"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface AnalyticsContextType {
  trackPageView: (pageName?: string) => void;
  trackViewContent: (product: { id: string; name: string; price: number; category?: string }) => void;
  trackAddToCart: (product: { id: string; name: string; price: number; quantity: number; category?: string }) => void;
  trackRemoveFromCart: (product: { id: string; name: string; price: number; quantity: number }) => void;
  trackInitiateCheckout: (products: { id: string; name: string; price: number; quantity: number }[], value: number) => void;
  trackPurchase: (orderId: string, products: { id: string; name: string; price: number; quantity: number }[], value: number) => void;
  trackSearch: (query: string) => void;
  trackCustomEvent: (eventName: string, params?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error("useAnalytics must be used within AnalyticsProvider");
  return ctx;
}

function sendToServer(event_name: string, event_data: Record<string, any>) {
  try {
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name, event_data }),
      keepalive: true,
    });
  } catch {}
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const trackPageView = useCallback((pageName?: string) => {
    const page = pageName || window.location.pathname;
    // Meta Pixel
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView", { content_name: page });
    }
    // GA4
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_title: page });
    }
    sendToServer("page_view", { page });
  }, []);

  const trackViewContent = useCallback((product: { id: string; name: string; price: number; category?: string }) => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "ViewContent", {
        content_ids: [product.id],
        content_type: "product",
        content_name: product.name,
        value: product.price,
        currency: "EGP",
      });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "view_item", {
        items: [{ item_id: product.id, item_name: product.name, price: product.price, item_category: product.category }],
      });
    }
    sendToServer("view_content", product);
  }, []);

  const trackAddToCart = useCallback((product: { id: string; name: string; price: number; quantity: number; category?: string }) => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "AddToCart", {
        content_ids: [product.id],
        content_type: "product",
        content_name: product.name,
        value: product.price * product.quantity,
        currency: "EGP",
        contents: [{ id: product.id, quantity: product.quantity, item_price: product.price }],
      });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "add_to_cart", {
        value: product.price * product.quantity,
        currency: "EGP",
        items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: product.quantity }],
      });
    }
    sendToServer("add_to_cart", product);
  }, []);

  const trackRemoveFromCart = useCallback((product: { id: string; name: string; price: number; quantity: number }) => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "RemoveFromCart", {
        content_ids: [product.id],
        content_type: "product",
        value: product.price * product.quantity,
        currency: "EGP",
      });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "remove_from_cart", {
        value: product.price * product.quantity,
        currency: "EGP",
      });
    }
    sendToServer("remove_from_cart", product);
  }, []);

  const trackInitiateCheckout = useCallback((products: { id: string; name: string; price: number; quantity: number }[], value: number) => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", {
        content_ids: products.map((p) => p.id),
        content_type: "product",
        num_items: products.reduce((sum, p) => sum + p.quantity, 0),
        value,
        currency: "EGP",
        contents: products.map((p) => ({ id: p.id, quantity: p.quantity, item_price: p.price })),
      });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", {
        value,
        currency: "EGP",
        items: products.map((p) => ({ item_id: p.id, item_name: p.name, price: p.price, quantity: p.quantity })),
      });
    }
    sendToServer("initiate_checkout", { products, value });
  }, []);

  const trackPurchase = useCallback((orderId: string, products: { id: string; name: string; price: number; quantity: number }[], value: number) => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "Purchase", {
        content_ids: products.map((p) => p.id),
        content_type: "product",
        num_items: products.reduce((sum, p) => sum + p.quantity, 0),
        value,
        currency: "EGP",
        order_id: orderId,
        contents: products.map((p) => ({ id: p.id, quantity: p.quantity, item_price: p.price })),
      });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "purchase", {
        transaction_id: orderId,
        value,
        currency: "EGP",
        items: products.map((p) => ({ item_id: p.id, item_name: p.name, price: p.price, quantity: p.quantity })),
      });
    }
    sendToServer("purchase", { orderId, products, value });
  }, []);

  const trackSearch = useCallback((query: string) => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "Search", { search_string: query });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "search", { search_term: query });
    }
    sendToServer("search", { query });
  }, []);

  const trackCustomEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, params);
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
    sendToServer(eventName, params || {});
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{ trackPageView, trackViewContent, trackAddToCart, trackRemoveFromCart, trackInitiateCheckout, trackPurchase, trackSearch, trackCustomEvent }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
