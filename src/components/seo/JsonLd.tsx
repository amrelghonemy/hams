interface OrganizationLD {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint: {
    "@type": string;
    contactType: string;
    availableLanguage: string[];
  };
}

interface ProductLD {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  image: string;
  brand: { "@type": string; name: string };
  offers: {
    "@type": string;
    priceCurrency: string;
    price: number;
    availability: string;
    seller: { "@type": string; name: string };
  };
}

interface WebSiteLD {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  potentialAction: {
    "@type": string;
    target: string;
    "query-input": string;
  };
}

export function OrganizationJsonLd() {
  const data: OrganizationLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hams Style",
    url: "https://hams-style.vercel.app",
    logo: "https://hams-style.vercel.app/logo.png",
    description: "Premium women's fashion in Egypt. Shop dresses, tops, sets & more.",
    sameAs: [
      "https://www.instagram.com/hamss_tyle",
      "https://www.facebook.com/hamsstyleeg",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data: WebSiteLD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hams Style",
    url: "https://hams-style.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://hams-style.vercel.app/shop?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
}) {
  const data: ProductLD = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: "Hams Style" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EGP",
      price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Hams Style" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
