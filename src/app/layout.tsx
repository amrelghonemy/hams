import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", weight: ["300", "400", "500", "600", "700"] });

const SITE_URL = "https://hams-style.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hams Style | أناقتك تبدأ من هنا - Premium Women's Fashion",
    template: "%s | Hams Style",
  },
  description:
    "Hams Style - تشكيلة أنيقة من الملابس العصرية للمرأة العصرية. Shop the latest fashion trends with free shipping & cash on delivery across Egypt. Browse dresses, tops, sets & more.",
  keywords: [
    "hams style",
    "hamsstyle",
    "ملابس حريمي",
    "فساتين",
    "موضة نسائية",
    "egyptian fashion",
    "women fashion egypt",
    "online shopping egypt",
    "تسوق اونلاين",
    "ملابس عصرية",
    "ashion dresses",
    "women tops",
    "two piece set",
    "cash on delivery egypt",
    "دفع عند الاستلام",
    "شحن مجاني",
    "free shipping egypt",
  ],
  authors: [{ name: "Hams Style" }],
  creator: "Hams Style",
  publisher: "Hams Style",
  formatDetection: { telephone: true, email: true, address: true },
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    siteName: "Hams Style",
    title: "Hams Style | أناقتك تبدأ من هنا",
    description: "تشكيلة أنيقة من الملابس العصرية للمرأة العصرية. Shop the latest fashion trends with free shipping & cash on delivery.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hams Style - Premium Women's Fashion",
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 600,
        height: 600,
        alt: "Hams Style - Premium Women's Fashion",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hams Style | أناقتك تبدأ من هنا",
    description: "تشكيلة أنيقة من الملابس العصرية للمرأة العصرية. Shop the latest fashion trends with free shipping & cash on delivery.",
    images: ["/og-image.png"],
    creator: "@hamss_tyle",
    site: "@hamss_tyle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "ar": SITE_URL,
      "en": SITE_URL,
    },
  },
  verification: {},
  other: {
    "theme-color": "#FEFCF9",
    "msapplication-TileColor": "#FEFCF9",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FEFCF9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${cairo.variable} font-sans antialiased bg-warm-white text-charcoal-700 min-h-screen`}>
        <Providers>{children}</Providers>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
