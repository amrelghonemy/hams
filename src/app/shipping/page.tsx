import type { Metadata } from "next";
import { ShippingContent } from "./ShippingContent";

export const metadata: Metadata = {
  title: "Shipping Policy | سياسة الشحن",
  description:
    "Hams Style shipping policy. Free shipping on orders over 500 EGP. Delivery in 1-2 days for Cairo & Giza, 3-5 days for other governorates. سياسة الشحن — شحن مجاني فوق 500 جنيه.",
  openGraph: {
    title: "Shipping Policy | Hams Style",
    description: "Free shipping on orders over 500 EGP. Fast delivery across Egypt.",
    url: "https://hams-style.vercel.app/shipping",
  },
  alternates: { canonical: "https://hams-style.vercel.app/shipping" },
};

export default function ShippingPage() {
  return <ShippingContent />;
}
