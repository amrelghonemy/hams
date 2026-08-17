"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ReturnsPage() {
  const { locale } = useLanguage();

  return (
    <div className="container-custom py-12 md:py-20 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-display text-blush-400 text-center mb-10">
        {locale === "ar" ? "سياسة الإرجاع" : "Return Policy"}
      </h1>

      <div className="space-y-8 text-charcoal-500 leading-relaxed text-sm md:text-base">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "سياسة الإرجاع والاستبدال" : "Return & Exchange Policy"}
          </h2>
          <p className="mb-4">
            {locale === "ar"
              ? "نريدك أن تشعري بالثقة عند التسوق من Hams Style. إذا لم تكن راضية عن مشترياتك، يمكنك إرجاع المنتجات وفقاً للشروط التالية:"
              : "We want you to feel confident shopping at Hams Style. If you're not satisfied with your purchase, you can return items according to the following terms:"}
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "يجب إرجاع المنتج خلال 7 أيام من تاريخ الاستلام"
                : "Items must be returned within 7 days of delivery"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "يجب أن تكون المنتجات في حالتها الأصلية غير المستخدمة مع الملصقات مرفقة"
                : "Items must be in original unused condition with tags attached"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "يجب أن تكون المنتجات في علامتها الأصلية وفي التغليف الأصلي"
                : "Items must be in original packaging"}
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blush-400 mt-2 shrink-0" />
              {locale === "ar"
                ? "المنتجات التالية لا يمكن إرجاعها: المنتجات المخفضة، الملابس الداخلية، الإكسسوارات المفتوحة"
                : "The following items cannot be returned: sale items, undergarments, opened accessories"}
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "كيفية الإرجاع" : "How to Return"}
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-charcoal-500">
              {locale === "ar"
                ? "تواصل معنا عبر واتساب أو صفحة تواصل معنا مع ذكر رقم الطلب"
                : "Contact us via WhatsApp or the Contact page with your order number"}
            </li>
            <li className="text-charcoal-500">
              {locale === "ar"
                ? "سنقوم بتنسيق استلام المنتج من عنوانك"
                : "We will arrange product pickup from your address"}
            </li>
            <li className="text-charcoal-500">
              {locale === "ar"
                ? "بعد فحص المنتج، سيتم استرداد المبلغ خلال 3-5 أيام عمل"
                : "After inspecting the item, the refund will be processed within 3-5 business days"}
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-display text-blush-400 mb-4">
            {locale === "ar" ? "الاسترداد" : "Refunds"}
          </h2>
          <p>
            {locale === "ar"
              ? "يتم استرداد المبلغ بنفس طريقة الدفع الأصلية. إذا دفعت عند الاستلام، سيتم تحويل المبلغ إلى حسابك البنكي خلال 3-5 أيام عمل."
              : "Refunds will be issued to the original payment method. If you paid cash on delivery, the amount will be transferred to your bank account within 3-5 business days."}
          </p>
        </div>
      </div>
    </div>
  );
}
