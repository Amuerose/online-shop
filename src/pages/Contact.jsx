import { Helmet } from 'react-helmet';
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function PageWithSafeAreaColors({ topColor, bottomColor, children }) {
  return (
    <>
      {/* Верхняя safe area с однотонным цветом */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'env(safe-area-inset-top)',
          backgroundColor: topColor,
          zIndex: 9999,
        }}
      />
      {/* Нижняя safe area с однотонным цветом */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'env(safe-area-inset-bottom)',
          backgroundColor: bottomColor,
          zIndex: 9999,
        }}
      />
      {/* Основной контент страницы с паддингами */}
      <div
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxSizing: 'border-box',
          minHeight: '100dvh',
        }}
      >
        {children}
      </div>
    </>
  );
}

function Contact() {
  const heartbeatStyles = `
    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.2); }
      28% { transform: scale(1); }
    }
  `;
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = heartbeatStyles;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }
    if (showForm) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm]);
  return (
    <PageWithSafeAreaColors
      topColor="#2e1c12"
      bottomColor="rgba(46,28,18,0.95)"
    >
      <Helmet>
        <meta name="theme-color" content="#2e1c12" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>
      <div
        className="flex flex-col items-center justify-center px-6 py-12 text-white text-center"
        style={{
          backgroundImage: [
            'linear-gradient(180deg, #3b1f1d 0%, #8b4513 100%)',
            'linear-gradient(90deg, #3b1f1d 0%, rgba(75,46,43,0) 100%)',
            'linear-gradient(180deg, rgba(92,51,23,0.8) 0%, rgba(139,69,19,0.8) 100%)',
            'linear-gradient(180deg, rgba(75,46,43,0.6) 0%, rgba(210,105,30,0.6) 100%)',
            'linear-gradient(180deg, rgba(210,105,30,0.4) 0%, rgba(75,46,43,0.4) 100%)'
          ].join(', '),
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover',
          minHeight: '100dvh',
        }}
      >
        <h1 className="text-4xl font-bold mb-6 text-[#BDA47A]">{t("contactPageTitle", "Свяжитесь с нами")}</h1>
        <p className="text-lg max-w-xl mb-4">
          {t("contactPageDescription", "Если у вас есть вопросы, предложения или хотите обсудить сотрудничество — свяжитесь с нами любым удобным способом.")}
        </p>
        <section className="w-full flex flex-col items-center">
          <p className="text-[#BDA47A] mb-2">
            {t("contactEmailLabel")}: <a href="mailto:info@amuerose.com" className="text-white underline">info@amuerose.com</a>
          </p>
          <p className="text-[#BDA47A] mb-4">
            {t("contactPhoneLabel")}: <a href="tel:+420777123456" className="text-white underline">+420 777 123 456</a>
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
                name="name"
                placeholder={t("yourName", "Your Name")}
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
                {t("submitContact", "Отправить")}
              </button>
            </form>
          )}
        </section>
      </div>
    </PageWithSafeAreaColors>
  );
}

export default Contact;