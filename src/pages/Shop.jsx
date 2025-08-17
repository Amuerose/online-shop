import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabaseClient";

const Shop = () => {
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);

  // Safely resolve image URL: absolute URL stays as-is; otherwise, build a public URL from the Supabase bucket
  const resolveImageUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path; // already absolute
    // Assume we store only the object path inside the `product-images` bucket
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data?.publicUrl || "";
  };

  useEffect(() => {
    const handler = (e) => {
      const elCategories = document.querySelector('.categories-scroll');
      const elProducts = document.querySelector('.products-scroll');
      if (
        (elCategories && !elCategories.contains(e.target)) &&
        (elProducts && !elProducts.contains(e.target))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', handler, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handler);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Запрашиваем данные из таблицы products
        // Подстроено под минимальную схему: id, name_cs, name_en, name_ru, price, image_url
        const { data: rows, error } = await supabase
          .from("products")
          .select("id, name_cs, name_en, name_ru, price, image_url");

        if (error) throw error;

        // Приводим к форме, ожидаемой текущим UI (имитация структуры Strapi)
        const mapped =
          (rows || []).map((r) => ({
            id: r.id,
            attributes: {
              name: {
                cs: r.name_cs ?? r.name_en ?? r.name_ru ?? "",
                en: r.name_en ?? r.name_cs ?? r.name_ru ?? "",
                ru: r.name_ru ?? r.name_en ?? r.name_cs ?? "",
              },
              price: r.price ?? 0,
              images: {
                data: [
                  {
                    attributes: {
                      url: resolveImageUrl(r.image_url),
                    },
                  },
                ],
              },
            },
          })) || [];

        if (!cancelled) setProducts(mapped);
      } catch (err) {
        console.error("Supabase load products error:", err);
        if (!cancelled) setProducts([]);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [i18n.language]);

  const categories = [
    'all',
    'strawberries',
    'blueberries',
    'raspberries',
    'bananas',
    'dates',
    'cherries',
    'sets',
    'gifts',
  ];

  return (
    <div
      className="relative flex flex-col h-[100dvh] text-[#4B2E1D]"
      style={{
        background: [
          'linear-gradient(120deg, #F7F0E8 0%, #EDE3D4 50%, #E4D8C6 100%)',
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 70%)',
          'radial-gradient(circle at 80% 80%, rgba(189,164,122,0.2) 0%, transparent 60%)'
        ].join(', '),
      }}
    >
      <div
        className="pointer-events-none absolute top-[120px] left-[100px] w-[160px] h-[400px] z-0 rotate-[12deg]"
        style={{
          background: 'radial-gradient(ellipse at 40% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(80px)',
          opacity: 0.6,
        }}
      />
      <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-white/30 blur-[120px] opacity-50 z-0" />
      {/* Категории */}
      <div className="pt-24 pb-4">
        <div
          className="overflow-x-auto w-full overscroll-contain touch-pan-x categories-scroll scrollbar-hide pb-[30px] mb-[-30px]"
          style={{ WebkitOverflowScrolling: 'touch', clipPath: 'inset(0 0 30px 0)' }}
        >
          <div className="flex justify-start md:justify-center gap-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 text-sm sm:text-base px-4 py-2 rounded-full border backdrop-blur transition
                  ${
                    selectedCategory === cat
                      ? 'bg-white/20 text-[#BDA47A] border-white/40'
                      : 'bg-white/10 text-[#BDA47A] border-white/20 hover:bg-white/20'
                  }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Карточки */}
      <div className="products-scroll overflow-y-auto h-[calc(100dvh-112px-120px)] pb-[calc(184px+var(--safe-area-inset-bottom,0px))]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 px-2 sm:px-4 pb-10 max-w-[1600px] mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="cursor-pointer bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl flex flex-col min-h-[320px] transition hover:scale-[1.02] overflow-hidden"
            >
              <div className="w-full h-56">
                <img
                  src={product.attributes.images.data[0]?.attributes.url || ""}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="text-sm font-[Inter] font-semibold tracking-wide mb-2 leading-tight text-[#BDA47A]">
                  {product.attributes.name[i18n.language] || product.attributes.name.en}
                </h3>
                <p className="text-xs text-[#7A4E35]/60 mb-4 leading-snug">&nbsp;</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-[Inter] font-semibold text-[#BDA47A]">
                    {product.attributes.price} Kč
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("🛒 Adding to cart:", product);
                      try {
                        addToCart(product);
                      } catch (error) {
                        console.error("❌ Error adding to cart:", error);
                      }
                    }}
                    className="text-sm font-[Inter] px-4 py-1 rounded-full border border-white/20 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition text-[#BDA47A]"
                  >
                    {t('buttons.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center text-[#7A4E35]/70 py-10">
              {t('messages.noProducts', 'Пока нет товаров.')} 
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;