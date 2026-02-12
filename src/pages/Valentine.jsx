import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo";

const cards = [
  { src: "/valentine/IMG_8519.PNG", productPath: "/product/velvet-love" },
  { src: "/valentine/IMG_8520.PNG", productPath: "/product/rose-embrace" },
  { src: "/valentine/IMG_8521.PNG", productPath: "/product/desire-heart" },
  { src: "/valentine/IMG_8522.PNG", productPath: "/product/duo-eclat" },
  { src: "/valentine/IMG_8523.PNG", productPath: "/product/reserve-heart" },
  { src: "/valentine/IMG_8524.PNG", productPath: "/product/velvet-evening" },
  { src: "/valentine/IMG_8525.PNG", productPath: "/product/Old%20Prague" },
  { src: "/valentine/IMG_8526.PNG", productPath: "/shop" },
];

function Valentine() {
  const navigate = useNavigate();
  useEffect(() => {
    const originalBg = document.body.style.background;
    document.body.style.background = "#5E1D28";
    return () => {
      document.body.style.background = originalBg;
    };
  }, []);

  return (
    <>
      <Seo
        title="Valentine Collection 2026"
        description="Особая коллекция Amuerose к Дню святого Валентина: эксклюзивные ягоды и десерты, оформленные вручную."
        canonicalPath="/valentine"
      />
      <main
        className="min-h-[100dvh] bg-[#5E1D28] px-4 sm:px-6 pt-[calc(86px+var(--safe-area-inset-top,0px))] pb-[calc(96px+var(--safe-area-inset-bottom,0px))]"
        style={{ backgroundColor: "#5E1D28" }}
      >
        <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[28px] bg-[#5E1D28] px-4 py-4 sm:px-8 sm:py-6">
          <div className="mx-auto flex items-center justify-center gap-3 sm:gap-6">
            <img
              src="/valentine/sticker.webp"
              alt=""
              className="w-[76px] shrink-0 sm:w-[120px] md:w-[150px]"
            />
            <h1
              className="text-center leading-none text-[#BDA47A] text-[36px] sm:text-[60px] md:text-[76px]"
              style={{ fontFamily: '"Cormorant Garamond", "Times New Roman", serif', fontWeight: 500 }}
            >
              Valentine Collection 2026
            </h1>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <div key={card.src} className="w-full flex flex-col items-center gap-4">
              <div className="relative w-full rounded-[24px] shadow-[0_18px_40px_rgba(0,0,0,0.35)] overflow-hidden bg-[#5E1D28]">
                <img
                  src={card.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#5E1D28] via-[#5E1D28]/80 to-transparent" />
              </div>
              <button
                type="button"
                onClick={() => navigate(card.productPath)}
                className="w-full max-w-[360px] rounded-full border border-[#BDA47A]/70 bg-[rgba(189,164,122,0.14)] px-6 py-2.5 text-center text-[15px] font-semibold text-[#BDA47A] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.45),0_6px_18px_rgba(0,0,0,0.18)] backdrop-blur-[18px] transition hover:bg-[rgba(189,164,122,0.22)]"
              >
                Заказать этот набор
              </button>
            </div>
          ))}
        </div>
        </div>
      </main>
    </>
  );
}

export default Valentine;
