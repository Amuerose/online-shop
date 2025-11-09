import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function GlobalSearch({ isMobile = false }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      if (isMounted) {
        const items = data.map(item => ({
          id: item.id,
          name: {
            cs: item.name_cs,
            en: item.name_en,
            ru: item.name_ru,
          },
          description: {
            cs: item.description_cs,
            en: item.description_en,
            ru: item.description_ru,
          },
          price: item.price,
          image: item.image_url,
        }));
        setProducts(items);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [i18n.language]);

  const filteredProducts = products.filter((product) => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return false;

    const names = Object.values(product.name || {}).filter(Boolean).map(n => n.toLowerCase());
    const descriptions = Object.values(product.description || {}).filter(Boolean).map(d => d.toLowerCase());

    return (
      names.some(n => n.includes(searchTerm)) ||
      descriptions.some(d => d.includes(searchTerm))
    );
  });

  return (
    <div
      className={`relative ml-auto ${
        isMobile ? "w-full" : "w-full max-w-[400px]"
      }`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className={`w-full px-4 py-1 text-sm rounded-full border border-white/20 bg-[rgba(255,255,255,0.06)] text-[#BDA47A] placeholder-[#BDA47A]/50 backdrop-blur-[22px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[#BDA47A] transition ${
          isMobile ? "text-base py-1" : ""
        }`}
      />

      {query.length > 0 && (
        <div
          className={`absolute mt-[16px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 rounded-xl shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] z-50 max-h-64 overflow-y-auto ${
            isMobile ? "left-0 w-full" : "right-0 w-[400px]"
          }`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => { navigate(`/product/${product.id}`); setQuery(""); }}
                className="w-full text-left px-4 py-2 border-b border-white/10 text-[#BDA47A] hover:bg-white/5 transition"
              >
                {product.name?.[i18n.language] || "Без названия"}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-[#BDA47A]/70">
              Нет результатов
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;