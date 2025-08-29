import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import useIsDesktop from "../hooks/useIsDesktop";

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

  // Safe translation helper (prevents React errors if i18next returns an object)
  const tt = useCallback((key, def = "") => {
    const v = t(key, { defaultValue: def, returnObjects: false });
    return typeof v === "string" ? v : def;
  }, [t]);

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("desc"); // desc | reviews
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
          .select("id, name_cs, name_en, name_ru, description_cs, description_en, description_ru, price, image_url")
          .eq("id", id)
          .single();
        if (error) throw error;

        const mapped = row
          ? {
              id: row.id,
              name: {
                cs: row.name_cs ?? row.name_en ?? row.name_ru ?? "",
                en: row.name_en ?? row.name_cs ?? row.name_ru ?? "",
                ru: row.name_ru ?? row.name_en ?? row.name_cs ?? "",
              },
              description: {
                cs: row.description_cs ?? "",
                en: row.description_en ?? "",
                ru: row.description_ru ?? "",
              },
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

        // 3) похожие — другие товары из тех же категорий
        const { data: cats } = await supabase
          .from("product_categories")
          .select("category_id")
          .eq("product_id", id);

        const categoryIds = [...new Set((cats || []).map(c => c.category_id))];
        if (categoryIds.length) {
          const { data: inCat } = await supabase
            .from("product_categories")
            .select("product_id")
            .in("category_id", categoryIds)
            .neq("product_id", id)
            .limit(40);

          const relIds = [...new Set((inCat || []).map(r => r.product_id))].slice(0, 8);
          if (relIds.length) {
            const { data: rel } = await supabase
              .from("products")
              .select("id, name_cs, name_en, name_ru, price, image_url")
              .in("id", relIds);

            if (!cancelled) setRelated(rel || []);
          } else if (!cancelled) {
            setRelated([]);
          }
        } else if (!cancelled) {
          setRelated([]);
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

    // load reviews for this product
    async function loadReviews() {
      try {
        setRevLoading(true);
        const { data, error } = await supabase
          .from("product_reviews")
          .select("id, product_id, author_name, rating, comment, created_at")
          .eq("product_id", id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (!cancelled) setReviews(data || []);
      } catch (e) {
        console.error("Supabase load reviews error:", e);
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setRevLoading(false);
      }
    }

    load();
    loadReviews();
    return () => { cancelled = true; };
  }, [id, i18n.language]);

  const localName = (obj) => obj?.[i18n.language] || obj?.en || obj?.cs || obj?.ru || "";
  const localVariantName = (v) =>
    i18n.language === "cs" ? v.name_cs : i18n.language === "ru" ? v.name_ru : v.name_en;

  const displayPrice = useMemo(() => {
    const p = selectedVariant ? selectedVariant.price : product?.price || 0;
    return fmtCZK.format(Number(p) || 0);
  }, [selectedVariant, product, fmtCZK]);

  const avgRating = useMemo(() => {
    if (!reviews?.length) return 0;
    const s = reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0);
    return Math.round((s / reviews.length) * 10) / 10; // one decimal
  }, [reviews]);

  if (loading) return <div className="text-center py-10 text-[#BDA47A]">{tt("loading", "Loading…")}</div>;
  if (!product) return <div className="text-center py-10 text-[#BDA47A]">{tt("productNotFound", "Product not found")}</div>;

  const handleAdd = () => {
    if (!product) return;

    const lang = i18n.language;
    const baseName = product.name?.[lang] || tt("noName", "No name");
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
    const name = rName || tt("noName", "No name");
    const price = Number(r.price || 0);
    const image = r.image_url || "";
    addToCart({ id: r.id, name, price, image });
  };

  const submitReview = useCallback(async () => {
    if (!myRating || myRating < 1) return;
    setSubmitting(true);
    try {
      const payload = {
        product_id: id,
        rating: Math.max(1, Math.min(5, myRating)),
        comment: myComment?.trim() || null,
        author_name: null,
      };
      const { data, error } = await supabase
        .from("product_reviews")
        .insert(payload)
        .select();
      if (error) throw error;
      setReviews((prev) => [ ...(data || []), ...prev ]);
      setMyRating(0);
      setMyComment("");
    } catch (e) {
      console.error("Supabase submit review error:", e);
    } finally {
      setSubmitting(false);
    }
  }, [id, myRating, myComment]);

  return (
    <main className="relative h-[100dvh] overflow-hidden overscroll-contain flex items-center justify-center pt-[calc(env(safe-area-inset-top)+86px)] pb-[calc(env(safe-area-inset-bottom)+102px)]">
      <div className={`w-full max-w-[1400px] flex ${isDesktop ? 'flex-row items-center h-[600px]' : 'flex-col h-full'}`}>
        {/* Изображение */}
        <div className={`w-full flex-shrink-0 flex justify-center items-center relative ${isDesktop
              ? 'lg:w-1/2 lg:h-full lg:pt-0 rounded-3xl overflow-hidden shadow-2xl'
              : 'h-[40dvh] mb-4 ml-4 mr-4 max-w-[calc(100vw-32px)] rounded-3xl overflow-hidden shadow-2xl relative self-center'}`}>
          <div className="w-full h-full z-10 relative">
            <img
              src={product?.images?.data?.[0]?.attributes?.url || ""}
              alt={localName(product.name)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Контент */}
        <div className={`w-full flex flex-col min-h-0 max-h-full overflow-hidden ${isDesktop ? 'lg:w-1/2 lg:h-full justify-center' : 'flex-1'}`}>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 lg:px-16 scrollbar-none text-[#5C3A2E] pt-0 pb-0">
            <div className="flex flex-col gap-5 lg:gap-8">
              {/* Заголовок + цена */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold leading-tight text-center lg:text-left">
                    {localName(product.name)}
                  </h1>
              <div className="flex mt-4 items-center gap-2 select-none">
                {[1,2,3,4,5].map((n) => (
                  <span key={n} className={n <= Math.round(avgRating) ? "text-[#BDA47A]" : "text-[#BDA47A]/40"}>★</span>
                ))}
                <span className="text-xs text-[#BDA47A]/70">{avgRating ? avgRating.toFixed(1) : "0.0"} · {reviews.length}</span>
              </div>
                </div>
                <div className="text-right">
                  <div className="text-[#BDA47A] text-xl sm:text-2xl lg:text-3xl font-semibold">
                    {displayPrice}
                  </div>
                </div>
              </div>

              {/* Tabs: Description / Reviews */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setActiveTab("desc")} className={`px-3 py-1.5 rounded-full border text-sm transition ${activeTab === "desc" ? "border-[#BDA47A] text-[#BDA47A] bg-[#BDA47A]/10" : "border-white/20 text-[#5C3A2E] bg-white/5 hover:bg-white/10"}`}>{tt("description", "Description")}</button>
                <button type="button" onClick={() => setActiveTab("reviews")} className={`px-3 py-1.5 rounded-full border text-sm transition ${activeTab === "reviews" ? "border-[#BDA47A] text-[#BDA47A] bg-[#BDA47A]/10" : "border-white/20 text-[#5C3A2E] bg-white/5 hover:bg-white/10"}`}>{tt("reviewsTitle", "Reviews")} ({reviews.length})</button>
              </div>

              {activeTab === "desc" ? (
                <>
                  <p className="text-xs sm:text-sm lg:text-base leading-relaxed opacity-90 text-center lg:text-left">
                    {localName(product.description) || tt("noDescription", "No description yet")}
                  </p>
                  {/* Аллергены */}
                  <div className="flex justify-between items-start gap-4">
                    <div />
                    <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                      <h3 className="text-sm lg:text-base font-semibold mb-1 text-right">
                        {tt("allergensTitle", "Allergens")} (čísla EU): 6, 7
                      </h3>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Write review */}
                  <div className="bg-white/10 border border-white/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-[#BDA47A]">{tt("yourRating", "Your rating")}</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((n) => (
                          <button key={n} type="button" onClick={() => setMyRating(n)} aria-pressed={myRating===n} className="leading-none">
                            <span className={n <= myRating ? "text-[#BDA47A]" : "text-[#BDA47A]/40"}>★</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      className="w-full rounded-xl border border-[#BDA47A]/40 bg-white/10 text-[#5C3A2E] placeholder-[#BDA47A]/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BDA47A]/50 transition"
                      rows={3}
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                      placeholder={tt("review.yourComment", "Your comment")}
                    />
                    <div className="mt-2 flex justify-end">
                      <button type="button" disabled={submitting || !myRating} onClick={submitReview} className="px-4 py-2 rounded-full bg-[#BDA47A]/20 text-[#BDA47A] border border-[#BDA47A]/40 hover:bg-[#BDA47A]/30 transition disabled:opacity-50">
                        {submitting ? tt("loading", "Loading…") : tt("review.submit", "Submit")}
                      </button>
                    </div>
                  </div>

                  {/* Reviews list */}
                  <div className="space-y-3">
                    {revLoading && <div className="text-[#BDA47A] text-sm">{tt("loading", "Loading…")}</div>}
                    {!revLoading && reviews.length === 0 && (
                      <div className="text-[#BDA47A]/70 text-sm">{tt("noReviewsYet", "No reviews yet.")}</div>
                    )}
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-white/5 border border-white/15 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((n) => (
                              <span key={n} className={n <= (Number(r.rating)||0) ? "text-[#BDA47A]" : "text-[#BDA47A]/40"}>★</span>
                            ))}
                          </div>
                          <span className="text-xs text-[#BDA47A]/70">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                        {r.comment && <p className="mt-1 text-sm text-[#5C3A2E] whitespace-pre-wrap">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Похожие товары */}
              {related.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-base lg:text-lg font-semibold mb-3 text-[#5C3A2E]">
                    {tt("youMayAlsoLike", "You may also like")}
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                    {related.map(r => {
                      const rName =
                        i18n.language === "cs" ? r.name_cs :
                        i18n.language === "ru" ? r.name_ru : r.name_en;
                      return (
                        <div
                          key={r.id}
                          className="min-w-[200px] max-w-[220px] bg-white/10 border border-white/20 rounded-2xl overflow-hidden text-left hover:bg-white/20 transition"
                        >
                          <button
                            onClick={() => navigate(`/product/${r.id}`)}
                            className="w-full text-left"
                            type="button"
                          >
                            <div className="w-full h-[130px] bg-white/5">
                              <img src={r.image_url || ""} alt={rName} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-2">
                              <div className="text-sm font-medium line-clamp-2 text-[#5C3A2E]">{rName}</div>
                              <div className="text-xs text-[#BDA47A] mt-1">{fmtCZK.format(Number(r.price || 0))}</div>
                            </div>
                          </button>
                          <div className="px-2 pb-2">
                            <button
                              type="button"
                              onClick={() => handleQuickAdd(r)}
                              className="w-full h-9 rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition text-sm font-medium"
                            >
                              {tt("buttons.addToCart", "Add to cart")}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки (десктоп) */}
      {isDesktop && (
        <div className="fixed left-0 right-0 bottom-[calc(env(safe-area-inset-bottom)+24px)] z-40 pointer-events-none">
          <div className="w-full max-w-[1400px] mx-auto px-6 flex justify-end gap-3 pointer-events-auto">
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
              className="h-10 px-6 rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition text-base font-medium"
            >
              {tt("buttons.addToCart", "Add to cart")}
            </button>
          </div>
        </div>
      )}

      {/* Кнопки (мобилка) */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-0 right-0 z-50 px-6 pointer-events-none">
        <div className="w-full max-w-[1400px] mx-auto flex justify-end lg:justify-center items-center gap-3 pointer-events-auto">
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
              className="h-10 px-6 rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition text-base font-medium"
            >
              {tt("buttons.addToCart", "Add to cart")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;