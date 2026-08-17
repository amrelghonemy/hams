"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const faqItems = {
  en: [
    { q: "How long does delivery take?", a: "Delivery within Cairo and Giza takes 1-2 business days. Other governorates take 3-5 business days." },
    { q: "Can I pay cash on delivery?", a: "Yes! Cash on Delivery (COD) is available for all orders across Egypt." },
    { q: "What is the return policy?", a: "You can return unused items within 7 days of delivery. Items must be in original packaging with tags attached." },
    { q: "How can I track my order?", a: "Go to Track Order page and enter your order number and phone number to see real-time status." },
    { q: "Is there free shipping?", a: "Yes! Free shipping on all orders over 500 EGP." },
    { q: "How do I contact customer service?", a: "You can reach us via WhatsApp, email, or the Contact Us page. We respond within 24 hours." },
  ],
  ar: [
    { q: "كم يستغرق التوصيل؟", a: "التوصيل داخل القاهرة والجيزة من 1-2 يوم عمل. المحافظات الأخرى من 3-5 أيام عمل." },
    { q: "هل يمكنني الدفع عند الاستلام؟", a: "نعم! الدفع عند الاستلام متاح لجميع الطلبات في جميع أنحاء مصر." },
    { q: "ما هي سياسة الإرجاع؟", a: "يمكنك إرجاع المنتجات غير المستخدمة خلال 7 أيام من التوصيل. يجب أن تكون المنتجات في علامتها الأصلية مع الملصقات." },
    { q: "كيف أتتبع طلبي؟", a: "انتقل إلى صفحة تتبع الطلب وأدخل رقم طلبك ورقم هاتفك لرؤية الحالة الفورية." },
    { q: "هل يوجد شحن مجاني؟", a: "نعم! شحن مجاني على جميع الطلبات فوق 500 جنيه." },
    { q: "كيف أتواصل مع خدمة العملاء؟", a: "يمكنك التواصل معنا عبر واتساب أو البريد الإلكتروني أو صفحة تواصل معنا. نرد خلال 24 ساعة." },
  ],
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-start px-6 py-4 flex items-center justify-between gap-4"
      >
        <span className="text-sm font-medium text-charcoal-700">{q}</span>
        <svg
          className={`w-5 h-5 text-blush-400 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-charcoal-500 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export function FAQContent() {
  const { locale } = useLanguage();
  const items = faqItems[locale] || faqItems.en;

  return (
    <div className="container-custom py-12 md:py-20 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-display text-blush-400 text-center mb-10">
        {locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
      </h1>
      <div className="space-y-3">
        {items.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  );
}
