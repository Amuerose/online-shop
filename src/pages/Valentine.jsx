import React from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "/valentine/IMG_8519.PNG",
  "/valentine/IMG_8520.PNG",
  "/valentine/IMG_8521.PNG",
  "/valentine/IMG_8522.PNG",
  "/valentine/IMG_8523.PNG",
  "/valentine/IMG_8524.PNG",
  "/valentine/IMG_8525.PNG",
  "/valentine/IMG_8526.PNG",
];

function Valentine() {
  const navigate = useNavigate();

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#5E1D28] px-4 sm:px-6">
      <div className="valentine-scroll valentine-scroll-fade overflow-y-auto mt-[calc(120px+var(--safe-area-inset-top,0px))] h-[calc(100dvh-120px-var(--safe-area-inset-top,0px))] pb-[calc(120px+var(--safe-area-inset-bottom,0px))]">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="overflow-hidden rounded-[28px] bg-[#5E1D28] px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex items-center justify-center gap-3 sm:gap-6">
              <img
                src="/valentine/sticker.webp"
                alt=""
                className="w-[88px] shrink-0 sm:w-[130px] md:w-[165px]"
              />
              <h1
                className="text-center leading-none text-[#BDA47A] text-[40px] sm:text-[68px] md:text-[84px]"
                style={{ fontFamily: '"Great Vibes", "Alex Brush", cursive', fontWeight: 400 }}
              >
                Valentine Collection
              </h1>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {images.map((src) => (
              <div key={src} className="group relative mx-auto w-full max-w-[520px]">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full [clip-path:inset(0_0_2px_0)]"
                />
                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#BDA47A] bg-[rgba(255,255,255,0.06)] px-6 py-2 text-[#BDA47A] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-[22px] transition hover:bg-white/10 md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100"
                >
                  Купить
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .valentine-scroll-fade {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0px, rgba(0, 0, 0, 0.4) 18px, #000 52px, #000 100%);
          mask-image: linear-gradient(to bottom, transparent 0px, rgba(0, 0, 0, 0.4) 18px, #000 52px, #000 100%);
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }
      `}</style>
    </main>
  );
}

export default Valentine;
