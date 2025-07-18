import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function GlobalSearch({ isMobile = false }) {
  const { i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:1337/api/products?populate=*&locale=${i18n.language}`)
      .then(res => res.json())
      .then(({ data }) => {
        const items = data.map(item => ({
          id: item.id,
          ...item.attributes
        }));
        setProducts(items);
      })
      .catch(console.error);
  }, [i18n.language]);

  const filteredProducts = products.filter((product) => {
    const name = typeof product.name === "string"
      ? product.name
      : product.name?.[i18n.language];
    return name?.toLowerCase().includes(query.toLowerCase());
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
              <div
                key={product.id}
                className="px-4 py-2 border-b border-white/10 text-[#BDA47A] hover:bg-white/5 transition"
              >
                {product.name?.[i18n.language] || "Без названия"}
              </div>
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