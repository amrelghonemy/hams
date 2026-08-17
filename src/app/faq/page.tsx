import type { Metadata } from "next";
import { FAQContent } from "./FAQContent";

export const metadata: Metadata = {
  title: "FAQ | الأسئلة الشائعة",
  description:
    "Frequently asked questions about Hams Style — delivery, returns, payments, and more. الأسئلة الشائعة حول التوصيل والإرجاع والمدفوعات.",
  openGraph: {
    title: "FAQ | Hams Style",
    description: "Frequently asked questions about delivery, returns, payments & more.",
    url: "https://hams-style.vercel.app/faq",
  },
  alternates: { canonical: "https://hams-style.vercel.app/faq" },
};

export default function FAQPage() {
  return <FAQContent />;
}
