import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import { useState, useEffect, useMemo } from "react";
import useIsDesktop from "../hooks/useIsDesktop";
import { Helmet } from "react-helmet-async";
import { catalogProducts } from "../data/catalog";
import { blogBackgroundStyle } from "../styles/blogBackground";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const isDesktop = useIsDesktop();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Reviews state (UI only for now)
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const reviewsCount = reviews.length;
  const avgRating = reviewsCount
    ? Math.round((reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviewsCount) * 10) / 10
    : 0;

  const fmtCZK = useMemo(
    () => new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }),
    []
  );

  const USE_LOCAL_PRODUCTS = (import.meta?.env?.VITE_PRODUCTS_SOURCE || '').toLowerCase() === 'local';

  // Auto-detect: if the route param matches a local catalog item (by id or slug), use local mode.
  const LOCAL_CATALOG_MATCH = Array.isArray(catalogProducts)
    ? catalogProducts.find(
        (p) => String(p?.id) === String(id) || String(p?.slug) === String(id)
      )
    : null;

  const SHOULD_USE_LOCAL = USE_LOCAL_PRODUCTS || Boolean(LOCAL_CATALOG_MATCH);

  const parseMaybeJson = (v) => {
    if (v == null) return null;
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return v; }
    }
    return v;
  };

  const normalizeLocalProduct = (row) => {
    const parsedName = parseMaybeJson(row?.name ?? row?.title);
    const parsedDesc = parseMaybeJson(row?.description);

    const name_obj = {
      cs:
        row?.name_cs ??
        row?.title?.cs ??
        (parsedName && parsedName.cs) ??
        (typeof parsedName === 'string' ? parsedName : '') ??
        '',
      en: row?.name_en ?? row?.title?.en ?? (parsedName && parsedName.en) ?? '',
      ru: row?.name_ru ?? row?.title?.ru ?? (parsedName && parsedName.ru) ?? '',
    };

    const desc_obj = {
      cs: row?.description_cs ?? (parsedDesc && parsedDesc.cs) ?? (typeof parsedDesc === 'string' ? parsedDesc : '') ?? '',
      en: row?.description_en ?? (parsedDesc && parsedDesc.en) ?? '',
      ru: row?.description_ru ?? (parsedDesc && parsedDesc.ru) ?? '',
    };

    const imageUrl =
      row?.image_url ||
      row?.imageUrl ||
      row?.image ||
      (Array.isArray(row?.gallery) && row.gallery[0]) ||
      '';

    return {
      id: row?.id,
      name: name_obj,
      description: desc_obj,
      price: row?.price ?? 0,
      categories: Array.isArray(row?.categories) ? row.categories : [],
      images: {
        data: [{ attributes: { url: imageUrl } }],
      },
      _raw: row,
    };
  };

  async function loadLocalProductById(productIdOrSlug) {
    const list = Array.isArray(catalogProducts) ? catalogProducts : [];

    // route param `/product/:id` can be slug OR id (Shop uses slug when present)
    const found = list.find(
      (p) => String(p?.id) === String(productIdOrSlug) || String(p?.slug) === String(productIdOrSlug)
    );

    const mapped = found ? normalizeLocalProduct(found) : null;

    const currentCats = Array.isArray(found?.categories) ? found.categories : [];
    const relatedList = list
      .filter((p) => String(p?.id) !== String(found?.id))
      .map((p) => {
        const cats = Array.isArray(p?.categories) ? p.categories : [];
        const score = currentCats.reduce((acc, c) => (cats.includes(c) ? acc + 1 : acc), 0);
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p)
      .slice(0, 8);

    return {
      product: mapped,
      related: relatedList,
    };
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (SHOULD_USE_LOCAL) {
          const { product: localProduct, related: localRelated } = await loadLocalProductById(id);
          if (!cancelled) {
            setProduct(localProduct);
            setVariants([]);
            setSelectedVariant(null);
            setRelated(localRelated || []);
            setReviews([]);
            setQuantity(1);
          }
          return;
        }
      } catch (err) {
        console.error("Product load error:", err);
        if (!cancelled) {
          setProduct(null);
          setVariants([]);
          setRelated([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, i18n.language]);

  const localName = (obj) => obj?.[i18n.language] || obj?.en || obj?.cs || obj?.ru || "";
  const localVariantName = (v) =>
    i18n.language === "cs" ? v.name_cs : i18n.language === "ru" ? v.name_ru : v.name_en;

  const pickLocaleValue = (val) => {
    if (val == null) return "";
    if (typeof val === "string") return val;
    if (val && typeof val === "object") {
      return val?.[i18n.language] || val?.en || val?.cs || val?.ru || "";
    }
    return "";
  };

  const relatedItems = useMemo(() => (Array.isArray(related) ? related.slice(0, 8) : []), [related]);

  const resolveRelated = (r) => {
    const name = pickLocaleValue(r?.title || r?.name || r?.description);
    const description = pickLocaleValue(r?.description);
    const image =
      r?.image_url ||
      r?.imageUrl ||
      r?.image ||
      (Array.isArray(r?.gallery) ? r.gallery[0] : "") ||
      r?.images?.data?.[0]?.attributes?.url ||
      "/images/placeholder.svg";
    const price = Number(r?.price || 0);
    return {
      id: r?.id,
      slug: r?.slug,
      name,
      description,
      image,
      price,
    };
  };

  const displayPrice = useMemo(() => {
    const p = selectedVariant ? selectedVariant.price : product?.price || 0;
    return fmtCZK.format(Number(p) || 0);
  }, [selectedVariant, product, fmtCZK]);

  if (loading) return <div className="text-center py-10 text-[#BDA47A]">Loading...</div>;
  if (!product) return <div className="text-center py-10 text-[#BDA47A]">{t("productNotFound")}</div>;

  const handleAdd = () => {
    if (!product) return;

    const lang = i18n.language;
    const baseName = product.name?.[lang] || t("noName");
    const variantPart = selectedVariant ? ` — ${localVariantName(selectedVariant)}` : "";
    const image = product.images?.data?.[0]?.attributes?.url || "";
    const unitPrice = Number(selectedVariant ? selectedVariant.price : product.price) || 0;
    const qty = Math.max(1, Number(quantity) || 1);

    // делаем разные id для разных вариантов, чтобы они жили в корзине отдельно
    const cartId = selectedVariant ? `${product.id}:${selectedVariant.id}` : product.id;

    for (let i = 0; i < qty; i += 1) {
      addToCart({ id: cartId, name: `${baseName}${variantPart}`, price: unitPrice, image });
    }
    setQuantity(1);
  };

  const handleQuickAdd = (r) => {
    if (!r) return;
    const item = resolveRelated(r);
    if (!item?.id) return;
    addToCart({
      id: item.id,
      name: item.name || t("noName"),
      price: item.price || 0,
      image: item.image || "",
    });
  };


  return (
    <>
    <Helmet>
      <title>{localName(product.name)} – Amuerose</title>
      <meta name="description" content={localName(product.description)?.slice(0,160) || ""} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": localName(product.name),
          "image": [product.images?.data?.[0]?.attributes?.url || ""],
          "description": localName(product.description),
          "sku": product.id,
          "brand": { "@type": "Brand", "name": "Amuerose" },
          "offers": {
            "@type": "Offer",
            "url": `https://amuerose.cz/product/${product.id}`,
            "priceCurrency": "CZK",
            "price": Number(selectedVariant ? selectedVariant.price : product.price) || 0,
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": reviews.length ? {
            "@type": "AggregateRating",
            "ratingValue": avgRating,
            "reviewCount": reviews.length
          } : undefined
        })}
      </script>
    </Helmet>
    <main
      className="flex flex-col min-h-screen pt-[env(safe-area-inset-top)] lg:pt-0 overflow-x-hidden"
      style={blogBackgroundStyle}
    >
      <section
        className={
          isDesktop
            ? "w-full max-w-[1400px] mx-auto px-6 flex-1 flex flex-col z-10 pt-[calc(120px+var(--safe-area-inset-top,0px))] pb-10 lg:pb-[140px]"
            : "w-full max-w-[1400px] mx-auto px-6 flex-1 flex flex-col z-10 pt-[calc(120px+var(--safe-area-inset-top,0px))] pb-[calc(140px+var(--safe-area-inset-bottom,0px))] lg:pb-[140px]"
        }
      >
        <div className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            {/* Изображение */}
            <div className="rounded-3xl bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.35),0_8px_30px_rgba(0,0,0,0.18)] p-6">
              <img
                src={product.images.data[0]?.attributes.url}
                alt={localName(product.name)}
                className="w-full max-h-[560px] object-contain"
              />
            </div>

            {/* Единый инфо-блок */}
            <div className="rounded-3xl bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/25 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.35),0_8px_30px_rgba(0,0,0,0.18)] p-6 flex flex-col gap-5 text-[#5C3A2E]">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                  {localName(product.name)}
                </h1>
                <div className="text-[#BDA47A] text-lg sm:text-xl font-semibold whitespace-nowrap">
                  {displayPrice}
                </div>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-[#5C3A2E]/85 whitespace-pre-line">
                {localName(product.description) || t("noDescription")}
              </p>

              {variants.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-[#BDA47A] font-medium">{t("options.size")}</div>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const selected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 rounded-full border transition backdrop-blur ${
                            selected
                              ? "bg-[#BDA47A]/20 border-[#BDA47A] text-[#BDA47A]"
                              : "bg-white/10 border-white/20 text-[#5C3A2E] hover:bg-white/20"
                          }`}
                          aria-pressed={selected}
                        >
                          {localVariantName(v)}{v.qty ? ` (${v.qty})` : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-2 flex flex-col gap-3">
                <div className="text-sm font-semibold text-[#5C3A2E]">
                  {t("allergensTitle")} (čísla EU): 6, 7
                </div>
                {isDesktop && (
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                        className="w-7 h-7 rounded-full bg-white/10 border border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur"
                      >
                        &minus;
                      </button>
                      <span className="min-w-[26px] text-center text-[#BDA47A] text-sm">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((p) => p + 1)}
                        className="w-7 h-7 rounded-full bg-white/10 border border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={handleAdd}
                        className="h-9 px-5 text-sm rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition font-medium"
                      >
                        {t("buttons.addToCart")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {relatedItems.length > 0 && (
          <div className="w-full max-w-[1200px] mx-auto px-2 sm:px-6 pb-8 mt-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-semibold text-[#5C3A2E]">
                {t("relatedProducts")}
              </h2>
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-[#BDA47A]/50 text-[#8E6A3D] bg-white/10 backdrop-blur hover:bg-white/20 transition"
              >
                {t("goToShop")}
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {relatedItems.map((r) => {
                const item = resolveRelated(r);
                const key = item?.slug || item?.id || r?.id || r?.slug;
                if (!key) return null;
                return (
                  <div
                    key={key}
                    onClick={() => navigate(`/product/${item.slug || item.id}`)}
                    className="min-w-[180px] max-w-[200px] rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md overflow-hidden cursor-pointer hover:bg-white/10 transition"
                  >
                    <div className="w-full h-[140px] flex items-center justify-center bg-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain p-3"
                      />
                    </div>
                    <div className="p-3 flex flex-col gap-2">
                      <div className="text-xs sm:text-sm font-semibold text-[#5C3A2E] line-clamp-2">
                        {item.name || t("noName")}
                      </div>
                      <div className="text-[11px] text-[#7A4E35]/70 line-clamp-2">
                        {item.description || ""}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs sm:text-sm font-semibold text-[#BDA47A]">
                          {fmtCZK.format(Number(item.price) || 0)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(r);
                          }}
                          className="text-[11px] px-3 py-1 rounded-full border border-[#BDA47A]/50 text-[#8E6A3D] bg-[rgba(189,164,122,0.15)] hover:bg-[rgba(189,164,122,0.25)] transition"
                        >
                          {t("buttons.addToCart") || "В корзину"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="w-full max-w-[1200px] mx-auto px-2 sm:px-6 pb-10">
          <div className="rounded-3xl bg-white/55 backdrop-blur-[22px] border border-white/40 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_8px_30px_rgba(0,0,0,0.18)] p-6 text-[#5C3A2E]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold">
                  {t("reviewsTitle")}
                </h3>
                <div className="text-[#BDA47A] font-semibold">
                  {avgRating ? avgRating.toFixed(1) : "0.0"}
                </div>
              </div>
              <div className="text-xs text-[#5C3A2E]/60">
                {reviewsCount ? `${t("basedOn")} ${reviewsCount}` : t("noReviews")}
              </div>
            </div>

            {reviewsCount > 0 ? (
              <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 text-[#BDA47A]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} aria-hidden>
                            {i < Number(r.rating || 0) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-[#5C3A2E]/60">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString("cs-CZ") : ""}
                      </div>
                    </div>
                    {r.comment && (
                      <div className="mt-2 text-sm whitespace-pre-line text-[#5C3A2E]">
                        {r.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#5C3A2E]/70 mb-4">
                {t("noReviews")}
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4">
              <div className="text-sm font-medium text-[#BDA47A] mb-2">
                {t("leaveReview")}
              </div>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    const active = myRating >= val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setMyRating(val)}
                        className={`text-xl leading-none transition ${active ? "text-[#BDA47A]" : "text-[#5C3A2E]/40 hover:text-[#BDA47A]/70"}`}
                        aria-label={`${t("rating")}: ${val}`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder={t("reviewPlaceholder")}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-[#5C3A2E] placeholder:text-[#5C3A2E]/50 focus:outline-none focus:ring-2 focus:ring-[#BDA47A]/30"
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-[#5C3A2E]/60">
                    {reviewText.length}/2000
                  </div>
                  <button
                    type="submit"
                    disabled={!myRating || !reviewText.trim()}
                    className="h-9 px-5 text-sm rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("submitReview")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>



    {/* Кнопки (мобилка) */}
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-0 right-0 z-[100] px-6 pointer-events-none">
      <div className="w-full max-w-[1400px] mx-auto flex justify-end items-center gap-3 pointer-events-auto">
        <div className="flex lg:hidden items-center gap-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setQuantity((p) => Math.max(1, p - 1))}
              className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur">&minus;</button>
            <span className="min-w-[26px] text-center text-[#BDA47A] text-sm">{quantity}</span>
            <button type="button" onClick={() => setQuantity((p) => p + 1)}
              className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur">+</button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="h-9 px-5 text-sm rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition font-medium"
          >
            {t("buttons.addToCart")}
          </button>
        </div>
      </div>
    </div>
  </>
  );
}

export default ProductPage;
