"use client";

import React, { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="skeleton-image" />
              <div className="p-3 space-y-2">
                <div className="skeleton-text" />
                <div className="skeleton w-1/3 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
