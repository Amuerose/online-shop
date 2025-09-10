import { useState } from "react";
import { createPortal } from "react-dom";

function ConsentModal({ isOpen, onSave, labels }) {
  const [consent, setConsent] = useState(() => {
    const saved = localStorage.getItem("cookie-consent");
    return saved ? JSON.parse(saved) : { necessary: true, analytics: false, marketing: false };
  });

  const handleToggle = (key) => {
    if (key === "necessary") return;
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    onSave(consent);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-[rgba(255,255,255,0.06)] text-[#BDA47A] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.3),0_6px_16px_rgba(0,0,0,0.3)] p-6 space-y-6">
        <h2 className="text-lg font-semibold">{labels.title}</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4 text-sm">
            <div>
              <p className="font-medium">{labels.necessary.label}</p>
              <p className="text-xs opacity-80">{labels.necessary.description}</p>
            </div>
            <input
              type="checkbox"
              checked={consent.necessary}
              onChange={() => handleToggle("necessary")}
              disabled={true}
              className="w-5 h-5 accent-[#7B3F00]"
            />
          </div>
          <div className="flex justify-between items-start gap-4 text-sm">
            <div>
              <p className="font-medium">{labels.analytics.label}</p>
              <p className="text-xs opacity-80">{labels.analytics.description}</p>
            </div>
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={() => handleToggle("analytics")}
              disabled={false}
              className="w-5 h-5 accent-[#7B3F00]"
            />
          </div>
          <div className="flex justify-between items-start gap-4 text-sm">
            <div>
              <p className="font-medium">{labels.marketing.label}</p>
              <p className="text-xs opacity-80">{labels.marketing.description}</p>
            </div>
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={() => handleToggle("marketing")}
              disabled={false}
              className="w-5 h-5 accent-[#7B3F00]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-[#BDA47A]/20 hover:bg-[#BDA47A]/30 transition-colors text-[#BDA47A] border border-white/20 backdrop-blur-sm"
          >
            {labels.save}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConsentModal;