import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import { useState, useEffect } from "react";
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
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const { data: row, error } = await supabase
          .from("products")
          .select("id, name_cs, name_en, name_ru, description_cs, description_en, description_ru, price, image_url")
          .eq("id", id)
          .single();

        if (error) throw error;

        const mapped = row
          ? {
              id: row.id,
              // Сохраняем форму, совместимую с существующей разметкой
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
                  {
                    attributes: {
                      url: row.image_url ?? "",
                    },
                  },
                ],
              },
            }
          : null;

        if (!cancelled) setProduct(mapped);
      } catch (err) {
        console.error("Supabase load product error:", err);
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, i18n.language]);

  if (loading) {
    return <div className="text-center py-10 text-[#BDA47A]">Loading...</div>;
  }
  if (!product) {
    return <div className="text-center py-10 text-[#BDA47A]">{t("productNotFound")}</div>;
  }

  const handleAdd = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
    }
  };

  return (
    <main className="relative h-[100dvh] overflow-hidden overscroll-contain flex items-center justify-center pt-[calc(env(safe-area-inset-top)+86px)] pb-[calc(env(safe-area-inset-bottom)+102px)]">
      <div
        className={`w-full max-w-[1400px] flex ${
          isDesktop ? 'flex-row items-center h-[600px]' : 'flex-col h-full'
        }`}
      >
        {/* Левая часть — изображение */}
        <div
          className={`w-full flex-shrink-0 flex justify-center items-center relative ${
            isDesktop
              ? 'lg:w-1/2 lg:h-full lg:pt-0 rounded-3xl overflow-hidden shadow-2xl'
              : 'h-[40dvh] mb-4 ml-4 mr-4 max-w-[calc(100vw-32px)] rounded-3xl overflow-hidden shadow-2xl relative self-center'
          }`}
        >
          {/* TODO: 230px is a fixed offset from legacy layout. Replace with dynamic height from layout context if refactoring. */}
          <div className="w-full h-full z-10 relative">
            <img
              src={product.images.data[0]?.attributes.url}
              alt={product.name?.[i18n.language]}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Правая часть — контент */}
        <div
          className={`w-full flex flex-col min-h-0 max-h-full overflow-hidden ${
            isDesktop ? 'lg:w-1/2 lg:h-full justify-center' : 'flex-1'
          }`}
        >
          <div
            className={`flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 lg:px-16 scrollbar-none text-[#5C3A2E] pt-0 pb-0`}
          >
            <div className="flex flex-col gap-5 lg:gap-8">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold leading-tight text-center lg:text-left">
                    {product.name?.[i18n.language] || t("noName")}
                  </h1>
                  <div className="flex mt-4">
                    {/* Рейтинг (визуально только, поведение добавим позже при необходимости) */}
                    <div className="flex gap-1 text-[#BDA47A] text-lg sm:text-xl lg:text-2xl cursor-pointer">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>☆</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-[#BDA47A] hover:text-[#BDA47A]/70 transition text-sm sm:text-base lg:text-lg">
                  <span className="text-2xl">♡</span>
                  <span className="hidden sm:inline">{t("addToFavorites")}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm lg:text-base leading-relaxed opacity-90 text-center lg:text-left">
                {product.description?.[i18n.language] || t("noDescription")}
              </p>
              <div className="flex justify-between items-start gap-4">
                <label className="block text-[#BDA47A] text-lg sm:text-xl lg:text-2xl cursor-pointer">
                  <span className="block mb-1">{t("review.yourRating")}</span>
                  <div className="flex gap-1">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>☆</span>
                  </div>
                </label>
                <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                  <h3 className="text-sm lg:text-base font-semibold mb-1 text-right">{t("allergensTitle")} (čísla EU): 6, 7</h3>
                </div>
              </div>

              {/* Отзывы */}
              <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                <h3 className="text-sm lg:text-base font-semibold mb-1">{t("reviewsTitle")}</h3>
                <div className="text-sm lg:text-base space-y-2">
                  <form className="space-y-2">
                    <label className="block">
                      <textarea
                        className="w-full rounded-xl border border-[#BDA47A]/40 bg-white/10 text-[#5C3A2E] placeholder-[#BDA47A]/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BDA47A]/50 transition"
                        rows={4}
                        placeholder={t("review.yourComment")}
                      />
                    </label>
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 rounded-full bg-[#BDA47A]/20 text-[#BDA47A] border border-[#BDA47A]/40 hover:bg-[#BDA47A]/30 transition"
                    >
                      {t("review.submit")}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div> {/* закрытие карточки товара */}

      {isDesktop && (
        <div className="fixed left-0 right-0 top-[calc(50%+340px)] z-40 pointer-events-none">
          <div className="w-full max-w-[1400px] mx-auto px-6 flex justify-end gap-3 pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur"
              >
                &minus;
              </button>
              <span className="min-w-[26px] text-center text-[#BDA47A] text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="h-10 px-6 rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition text-base font-medium"
            >
              {t("buttons.addToCart")}
            </button>
          </div>
        </div>
      )}

      {/* Нижняя панель */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-0 right-0 z-50 px-6 pointer-events-none">
        <div className="w-full max-w-[1400px] mx-auto flex justify-end lg:justify-center items-center gap-3 pointer-events-auto">
          <div className="flex lg:hidden items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur"
              >
                &minus;
              </button>
              <span className="min-w-[26px] text-center text-[#BDA47A] text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-sm text-[#BDA47A] hover:bg-white/20 transition backdrop-blur"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="h-10 px-6 rounded-full backdrop-blur-md bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition text-base font-medium"
            >
              {t("buttons.addToCart")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;