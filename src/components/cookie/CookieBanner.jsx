import { useEffect, useState } from "react";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 text-[#BDA47A] text-sm sm:text-base bg-[rgba(255,255,255,0.06)] backdrop-blur-[16px] border-t border-white/20 shadow-[0_-4px_12px_rgba(0,0,0,0.25)]">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="leading-relaxed">
          Tento web používá cookies pro zajištění správného fungování, analýzu návštěvnosti a personalizaci obsahu.
        </p>
        <button
          onClick={handleAccept}
          className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm sm:text-base"
        >
          Rozumím
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;