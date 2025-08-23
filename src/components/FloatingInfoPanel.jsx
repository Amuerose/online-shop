import { useState, useEffect } from "react";
import { Info } from "lucide-react";

function FloatingInfoPanel() {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        !e.target.closest("#footerInfoPanel") &&
        !e.target.closest("#footerInfoToggle")
      ) {
        setShowInfo(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 flex items-end justify-start gap-4 px-6">
      {/* Instagram */}
      <a
        href="https://www.instagram.com/amuerose"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 min-w-[56px] flex items-center justify-center rounded-full backdrop-blur-[22px] bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.25)] text-[#BDA47A]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-9 h-9"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            d="M7 2C4.8 2 3 3.8 3 6v12c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4H7z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="6.5" r="1" />
        </svg>
      </a>

      {/* Info Panel */}
      <div className="relative flex-1">
        <div
          id="footerInfoPanel"
          className={`transition-all duration-300 ease-in-out border border-white/20 backdrop-blur-[22px] bg-[rgba(255,255,255,0.06)] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.25)] text-[#BDA47A] overflow-hidden ${
            showInfo
              ? "rounded-[9999px] w-full px-4 sm:px-6 py-4 max-w-full"
              : "rounded-full w-14 h-14 flex items-center justify-center"
          }`}
        >
          {!showInfo && (
            <button
              id="footerInfoToggle"
              onClick={() => setShowInfo(true)}
              className="w-full h-full flex items-center justify-center"
            >
              <Info className="w-9 h-9" />
            </button>
          )}

          {showInfo && (
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 text-sm text-center sm:text-left sm:gap-6">
              {/* Left */}
              <div className="flex flex-col items-center sm:items-start space-y-0.5 text-xs sm:text-sm">
                <p className="leading-tight">David Oganesyan</p>
                <p className="leading-tight">IČO: 10734562</p>
              </div>

              {/* Center */}
              <div className="flex flex-col items-center space-y-0.5 text-[11px] sm:text-xs opacity-80 leading-tight">
                <a
                  href="/privacy-policy"
                  className="underline hover:opacity-100 transition-opacity"
                >
                  Политика конфиденциальности
                </a>
                <p className="opacity-70">© 2025 Amuerose · Все права защищены</p>
              </div>

              {/* Right */}
              <div className="flex flex-col items-center sm:items-end space-y-0.5 text-xs sm:text-sm">
                <a href="tel:+420603319872" className="leading-tight">
                  +420 603 319 872
                </a>
                <a href="mailto:amuerose@gmail.com" className="leading-tight">
                  amuerose@gmail.com
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FloatingInfoPanel;