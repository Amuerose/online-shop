import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabaseClient";

// Safely resolve image URL: absolute URL stays as-is; otherwise, build a public URL from the Supabase bucket
const resolveImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  // Assume we store only the object path inside the `product-images` bucket
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data?.publicUrl || "";
};


// Pick a localized value from {cs,en,ru} or accept plain strings
const pickLocale = (val, lang) => {
  if (val == null) return '';

  // If it's a plain string, try to detect and parse JSON with translations
  let v = val;
  if (typeof v === 'string') {
    const trimmed = v.trim();
    const looksLikeJson =
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'));

    if (looksLikeJson) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object') v = parsed; // use parsed object below
      } catch (_) {
        // not a valid JSON -> treat as plain string
        return v;
      }
    } else {
      // regular plain string already
      return v;
    }
  }

  // If we got an object with translations, pick by language with fallbacks
  if (v && typeof v === 'object') {
    const byLang = v[lang];
    if (typeof byLang === 'string' && byLang.trim().length) return byLang;

    // reasonable fallbacks
    const fallbackOrder = ['en', 'cs', 'ru'];
    for (const key of fallbackOrder) {
      const candidate = v[key];
      if (typeof candidate === 'string' && candidate.trim().length) return candidate;
    }

    // as a last resort, return the first non-empty string value from the object
    const first = Object.values(v).find(
      (x) => typeof x === 'string' && x.trim().length > 0
    );
    return first || '';
  }

  return '';
};

// Normalize DB row to UI product
const normalizeProduct = (r, lang = 'cs') => {
  const nameObj = r.name ?? '';
  const descObj = r.description ?? '';

  const mainUrl = r.image_url ? r.image_url : '';
  return {
    id: r.id,
    category_id: r.category_id || null,
    attributes: {
      name: nameObj,
      description: descObj,
      price: Number(r.price ?? 0),
      images: {
        data: [
          { attributes: { url: mainUrl ? resolveImageUrl(mainUrl) : '' } }
        ]
      }
    }
  };
};

const Shop = () => {
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', slug: 'all', name: t('categories.all') }]);
  const [categoriesById, setCategoriesById] = useState({});

  // === Horizontal scroll affordance for categories ===
  const catWrapRef = useRef(null);
  const catScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // Show a one-time swipe hint (animated finger) on mount
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const updateCategoryShadows = () => {
    const el = catScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(maxScroll - el.scrollLeft > 2);
  };
  
  const scrollCatsBy = (dx) => {
    const el = catScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: 'smooth' });
  };

  // Главная картинка товара для карточки/корзины с безопасным запасным вариантом
  const getMainImage = (p) => {
    // 1) Новый формат: attributes.images.data[0].attributes.url
    const fromAttr = p?.attributes?.images?.data?.[0]?.attributes?.url;
    if (typeof fromAttr === 'string' && fromAttr.length) return fromAttr;

    // 2) Вариант: attributes.images как массив строк или объектов {url}
    const ai = p?.attributes?.images;
    if (Array.isArray(ai) && ai.length) {
      const u = ai[0]?.url || ai[0];
      if (typeof u === 'string' && u.length) return u;
    }

    // 3) Прямо на продукте: image_url (путь в бакете) — конвертим в публичный URL
    if (typeof p?.image_url === 'string' && p.image_url.length) {
      const url = resolveImageUrl(p.image_url);
      if (url) return url;
    }

    // 4) Запасной вариант: плейсхолдер
    return '/images/placeholder-image.jpg';
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

    // Also lock page scroll for wheel/trackpad while allowing inner scrollers
    const wheelHandler = (e) => {
      const elCategories = document.querySelector('.categories-scroll');
      const elProducts = document.querySelector('.products-scroll');
      const target = e.target;

      const insideCats = elCategories && elCategories.contains(target);
      const insideProds = elProducts && elProducts.contains(target);

      if (!insideCats && !insideProds) {
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', wheelHandler, { passive: false });

    // Hard lock the page scroll (Safari/iOS rubber-banding guard)
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOB = html.style.overscrollBehavior;
    const prevBodyOB = body.style.overscrollBehavior;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'contain';
    body.style.overscrollBehavior = 'contain';

    // initialize and listen for categories scroll/resizes
    updateCategoryShadows();
    const onScroll = () => updateCategoryShadows();
    const onResize = () => updateCategoryShadows();
    catScrollRef.current?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('touchmove', handler);
      document.removeEventListener('wheel', wheelHandler);

      // restore page overflow settings
      const html = document.documentElement;
      const body = document.body;
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOB;
      body.style.overscrollBehavior = prevBodyOB;

      catScrollRef.current?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
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

        const mapped = (rows || []).map((r) => normalizeProduct(r, i18n.language));

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

  // Swipe hint useEffect (moved from below, before return)
  useEffect(() => {
    const el = catScrollRef.current;
    if (!el) {
      // Hide hint quickly if no scroller yet
      const t = setTimeout(() => setShowSwipeHint(false), 1500);
      return () => clearTimeout(t);
    }

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // small nudge scroll: right then back
    if (!prefersReduced) {
      const originalLeft = el.scrollLeft;
      const step = Math.min(80, el.scrollWidth - el.clientWidth);
      if (step > 0) {
        el.scrollTo({ left: originalLeft, behavior: 'auto' });
        const t1 = setTimeout(() => el.scrollTo({ left: originalLeft + step, behavior: 'smooth' }), 300);
        const t2 = setTimeout(() => el.scrollTo({ left: originalLeft, behavior: 'smooth' }), 1200);
        const t3 = setTimeout(() => setShowSwipeHint(false), 2200);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
      }
    }

    const hide = setTimeout(() => setShowSwipeHint(false), 1500);
    return () => clearTimeout(hide);
  }, []);

  return (<>
    <div
      className="relative flex flex-col h-[100dvh] overflow-hidden overscroll-contain text-[#4B2E1D]"
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
        <div ref={catWrapRef} className="relative max-w-[1000px] mx-auto w-full">
          <div
            ref={catScrollRef}
            className="overflow-x-auto overscroll-contain touch-pan-x categories-scroll scrollbar-hide no-scrollbar"
            style={{
              WebkitOverflowScrolling: 'touch'
            }}
            onScroll={updateCategoryShadows}
          >
            <div className="flex justify-start gap-4 px-4">
              {categories.map((cat) => (
                <button
                  key={cat.slug || cat.id}
                  onClick={() => setSelectedCategory(cat.slug || cat.id)}
                  className={`shrink-0 text-sm sm:text-base px-4 py-2 rounded-full border backdrop-blur transition ${
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
          {showSwipeHint && (
            <div
              className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                className="w-10 h-10 opacity-80 animate-finger-swipe"
              >
                <g fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 36v-8a4 4 0 0 1 8 0v8"/>
                  <path d="M28 36v-12a4 4 0 0 1 8 0v12"/>
                  <path d="M36 36v-10a4 4 0 0 1 8 0v10"/>
                  <path d="M44 36v-6a4 4 0 0 1 8 0v10c0 8-6 14-14 14H28c-6 0-11-5-11-11v-7"/>
                  <path d="M14 28c-2-2-6-2-8 0" opacity=".4"/>
                </g>
              </svg>
              <span className="text-white/80 text-sm font-[Inter] select-none">
                {t('hints.swipe', 'Свайпните')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Карточки */}
      <div className="products-scroll overflow-y-auto h-[calc(100dvh-112px-120px)] pb-[calc(184px+var(--safe-area-inset-bottom,0px))]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 sm:px-4 pb-10 max-w-[1200px] mx-auto">
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
                <h3 className="text-base sm:text-lg font-[Inter] font-semibold tracking-wide mb-1 leading-tight text-[#4B2E1D]">
                  {pickLocale(product.attributes.name, i18n.language)}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A4E35]/70 mb-3 leading-snug line-clamp-2">
                  {pickLocale(product.attributes.description, i18n.language)}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm sm:text-base font-[Inter] font-semibold text-[#BDA47A]">
                    {Number(product.attributes.price) || 0} Kč
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("🛒 Adding to cart:", product);
                      try {
                        const item = {
                          id: product.id,
                          title: pickLocale(product?.attributes?.name, i18n.language),
                          price: Number(product?.attributes?.price) || 0,
                          qty: 1,
                          image: getMainImage(product),
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
  <style>{`
  @keyframes finger-swipe {
    0% { transform: translateX(0) translateY(0); opacity: 0.0; }
    10% { opacity: 1; }
    40% { transform: translateX(42px) translateY(-2px); opacity: 1; }
    60% { transform: translateX(0) translateY(0); opacity: 0.9; }
    70% { opacity: 0.0; }
    75% { opacity: 1; }
    95% { transform: translateX(38px) translateY(-2px); opacity: 1; }
    100% { transform: translateX(0) translateY(0); opacity: 0.0; }
  }
  .animate-finger-swipe {
    animation: finger-swipe 2.1s ease-in-out 1 both;
    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.15));
  }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
`}</style>
</>);
};

export default Shop;