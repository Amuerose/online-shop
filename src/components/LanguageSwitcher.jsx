import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = [
  { code: "cs", label: "CS" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-6 h-6 flex items-center justify-center text-[#BDA47A]"
      >
        <Globe className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+19px)] z-50 bg-[rgba(255,255,255,0.06)] text-[#BDA47A] rounded-xl shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-[22px] border border-white/20 overflow-hidden text-sm transition-all duration-300">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => {
                i18n.changeLanguage(code);
                setOpen(false);
              }}
              className={`block w-full px-4 py-[11px] text-center hover:bg-white/20 ${
                i18n.language === code ? "bg-white/20 font-semibold" : ""
              }`}
            >
              {label}
            </button>
            
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;