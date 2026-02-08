import React, { useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { catalogProducts } from "../data/catalog";

const pickLocale = (val, lang) => {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return (
      val?.[lang] ||
      val?.cs ||
      val?.en ||
      val?.ru ||
      Object.values(val).find((x) => typeof x === "string" && x.trim()) ||
      ""
    );
  }
  return "";
};

const normalizeText = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function GlobalSearch({ isMobile = false }) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const searchTerm = normalizeText(query.trim());
    if (!searchTerm) return [];

    const list = Array.isArray(catalogProducts) ? catalogProducts : [];

    return list
      .map((p) => {
        const name = pickLocale(p?.title, i18n.language);
        const desc = pickLocale(p?.description, i18n.language);
        const hay = normalizeText(`${name} ${desc}`);
        if (!hay.includes(searchTerm)) return null;
        return {
          id: p?.id,
          slug: p?.slug,
          name,
        };
      })
      .filter(Boolean)
      .slice(0, 12);
  }, [query, i18n.language]);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative ml-auto ${isMobile ? "w-full" : "w-full max-w-[400px]"}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={t("search.placeholder", "Search...")}
        className={`w-full px-4 py-1 text-sm rounded-full border border-white/20 bg-[rgba(255,255,255,0.06)] text-[#BDA47A] placeholder-[#BDA47A]/50 backdrop-blur-[22px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[#BDA47A] transition ${
          isMobile ? "text-base py-1" : ""
        }`}
      />

      {showDropdown && (
        <div
          className={`absolute mt-[16px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 rounded-xl shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] z-50 max-h-64 overflow-y-auto ${
            isMobile ? "left-0 w-full" : "right-0 w-[400px]"
          }`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={String(product.slug || product.id)}
                type="button"
                onClick={() => {
                  navigate(`/product/${product.slug || product.id}`);
                  setQuery("");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 border-b border-white/10 text-[#BDA47A] hover:bg-white/5 transition"
              >
                {product.name || (t("noTitle", "Без названия"))}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-[#BDA47A]/70">
              {t("noResults", "Нет результатов")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
