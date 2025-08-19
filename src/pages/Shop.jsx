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
  const [categories, setCategories] = useState([{ id: 'all', slug: 'all', name: t('categories.all') }]);
  const [categoriesById, setCategoriesById] = useState({});

  // Safely resolve image URL: absolute URL stays as-is; otherwise, build a public URL from the Supabase bucket
  const resolveImageUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path; // already absolute
    // Assume we store only the object path inside the `product-images` bucket
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data?.publicUrl || "";
  };

  // Главная картинка товара для карточки/корзины с безопасным запасным вариантом
  const getMainImage = (p) => {
    const fromAttr = p?.attributes?.images?.data?.[0]?.attributes?.url;
    return fromAttr || '/images/placeholder-image.jpg';
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

    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, slug, name');

        if (error) throw error;

        const dynamic = (data || []).map((c) => ({
          id: c.id,
          slug: c.slug || String(c.id),
          name: c.name || c.slug || String(c.id),
        }));

        const withAll = [
          { id: 'all', slug: 'all', name: t('categories.all') },
          ...dynamic,
        ];

        if (!cancelled) {
          setCategories(withAll);
          const map = {};
          withAll.forEach((c) => (map[c.id] = c));
          if (!cancelled) setCategoriesById(map);
        }
      } catch (e) {
        // Fallback to static list if categories table doesn't exist
        const fallback = [
          { id: 'all', slug: 'all', name: t('categories.all') },
          { id: 'strawberries', slug: 'strawberries', name: t('categories.strawberries') },
          { id: 'blueberries', slug: 'blueberries', name: t('categories.blueberries') },
          { id: 'raspberries', slug: 'raspberries', name: t('categories.raspberries') },
          { id: 'bananas', slug: 'bananas', name: t('categories.bananas') },
          { id: 'dates', slug: 'dates', name: t('categories.dates') },
          { id: 'cherries', slug: 'cherries', name: t('categories.cherries') },
          { id: 'sets', slug: 'sets', name: t('categories.sets') },
          { id: 'gifts', slug: 'gifts', name: t('categories.gifts') },
        ];
        if (!cancelled) {
          setCategories(fallback);
          const map = {};
          fallback.forEach((c) => (map[c.id] = c));
          if (!cancelled) setCategoriesById(map);
        }
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
    // re-run when language changes to refresh t() for "all"
  }, [i18n.language]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // First try to include category_id if it exists
        let rows, error;

        ({ data: rows, error } = await supabase
          .from('products')
          .select('id, name, description, price, image_url, category_id, created_at')
          .order('created_at', { ascending: false }));

        if (error) {
          // Retry without category_id for older schema
          ({ data: rows, error } = await supabase
            .from('products')
            .select('id, name, description, price, image_url, created_at')
            .order('created_at', { ascending: false }));
          if (error) throw error;
        }

        const mapped =
          (rows || []).map((r) => ({
            id: r.id,
            category_id: r.category_id || null,
            attributes: {
              // Держим старую форму, но заполняем одинаковым значением под все языки
              name: {
                cs: r.name || '',
                en: r.name || '',
                ru: r.name || '',
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

        // Применяем фильтрацию по выбранной категории, если она не "all"
        const filtered =
          selectedCategory === 'all'
            ? mapped
            : mapped.filter((p) => {
                if (!p.category_id) return false;
                const cat = categoriesById[p.category_id];
                return cat && (cat.slug === selectedCategory || cat.id === selectedCategory);
              });

        if (!cancelled) setProducts(filtered);
      } catch (err) {
        console.error('Supabase load products error:', err);
        if (!cancelled) setProducts([]);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [i18n.language, selectedCategory, categoriesById]);

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
                key={cat.slug || cat.id}
                onClick={() => setSelectedCategory(cat.slug || cat.id)}
                className={`shrink-0 text-sm sm:text-base px-4 py-2 rounded-full border backdrop-blur transition
                  ${
                    selectedCategory === (cat.slug || cat.id)
                      ? 'bg-white/20 text-[#BDA47A] border-white/40'
                      : 'bg-white/10 text-[#BDA47A] border-white/20 hover:bg-white/20'
                  }`}
              >
                {cat.name || cat.slug}
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
                  src={getMainImage(product)}
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
                        const item = {
                          id: product.id,
                          title:
                            typeof product?.attributes?.name === 'string'
                              ? product.attributes.name
                              : (product?.attributes?.name?.[i18n.language]
                                  || product?.attributes?.name?.en
                                  || product?.attributes?.name?.ru
                                  || ''),
                          price: Number(product?.attributes?.price) || 0,
                          qty: 1,
                          imageUrl: getMainImage(product),
                        };
                        addToCart(item);
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