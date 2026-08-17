import type { Metadata } from "next";
import { ReturnsContent } from "./ReturnsContent";

export const metadata: Metadata = {
  title: "Return Policy | سياسة الإرجاع",
  description:
    "Hams Style return & exchange policy. Return unused items within 7 days of delivery. سياسة الإرجاع والاستبدال — أرجعي المنتجات غير المستخدمة خلال 7 أيام.",
  openGraph: {
    title: "Return Policy | Hams Style",
    description: "Return unused items within 7 days of delivery. Easy returns & refunds.",
    url: "https://hams-style.vercel.app/returns",
  },
  alternates: { canonical: "https://hams-style.vercel.app/returns" },
};

export default function ReturnsPage() {
  return <ReturnsContent />;
}
