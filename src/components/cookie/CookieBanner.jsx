import { useEffect, useState } from "react";
import ConsentModal from "./ConsentModal";

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cookie-consent");
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || typeof parsed !== "object") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dispatchChange = () => {
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleAcceptAll = () => {
    const val = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem("cookie-consent", JSON.stringify(val));
    dispatchChange();
    setVisible(false);
  };

  if (!visible) {
    return (
      <ConsentModal
        isOpen={settingsOpen}
        onSave={(consent) => {
          localStorage.setItem("cookie-consent", JSON.stringify(consent));
          dispatchChange();
          setSettingsOpen(false);
          setVisible(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 text-[#BDA47A] text-sm sm:text-base bg-[rgba(255,255,255,0.06)] backdrop-blur-[16px] border-t border-white/20 shadow-[0_-4px_12px_rgba(0,0,0,0.25)]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="leading-relaxed">
            Tento web používá cookies pro zajištění správného fungování, analýzu návštěvnosti a personalizaci obsahu.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Nastavit
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors text-sm sm:text-base"
            >
              Rozumím
            </button>
          </div>
        </div>
      </div>

      <ConsentModal
        isOpen={settingsOpen}
        onSave={(consent) => {
          localStorage.setItem("cookie-consent", JSON.stringify(consent));
          dispatchChange();
          setSettingsOpen(false);
          setVisible(false);
        }}
      />
    </>
  );
}

export default CookieBanner;