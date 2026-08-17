import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: {
    default: "Hams Style - أناقتك تبدأ من هنا | Premium Fashion",
    template: "%s | Hams Style",
  },
  description:
    "Hams Style - تشكيلة أنيقة من الملابس العصرية للمرأة العصرية. تسوق أحدث صيحات الموضة مع شحن مجاني ودفع عند الاستلام.",
  keywords: [
    "fashion",
    "ملابس",
    "موضة",
    "egyptian fashion",
    "ملابس حريمي",
    "فساتين",
    "hams style",
    "online shopping",
    "تسوق اونلاين",
  ],
  authors: [{ name: "Hams Style" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "Hams Style",
    title: "Hams Style - أناقتك تبدأ من هنا",
    description: "تشكيلة أنيقة من الملابس العصرية للمرأة العصرية",
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
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
      <body className={`${cairo.variable} font-sans antialiased bg-warm-white text-charcoal-700 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
