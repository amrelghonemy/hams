"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n";

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    titleKey: "qualityGuarantee" as const,
    descKey: "qualityGuaranteeDesc" as const,
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21a.75.75 0 0 0 .75-.75V11.25a3 3 0 0 0-3-3h-1.5l-1.72-4.575A1.5 1.5 0 0 0 13.093 2.25H10.907a1.5 1.5 0 0 0-1.432 1.025L7.75 7.875H3.375a3 3 0 0 0-3 3v5.25c0 .621.504 1.125 1.125 1.125h12.75" />
      </svg>
    ),
    titleKey: "freeShipping" as const,
    descKey: "freeShippingDesc" as const,
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
    titleKey: "securePayment" as const,
    descKey: "securePaymentDesc" as const,
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    titleKey: "customerService" as const,
    descKey: "customerServiceDesc" as const,
  },
];

export function WhyUs() {
  const { locale } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">{t(locale, "whyHamsStyle")}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {features.map((feat, i) => (
            <div key={i} className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 bg-nude-50 flex items-center justify-center text-charcoal-700 group-hover:bg-charcoal-900 group-hover:text-white transition-all duration-300">
                {feat.icon}
              </div>
              <h3 className="text-sm font-semibold text-charcoal-900 mb-1">
                {t(locale, feat.titleKey)}
              </h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                {t(locale, feat.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
