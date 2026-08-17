"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { t } from "@/lib/i18n";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setRelated(data.related || []);
        setReviews(data.reviews || []);
        setLoading(false);
        if (data.product) {
          const sizes = JSON.parse(data.product.sizes || "[]");
          const colors = JSON.parse(data.product.colors || "[]");
          if (sizes.length) setSelectedSize(sizes[0]);
          if (colors.length) setSelectedColor(colors[0]);
        }
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="skeleton aspect-[3/4]" />
          <div className="space-y-4 py-8">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-6 w-1/3" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-charcoal-500 mb-4">{locale === "ar" ? "المنتج غير موجود" : "Product not found"}</p>
        <Link href="/shop" className="btn-primary">{t(locale, "shopNow")}</Link>
      </div>
    );
  }

  const images = JSON.parse(product.images || "[]");
  const sizes = JSON.parse(product.sizes || "[]");
  const colors = JSON.parse(product.colors || "[]");
  const discount = product.sale_price ? getDiscountPercentage(product.price, product.sale_price) : 0;
  const name = locale === "ar" ? product.name_ar : product.name_en;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name_en: product.name_en,
      name_ar: product.name_ar,
      price: product.price,
      sale_price: product.sale_price,
      image: images[selectedImage] || images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      stock: product.stock,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="container-custom py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
        <Link href="/" className="hover:text-charcoal-900">{t(locale, "home")}</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-charcoal-900">{t(locale, "shop")}</Link>
        {product.category_name_en && (
          <>
            <span>/</span>
            <Link href={`/shop?category=${product.category_slug}`} className="hover:text-charcoal-900">
              {locale === "ar" ? product.category_name_ar : product.category_name_en}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-charcoal-700">{name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Images Gallery */}
        <div>
          <div className="relative aspect-[3/4] bg-charcoal-50 mb-4 overflow-hidden">
            <Image
              src={images[selectedImage] || "https://placehold.co/600x800/f3ede8/5d453d?text=Hams+Style"}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 badge-sale text-sm px-3 py-1">-{discount}%</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto custom-scrollbar">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-24 shrink-0 bg-charcoal-50 overflow-hidden ${
                    selectedImage === i ? "ring-2 ring-charcoal-900" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:py-4">
          <h1 className="text-2xl md:text-3xl font-display text-charcoal-900 mb-2">{name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? "text-amber-400" : "text-charcoal-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-charcoal-500">
              {product.rating} ({product.review_count} {t(locale, "reviews")})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className={`text-2xl font-semibold ${discount > 0 ? "text-red-500" : "text-charcoal-900"}`}>
              {formatPrice(product.sale_price || product.price, locale)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg text-charcoal-400 line-through">
                  {formatPrice(product.price, locale)}
                </span>
                <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
            {locale === "ar" ? product.description_ar : product.description_en}
          </p>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-6">
              <label className="label-text">
                {locale === "ar" ? "اللون" : "Color"}: <span className="font-normal normal-case">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedColor === color
                        ? "border-charcoal-900 bg-charcoal-900 text-white"
                        : "border-charcoal-200 hover:border-charcoal-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label className="label-text">
                  {locale === "ar" ? "المقاس" : "Size"}: <span className="font-normal normal-case">{selectedSize}</span>
                </label>
                <button className="text-xs text-charcoal-500 underline">{t(locale, "sizeGuide")}</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 text-sm border transition-colors ${
                      selectedSize === size
                        ? "border-charcoal-900 bg-charcoal-900 text-white"
                        : "border-charcoal-200 hover:border-charcoal-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="label-text">{t(locale, "quantity")}</label>
            <div className="flex items-center border border-charcoal-200 w-fit mt-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg hover:bg-charcoal-50"
              >
                −
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-charcoal-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center text-lg hover:bg-charcoal-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          <p className={`text-sm mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? t(locale, "inStock") : t(locale, "outOfStock")}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} className="btn-primary flex-1" disabled={product.stock === 0}>
              {addedToCart ? "✓ Added!" : t(locale, "addToCart")}
            </button>
            <button onClick={handleBuyNow} className="btn-secondary flex-1" disabled={product.stock === 0}>
              {t(locale, "buyNow")}
            </button>
            <button
              onClick={() => toggleItem(product.id)}
              className={`w-12 h-12 flex items-center justify-center border transition-colors ${
                inWishlist ? "bg-red-50 border-red-200 text-red-500" : "border-charcoal-200 hover:border-charcoal-400"
              }`}
            >
              <svg className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          {/* Info */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 text-sm text-charcoal-600">
              <svg className="w-5 h-5 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21a.75.75 0 0 0 .75-.75V11.25a3 3 0 0 0-3-3h-1.5l-1.72-4.575A1.5 1.5 0 0 0 13.093 2.25H10.907a1.5 1.5 0 0 0-1.432 1.025L7.75 7.875H3.375a3 3 0 0 0-3 3v5.25c0 .621.504 1.125 1.125 1.125h12.75" />
              </svg>
              {t(locale, "estimatedDelivery")}: 2-5 {locale === "ar" ? " أيام عمل" : "business days"}
            </div>
            <div className="flex items-center gap-3 text-sm text-charcoal-600">
              <svg className="w-5 h-5 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
              {t(locale, "easyReturns")}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-8">{t(locale, "relatedProducts")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
