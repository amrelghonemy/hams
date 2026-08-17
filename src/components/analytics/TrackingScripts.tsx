"use client";

import { useEffect, useState } from "react";

interface MarketingSettings {
  meta_pixel_id?: string;
  meta_access_token?: string;
  meta_test_event_code?: string;
  ga_measurement_id?: string;
  tiktok_pixel_id?: string;
}

function loadScript(src: string, id?: string) {
  if (id && document.getElementById(id)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  if (id) s.id = id;
  document.head.appendChild(s);
}

function injectMetaPixel(pixelId: string) {
  if (typeof window !== "undefined" && !window.fbq) {
    const f: any = function () {
      f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments);
    };
    window.fbq = f;
    window._fbq = f;
    f.push = f;
    f.loaded = true;
    f.version = "2.0";
    f.queue = [];
    loadScript("https://connect.facebook.net/en_US/fbevents.js", "fb-pixel-sdk");
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }
}

function injectGA4(measurementId: string) {
  if (typeof window !== "undefined" && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date() as any);
    window.gtag("config", measurementId, { page_path: window.location.pathname });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`, "ga4-sdk");
  }
}

export function TrackingScripts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);

    fetch("/api/marketing/public")
      .then((r) => r.json())
      .then((settings: MarketingSettings) => {
        if (settings.meta_pixel_id) {
          injectMetaPixel(settings.meta_pixel_id);
        }
        if (settings.ga_measurement_id) {
          injectGA4(settings.ga_measurement_id);
        }
      })
      .catch(() => {});
  }, [loaded]);

  return null;
}
