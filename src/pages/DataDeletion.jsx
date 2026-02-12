import { Trans, useTranslation } from "react-i18next";
import { blogBackgroundStyle } from "../styles/blogBackground";
import Seo from "../components/Seo";

export default function DataDeletion() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title="Удаление данных"
        description="Как запросить удаление персональных данных в Amuerose и какие данные мы храним."
        canonicalPath="/data-deletion"
      />
      <div
      className="min-h-[100dvh] px-4 pt-[calc(90px+var(--safe-area-inset-top,0px))] pb-[calc(90px+var(--safe-area-inset-bottom,0px))]"
      style={blogBackgroundStyle}
    >
      <div className="max-w-2xl mx-auto p-8 text-center bg-white/60 backdrop-blur-lg rounded-2xl border border-white/40 text-[#4B2E1D] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-bold mb-4 text-[#BDA47A]">{t("dataDeletionTitle")}</h1>
        <p className="mb-2 text-sm sm:text-base">
          <Trans i18nKey="dataDeletionBody1">
            Если вы хотите удалить свои данные, полученные через вход с помощью Facebook,
            пожалуйста, отправьте запрос на наш email: <a href="mailto:support@amuerose.cz" className="text-[#4B2E1D] underline">support@amuerose.cz</a>.
          </Trans>
        </p>
        <p className="text-sm sm:text-base">{t("dataDeletionBody2")}</p>
      </div>
    </div>
    </>
  );
}
