

import { useState } from "react";
import { createPortal } from "react-dom";

const categories = {
  necessary: {
    label: "Обязательные",
    description: "Необходимы для работы сайта. Их нельзя отключить.",
    required: true,
  },
  analytics: {
    label: "Аналитика",
    description: "Помогают нам понять, как вы используете сайт.",
    required: false,
  },
  marketing: {
    label: "Маркетинг",
    description: "Используются для персонализации рекламы.",
    required: false,
  },
};

function ConsentModal({ isOpen, onSave }) {
  const [consent, setConsent] = useState(() => {
    const saved = localStorage.getItem("cookie-consent");
    return saved ? JSON.parse(saved) : { necessary: true, analytics: false, marketing: false };
  });

  const handleToggle = (key) => {
    if (categories[key].required) return;
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
        <h2 className="text-lg font-semibold">Настройки файлов cookie</h2>
        <div className="space-y-4">
          {Object.entries(categories).map(([key, { label, description, required }]) => (
            <div key={key} className="flex justify-between items-start gap-4 text-sm">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-xs opacity-80">{description}</p>
              </div>
              <input
                type="checkbox"
                checked={consent[key]}
                onChange={() => handleToggle(key)}
                disabled={required}
                className="w-5 h-5 accent-[#BDA47A]"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-[#BDA47A]/20 hover:bg-[#BDA47A]/30 transition-colors text-[#BDA47A] border border-white/20 backdrop-blur-sm"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConsentModal;