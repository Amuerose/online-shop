import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { catalogProducts } from '../data/catalog';
import { blogBackgroundStyle } from '../styles/blogBackground';


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


const Shop = () => {
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // === Horizontal scroll affordance for categories ===
  const catScrollRef = useRef(null);
  // Show a one-time swipe hint (animated finger) on mount

  const updateCategoryShadows = () => {
    const el = catScrollRef.current;
    if (!el) return;
  };
  

  // Главная картинка товара для карточки/корзины
  const getMainImage = (p) => {
    const g0 = p?.gallery?.[0];
    if (typeof g0 === 'string' && g0.length) return g0;
    return '/images/placeholder.svg';
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

  // (categories loader useEffect removed)

  useEffect(() => {
    // Local catalog source (no backend)
    const list = (catalogProducts || []).slice();
    const moveToEnd = new Set([
      'lyo-raspberry-white',
      'figs-chocolate',
      'signature-raspberry',
      'signature-blueberry',
    ]);
    const head = list.filter((p) => !moveToEnd.has(p.id));
    const tail = list.filter((p) => moveToEnd.has(p.id));
    setProducts([...head, ...tail]);
  }, []);

  return (<>
    <div
      className="relative flex flex-col h-[100dvh] overflow-hidden overscroll-contain text-[#4B2E1D]"
      style={blogBackgroundStyle}
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
      {/* Карточки */}
      <div className="products-scroll overflow-y-auto mt-[calc(120px+var(--safe-area-inset-top,0px))] h-[calc(100dvh-120px-var(--safe-area-inset-top,0px))] pb-[calc(184px+var(--safe-area-inset-bottom,0px))]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 sm:px-4 pb-10 max-w-[1200px] mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.slug || product.id}`)}
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
                  {pickLocale(product.title, i18n.language)}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A4E35]/70 mb-3 leading-snug line-clamp-2">
                  {pickLocale(product.description, i18n.language)}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm sm:text-base font-[Inter] font-semibold text-[#BDA47A]">
                    {Number(product.price) || 0} Kč
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("🛒 Adding to cart:", product);
                      try {
                        const item = {
                          id: product.id,
                          name: pickLocale(product?.title, i18n.language),
                          price: Number(product?.price) || 0,
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
