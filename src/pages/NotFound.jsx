import { useTranslation } from "react-i18next";
import { blogBackgroundStyle } from "../styles/blogBackground";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center text-center p-8"
      style={blogBackgroundStyle}
    >
      <h1 className="text-6xl font-semibold text-[#4B2E0E] mb-6">404</h1>
      <p className="text-xl text-[#5c3d1f] mb-8">{t("notFoundMessage")}</p>
      <a
        href="/"
        className="px-6 py-3 bg-[#BDA47A]/80 backdrop-blur-md text-white rounded-xl shadow-md hover:bg-[#BDA47A] transition-all duration-300"
      >
        {t("notFoundBackHome")}
      </a>
    </div>
  );
}
