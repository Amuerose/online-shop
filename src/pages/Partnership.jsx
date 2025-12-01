import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Heartbeat animation keyframes
const heartbeatStyles = `
  @keyframes heartbeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.2); }
    28% { transform: scale(1); }
  }
`;

function Partnership() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = heartbeatStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }
    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  return (
    <div
      className="
        relative
        w-screen left-1/2 -translate-x-1/2
        h-[calc(100dvh+env(safe-area-inset-top)+env(safe-area-inset-bottom))]
        overflow-hidden
        pt-[calc(80px+env(safe-area-inset-top))]
        pb-[calc(15px+env(safe-area-inset-bottom))]
        px-4
      "
      style={{
        backgroundImage: 'linear-gradient(180deg, #3b1f1d 0%, #8b4513 100%), linear-gradient(90deg, #3b1f1d 0%, rgba(75,46,43,0) 100%), linear-gradient(180deg, rgba(92,51,23,0.8) 0%, rgba(139,69,19,0.8) 100%), linear-gradient(180deg, rgba(75,46,43,0.6) 0%, rgba(210,105,30,0.6) 100%), linear-gradient(180deg, rgba(210,105,30,0.4) 0%, rgba(75,46,43,0.4) 100%)',
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover'
      }}
    >
      <h1 className="text-4xl font-[Inter] font-semibold text-center text-[#BDA47A] -mb-20 mt-2" >
        {t("partnershipTitle", "Сотрудничайте с нами")}
      </h1>
      <div className="h-full overflow-hidden max-w-[1400px] mx-auto py-16 space-y-16">
      <div
        className="h-full overflow-y-auto scrollbar-none mx-auto max-w-[1400px] bg-[rgba(255,255,255,0.04)] backdrop-blur-[22px] border border-white/20 rounded-[32px] p-16 space-y-16 mt-8 mb-8"
        style={{ scrollbarWidth: 'none' }}
      >
        <p className="text-white text-2xl text-center max-w-2xl mx-auto -mt-10">
          {t("partnershipIntro", "Мы всегда открыты к сотрудничеству с местными компаниями, кафе, организаторами мероприятий и розничными магазинами.")}
        </p>

        <section className="max-w-[1400px] w-full">
          <h2 className="text-2xl font-[Inter] font-semibold text-[#BDA47A] mb-4 text-center -mt-6">
            {t("partnershipEventsTitle")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 mt-6">
            <div className="flex-1 flex flex-col items-center justify-center bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 rounded-[24px] p-4 text-center">
              <p className="text-white">
                {t("partnershipDetail1", "Предлагайте своим клиентам высококачественные ягоды в шоколаде.")}
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 rounded-[24px] p-4 text-center">
              <p className="text-white">
                {t("partnershipDetail2", "Индивидуальная упаковка для корпоративных клиентов и мероприятий.")}
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 rounded-[24px] p-4 text-center">
              <p className="text-white">
                {t("partnershipDetail3", "Гибкие оптовые цены и быстрая доставка по Праге.")}
              </p>
            </div>
          </div>
        </section>

        <section className="w-full flex flex-col items-center">
          <h2 className="text-2xl font-[Inter] font-semibold text-[#BDA47A] -mt-4 mb-4">{t("contactSectionTitle")}</h2>
          <p className="text-[#BDA47A] mb-2">
            {t("contactEmailLabel")}: <a href="mailto:partner@amuerose.cz" className="text-white underline">partner@amuerose.cz</a>
          </p>
          <p className="text-[#BDA47A] mb-4">
            {t("contactPhoneLabel")}: <a href="tel:+420603329873" className="text-white underline">+ (420) 603 319 872</a>
          </p>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-3 py-1 bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 rounded-[24px] text-[#BDA47A] transition-transform ease-in-out duration-[1200ms] hover:scale-110 -mb-6"
              style={{ animation: "heartbeat 1.2s ease-in-out infinite" }}
            >
              {t("contactUs", "Связаться")}
            </button>
          ) : (
            <form ref={formRef} className="mt-6 space-y-4 rounded-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 p-6 transition-all duration-300">
              <input
                type="text"
                name="company"
                placeholder={t("companyName", "Company Name")}
                className="w-full px-4 py-2 rounded-lg text-black"
              />
              <input
                type="email"
                name="email"
                placeholder={t("contactEmail", "Contact Email")}
                className="w-full px-4 py-2 rounded-lg text-black"
              />
              <textarea
                name="message"
                placeholder={t("yourMessage", "Your Message")}
                className="w-full px-4 py-2 rounded-lg text-black h-24"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/5 text-[#BDA47A] rounded-full hover:bg-white/10 transition-all duration-200 mx-auto"
              >
                {t("submitApplication", "Submit Application")}
              </button>
            </form>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 max-w-[1400px] mx-auto items-start justify-items-center">
          <section className="mb-8">
            <div>
              <h2 className="text-2xl font-[Inter] font-semibold text-[#BDA47A] mb-4">
                {t("partnershipBenefitsTitle", "Преимущества сотрудничества")}
              </h2>
              <ul className="list-disc list-inside text-white space-y-2 mb-8">
                <li>{t("benefit1", "Эксклюзивные продукты для вашего меню или витрины.")}</li>
                <li>{t("benefit2", "Гибкие объёмы заказов и индивидуальные оптовые цены.")}</li>
                <li>{t("benefit3", "Маркетинговая поддержка, совместный брендинг и коллаборации.")}</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <div>
              <h2 className="text-2xl font-[Inter] font-semibold text-[#BDA47A] mb-4">
                {t("howItWorksTitle", "Как это работает")}
              </h2>
              <ol className="list-decimal list-inside text-white space-y-2 mb-8">
                <li>{t("step1", "Оставьте заявку через форму ниже.")}</li>
                <li>{t("step2", "Выберите ассортимент и назначьте дегустацию.")}</li>
                <li>{t("step3", "Заключите договор и оформите первый заказ.")}</li>
                <li>{t("step4", "Получайте регулярные поставки и поддержку.")}</li>
              </ol>
            </div>
          </section>

          <section className="mb-8 w-full lg:col-span-2">
            <div>
              <h2 className="text-2xl font-[Inter] font-semibold text-[#BDA47A] mb-4 text-center">
                {t("partnershipLevelsTitle", "Условия и уровни сотрудничества")}
              </h2>
              <ul className="list-disc list-inside text-white space-y-2 -mb-10 text-center">
                <li>{t("level1", "Стандартный опт — минимум 100 шт, оплата в течение 10 дней.")}</li>
                <li>{t("level2", "Премиум-партнёрство — индивидуальная упаковка и приоритетная доставка.")}</li>
                <li>{t("level3", "Эксклюзив — совместная разработка продуктов и упоковок с вашим брендом + персональный менеджер.")}</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
      </div>
    </div>
  );
}

export default Partnership;