import { useTranslation } from "react-i18next";
import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MotionSection = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.section }))
);

const slides = ["slider1", "slider2", "slider3"];

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        !e.target.closest("#footerInfo") &&
        !e.target.closest("#infoToggle")
      ) {
        setShowInfo(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative overflow-hidden">
      <Suspense fallback={null}>
        <MotionSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[100dvh] w-full bg-cover bg-center text-white"
          style={{
            backgroundImage: `url('/images/hero-bg.png')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div className="absolute inset-0 bg-black/30 z-0" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          {/* Логотип */}
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-48 md:w-64 object-contain mb-0"
          />

          {/* Автоматический слайдер из 3 фраз */}
          <div className="mt-0 mb-10">
            <p className="whitespace-pre-line text-[#BDA47A] text-xl md:text-2xl lg:text-3xl font-light leading-snug text-center max-w-[900px]">
              {t(slides[currentSlide])}
            </p>
          </div>

          {/* Кнопка */}
          <button
            onClick={() => navigate("/shop")}
            className="mt-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#BDA47A] font-semibold shadow-sm hover:bg-white/20 transition"
          >
            {t("enterShop")}
          </button>

          {/* Слоган — показывается только на sm и выше */}
          <p className="hidden sm:block whitespace-pre-line text-[#BDA47A] text-xl md:text-2xl lg:text-3xl font-light leading-snug max-w-[600px] text-right absolute bottom-32 right-[8%]">
            {t("slogan")}
          </p>
        </div>

        {/* Инфо-панель */}
        {showInfo && (
          <div
            id="footerInfo"
            className="fixed bottom-0 left-0 w-full z-40 px-6 py-3 text-sm bg-white/10 backdrop-blur-md border-t border-white/20 text-white flex flex-col md:flex-row justify-between items-center gap-2"
          >
            <span className="text-xs md:text-sm text-white/80">
              {t("footerSignature")}
            </span>
            <div className="flex gap-4 text-xs md:text-sm">
              <a href="/privacy-policy" className="hover:underline">
                {t("privacyPolicy")}
              </a>
              <a href="mailto:amuerose@gmail.com">amuerose@gmail.com</a>
              <a href="tel:+420603319872">+420 603 319 872</a>
            </div>
          </div>
        )}
        </MotionSection>
      </Suspense>
    </div>
  );
}

export default Home;
