import React from "react";
import { useTranslation } from "react-i18next";
import { blogBackgroundStyle } from "../styles/blogBackground";
import Seo from "../components/Seo";

export default function ReturnsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("returns.title")}
        description={t(
          "returns.lead1"
        )}
        canonicalPath="/vraceni"
      />
      <div
        className="relative h-screen pt-[90px] px-4 pb-[calc(90px+var(--safe-area-inset-bottom,0px))] sm:pb-[calc(160px+var(--safe-area-inset-bottom,0px))] overflow-hidden"
        style={blogBackgroundStyle}
      >
        <div className="w-full max-w-[900px] mx-auto bg-white/60 backdrop-blur-[22px] border border-white/40 rounded-[24px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] px-6 py-8 text-[#4B2E1D] h-full overflow-y-auto">
          <h1 className="text-2xl font-bold text-center text-[#BDA47A] mb-6">
            {t("returns.title")}
          </h1>

          <p className="mb-4">
            {t("returns.lead1")}
          </p>

          <p className="mb-4">
            {t("returns.lead2")}
          </p>

          <ul className="list-disc list-inside mb-4">
            <li>{t("returns.bullet1")}</li>
            <li>{t("returns.bullet2")}</li>
            <li>{t("returns.bullet3")}</li>
          </ul>

          <p className="mb-6">
            {t("returns.resolution")}
          </p>

          <div className="border-t border-white/30 pt-4 text-sm">
            <div className="font-semibold text-[#BDA47A] mb-2">
              {t("returns.contactTitle")}
            </div>
            <div className="flex flex-col gap-1">
              <a href="mailto:reklamace@amuerose.cz" className="underline">
                reklamace@amuerose.cz
              </a>
              <a href="tel:+420603319872" className="underline">
                +420 603 319 872
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
