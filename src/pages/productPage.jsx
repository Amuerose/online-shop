import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import useIsDesktop from "../hooks/useIsDesktop";
import { Helmet } from "react-helmet-async";

// NOTE: Ensure global.css includes:
// html, body {
//   height: 100%;
//   overflow: hidden;
// }
// This is required for <main class="h-screen"> to function without page scroll.

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

  // Reviews & tabs state
  const [tab, setTab] = useState("desc"); // 'desc' | 'reviews'
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reviewsCount = reviews.length;
  const avgRating = reviewsCount
    ? Math.round((reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviewsCount) * 10) / 10
    : 0;

  const fmtCZK = useMemo(
    () => new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }),
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // 1) сам товар
        const { data: row, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        console.log("LOADED PRODUCT ROW:", row);
        if (error) throw error;

        // Принудительный парсинг JSON для name/description
        const parsedName = typeof row.name === "string" ? JSON.parse(row.name) : row.name;
        const parsedDesc = typeof row.description === "string" ? JSON.parse(row.description) : row.description;
        const name_obj = {
          cs: row.name_cs ?? (parsedName && parsedName.cs) ?? "",
          en: row.name_en ?? (parsedName && parsedName.en) ?? "",
          ru: row.name_ru ?? (parsedName && parsedName.ru) ?? "",
        };
        const desc_obj = {
          cs: row.description_cs ?? (parsedDesc && parsedDesc.cs) ?? "",
          en: row.description_en ?? (parsedDesc && parsedDesc.en) ?? "",
          ru: row.description_ru ?? (parsedDesc && parsedDesc.ru) ?? "",
        };
        const mapped = row
          ? {
              id: row.id,
              name: name_obj,
              description: desc_obj,
              price: row.price ?? 0,
              images: {
                data: [
                  { attributes: { url: row.image_url ?? "" } },
                ],
              },
            }
          : null;

        if (!cancelled) setProduct(mapped);

        // 2) варианты (если есть)
        const { data: v } = await supabase
          .from("product_variants")
          .select("id, product_id, name_cs, name_en, name_ru, qty, price, sort_order, is_default")
          .eq("product_id", id)
          .order("sort_order", { ascending: true });

        if (!cancelled) {
          setVariants(v || []);
          setSelectedVariant((v || []).find(x => x.is_default) || (v && v[0]) || null);
        }

        // 3) похожие — просто последние другие товары (без product_categories)
        const { data: rel } = await supabase
          .from("products")
          .select("id, name_cs, name_en, name_ru, price, image_url")
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(8);
        if (!cancelled) setRelated(rel || []);

        // 4) отзывы (загружаем отдельно и не ломаем общий рендер при ошибке)
        try {
          const { data: revs, error: revErr } = await supabase
            .from("product_reviews")
            .select("id, rating, comment, created_at, user_id")
            .eq("product_id", Number(id) || id)
            .order("created_at", { ascending: false })
            .limit(50);
          if (revErr) {
            console.warn("load reviews failed:", revErr);
            if (!cancelled) setReviews([]);
          } else if (!cancelled) {
            setReviews(revs || []);
          }
        } catch (e) {
          console.warn("load reviews failed:", e);
          if (!cancelled) setReviews([]);
        }
      } catch (err) {
        console.error("Supabase load product error:", err);
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
    const rName = i18n.language === "cs" ? r.name_cs : i18n.language === "ru" ? r.name_ru : r.name_en;
    const name = rName || t("noName");
    const price = Number(r.price || 0);
    const image = r.image_url || "";
    addToCart({ id: r.id, name, price, image });
  };

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!myRating || !reviewText.trim()) return;

    setSubmitting(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        alert(t("pleaseLoginToReview") || "Please log in to leave a review.");
        return;
      }

      const payload = {
        product_id: Number(id) || id,
        rating: Math.max(1, Math.min(5, Number(myRating))),
        comment: reviewText.trim().slice(0, 2000),
        user_id: userId,
      };

      const { data, error } = await supabase
        .from("product_reviews")
        .insert(payload)
        .select("id, rating, comment, created_at, user_id")
        .single();

      if (error) throw error;

      setReviews((prev) => [data, ...prev]);
      setMyRating(0);
      setReviewText("");
    } catch (err) {
      console.error("submit review failed:", err);
      alert(t("reviewSubmitError") || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

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
    <main className="flex flex-col min-h-screen overflow-x-hidden overflow-y-auto">
      <section className="w-full max-w-[1400px] mx-auto px-6 flex-1 flex flex-col z-10 pt-[80px] pb-[100px] overflow-visible">
        <div
          className={
            isDesktop
              ? "w-full max-w-[1200px] mx-auto px-6 py-8 flex items-start justify-center gap-12"
              : "w-full mx-auto flex flex-col px-4 overflow-visible min-h-[calc(100dvh-180px)]"
          }
        >
          {/* Изображение */}
          <div
            className={
              isDesktop
                ? "relative shrink-0 w-[560px] h-[560px] rounded-3xl overflow-hidden shadow-xl"
                : "relative w-full max-w-[720px] mx-auto flex-[0_0_50%] rounded-2xl overflow-hidden shadow-xl"
            }
          >
            <img
              src={product.images.data[0]?.attributes.url}
              alt={localName(product.name)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          {/* Контент */}
          <div className={isDesktop ? "flex-1 min-w-[360px] max-w-[560px] flex flex-col gap-6" : "w-full flex flex-col flex-[0_0_55%]"}>
            <div
              className={`${isDesktop ? "pt-4 pb-[120px] sm:px-8 lg:px-12" : "pt-1 pb-24 px-2 flex-1"} flex-1 scrollbar-none text-[#5C3A2E] text-balance`}
            >
              <div className="flex flex-col gap-5 lg:gap-8">
              {/* Заголовок + цена */}
              <div className={isDesktop ? "flex justify-between items-start gap-4" : "flex justify-between items-start gap-4 mt-3"}>
                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight text-center lg:text-left">
                    {localName(product.name)}
                  </h1>
                </div>
                <div className="text-right">
                  <div className="text-[#BDA47A] text-lg sm:text-xl font-semibold">
                    {displayPrice}
                  </div>
                </div>
              </div>

              {/* Варианты (только если есть) */}
              {variants.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-[#BDA47A] font-medium">{t("options.size") || "Размер набора"}</div>
                  <div className="flex flex-wrap gap-2">
                    {variants.map(v => {
                      const selected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 rounded-full border transition backdrop-blur
                            ${selected
                              ? "bg-[#BDA47A]/20 border-[#BDA47A] text-[#BDA47A]"
                              : "bg:white/10 border-white/20 text-[#5C3A2E] hover:bg-white/20"}`}
                          aria-pressed={selected}
                        >
                          {localVariantName(v)}{v.qty ? ` (${v.qty})` : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tabs (glass card with attached header) */}
              <section className="mt-2">
                <div className="rounded-3xl shadow-xl">
                  <div className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md overflow-hidden">
                    {/* Header */}
                    <div
                      role="tablist"
                      aria-label={t("tab.ariaLabel") || "Product tabs"}
                      className="relative grid grid-cols-2 text-sm font-medium"
                    >
                    <button
                      id="tab-desc"
                      type="button"
                      role="tab"
                      aria-selected={tab === "desc"}
                      aria-controls="tab-panel-desc"
                      onClick={() => setTab("desc")}
                      className={`px-5 py-3 transition relative ${
                        tab === "desc"
                          ? "text-[#5C3A2E]"
                          : "text-[#5C3A2E]/70 hover:text-[#5C3A2E]"
                      }`}
                    >
                      {t("tab.description") || "Описание"}
                    </button>
                    <button
                      id="tab-reviews"
                      type="button"
                      role="tab"
                      aria-selected={tab === "reviews"}
                      aria-controls="tab-panel-reviews"
                      onClick={() => setTab("reviews")}
                      className={`px-5 py-3 transition relative ${
                        tab === "reviews"
                          ? "text-[#5C3A2E]"
                          : "text-[#5C3A2E]/70 hover:text-[#5C3A2E]"
                      }`}
                    >
                      {t("tab.reviews") || "Отзывы"}{reviews.length ? ` (${reviews.length})` : ""}
                    </button>
                    {/* Active underline */}
                      <span
                        aria-hidden
                        className={`absolute bottom-0 h-[2px] bg-[#BDA47A] transition-transform duration-300 ease-out w-1/2 ${
                          tab === "reviews" ? "translate-x-full" : "translate-x-0"
                        }`}
                      />
                    </div>

                    {/* Panel */}
                    <div className="p-4 sm:p-5 lg:p-5">
                    {tab === "desc" ? (
                      <div
                        role="tabpanel"
                        id="tab-panel-desc"
                        aria-labelledby="tab-desc"
                        className="space-y-4"
                      >
                        <div className="mt-4 text-sm md:text-base text-center md:text-left whitespace-pre-line max-h-[45vh] overflow-y-auto">
                          <p className="text-sm sm:text-base lg:text-lg leading-relaxed opacity-90 text-center lg:text-left">
                            {localName(product.description) || t("noDescription")}
                          </p>
                          <div className="flex justify-end items-start gap-4">
                            <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                              <h3 className="text-sm lg:text-base font-semibold mb-1 text-right">
                                {t("allergensTitle")} (čísla EU): 6, 7
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        role="tabpanel"
                        id="tab-panel-reviews"
                        aria-labelledby="tab-reviews"
                        className="space-y-4"
                      >
                        <div className="mt-4 text-sm md:text-base text-center md:text-left whitespace-pre-line h-full overflow-y-auto">
                          {/* Average rating */}
                          <div className="flex items-center gap-2 text-[#BDA47A]">
                            <span className="font-medium">{avgRating || 0}/5</span>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(n => (
                                <span key={n} className={avgRating >= n ? "" : "opacity-30"}>★</span>
                              ))}
                            </div>
                            <span className="text-[#5C3A2E]/60 text-sm">({reviews.length || 0})</span>
                          </div>

                          {/* Reviews list */}
                          {reviews.length > 0 ? (
                            <div className="space-y-3">
                              {reviews.map(r => (
                                <div key={r.id} className="bg-white/10 border border-white/20 rounded-xl p-3">
                                  <div className="flex items-center gap-2 text-[#BDA47A] text-sm mb-1">
                                    {[1,2,3,4,5].map(n => (
                                      <span key={n} className={Number(r.rating) >= n ? "" : "opacity-30"}>★</span>
                                    ))}
                                    <span className="text-[#5C3A2E]/60 text-xs">
                                      {new Date(r.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#5C3A2E] whitespace-pre-wrap">{r.comment}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-[#5C3A2E]/70">{t("noReviews") || "Пока нет отзывов."}</p>
                          )}
                        </div>
                        {/* Review form */}
                        <form onSubmit={handleSubmitReview} className="space-y-2">
                          <div className="flex items-center gap-1 text-[#BDA47A]">
                            {[1,2,3,4,5].map(n => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setMyRating(n)}
                                aria-label={`rate ${n}`}
                                className={`text-xl transition ${myRating >= n ? "" : "opacity-30 hover:opacity-60"}`}
                              >★</button>
                            ))}
                          </div>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder={t("yourComment") || "Ваш комментарий"}
                            className="w-full min-h-[90px] rounded-2xl bg-white/10 border border-[#BDA47A]/40 px-3 py-2 resize-vertical outline-none ring-1 ring-[#BDA47A]/30 focus:ring-2 focus:ring-[#BDA47A]/60"
                            maxLength={2000}
                          />
                          <button
                            type="submit"
                            disabled={submitting || !myRating || !reviewText.trim()}
                            className="px-5 h-10 rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 disabled:opacity-50"
                          >
                            {submitting ? (t("submitting") || "Отправка...") : (t("send") || "Отправить")}
                          </button>
                        </form>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        </div>
      </section>
    </main>

    {/* Кнопки (десктоп) */}
    {isDesktop && (
      <div className="absolute bottom-0 right-0 z-[100] pointer-events-none">
        <div className="w-full max-w-[1400px] mx-auto px-6 flex justify-end items-center gap-3 pointer-events-auto">
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
    )}

    {/* Кнопки (мобилка) */}
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-0 right-0 z-[100] px-6 pointer-events-none">
      <div className="w-full max-w-[1400px] mx-auto flex justify-end items-center gap-3 pointer-events-auto">
        <div className="flex lg:hidden items-center gap-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setQuantity((p) => Math.max(1, p - 1))}
              className="w-6 h-6 rounded-full bg:white/10 border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur">&minus;</button>
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
