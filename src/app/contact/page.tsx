import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | تواصل معنا",
  description:
    "Get in touch with Hams Style. Contact us via WhatsApp, email, or our contact form. We're here to help! تواصلي معنا عبر واتساب أو البريد الإلكتروني.",
  openGraph: {
    title: "Contact Us | Hams Style",
    description: "Get in touch with Hams Style via WhatsApp, email, or our contact form.",
    url: "https://hams-style.vercel.app/contact",
  },
  alternates: { canonical: "https://hams-style.vercel.app/contact" },
};

export default function ContactPage() {
  return <ContactContent />;
}
