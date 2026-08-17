export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number, locale = "ar"): string {
  if (locale === "ar") {
    return `${price.toLocaleString("ar-EG")} جنيه`;
  }
  return `EGP ${price.toLocaleString("en-US")}`;
}

export function formatPriceNumber(price: number): string {
  return price.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export function getDiscountPercentage(price: number, salePrice: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateOrderNumber(): string {
  const date = new Date();
  const prefix = "HS";
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `${prefix}${year}${month}${random}`;
}

export function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function toJsonArray(arr: string[]): string {
  return JSON.stringify(arr);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "البحيرة",
  "الدقهلية",
  "الشرقية",
  "كفر الشيخ",
  "الغربية",
  "المنوفية",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "الوادي الجديد",
  "مطروح",
  "شمال سيناء",
  "جنوب سيناء",
];

export const egyptianCities: Record<string, string[]> = {
  القاهرة: ["مدينة نصر", "المعادي", "الزمالك", "المهندسين", "التجمع الخامس", "هليوبolis", "شبرا", "العباسية"],
  الجيزة: ["الدقي", "المهندسين", "فيصل", "الهرم", "أكتوبر", "الشيخ زايد", "البدرشين"],
  الإسكندرية: ["سيدي جابر", "المنشية", "العطاريد", "ال.askري", "الجمرك", "الدخيلة"],
};
