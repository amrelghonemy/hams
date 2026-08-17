import type { Metadata } from "next";
import { Suspense } from "react";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
  title: "Shop | المتجر",
  description:
    "Browse the latest women's fashion at Hams Style. Shop dresses, tops, two-piece sets & more with free shipping & cash on delivery. تصفحي أحدث صيحات الموضة — فساتين، بلوزات، أطقم.",
  openGraph: {
    title: "Shop | Hams Style",
    description: "Browse the latest women's fashion — dresses, tops, sets & more.",
    url: "https://hams-style.vercel.app/shop",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | Hams Style",
    description: "Browse the latest women's fashion — dresses, tops, sets & more.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://hams-style.vercel.app/shop" },
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-8 md:py-12">
          <div className="text-center mb-8">
            <div className="h-8 bg-cream-300 rounded-2xl w-48 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl overflow-hidden shadow-soft">
                <div className="skeleton-image rounded-3xl" />
                <div className="p-4 space-y-2">
                  <div className="skeleton-text" />
                  <div className="skeleton w-1/3 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
