import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us | من نحن",
  description:
    "Learn about Hams Style — your go-to destination for trendy, elegant women's fashion in Egypt. Quality, comfort, and affordable prices. تعرفي على Hams Style — وجهتك الأولى للأزياء العصرية.",
  openGraph: {
    title: "About Us | Hams Style",
    description: "Learn about Hams Style — trendy, elegant women's fashion in Egypt.",
    url: "https://hams-style.vercel.app/about",
  },
  alternates: { canonical: "https://hams-style.vercel.app/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
