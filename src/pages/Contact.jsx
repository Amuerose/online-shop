import { Helmet } from 'react-helmet';
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { blogBackgroundStyle } from "../styles/blogBackground";

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
  const [status, setStatus] = useState(null);
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
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name')?.trim() || 'Имя не указано';
    const email = formData.get('email');
    const message = formData.get('message')?.trim() || 'Без сообщения';
    const subject = encodeURIComponent(`Контактная форма — ${name}`);
    const body = encodeURIComponent(`Имя: ${name}\nEmail: ${email || '—'}\n\n${message}`);
    window.location.href = `mailto:info@amuerose.cz?subject=${subject}&body=${body}`;
    setStatus(t('contactFormSent', 'Спасибо, мы свяжемся с вами!'));
    event.target.reset();
  };

  return (
    <PageWithSafeAreaColors
      topColor="#F8EFE6"
      bottomColor="#F8EFE6"
    >
      <Helmet>
        <meta name="theme-color" content="#F8EFE6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>
      <div
        className="flex flex-col items-center justify-center px-6 py-12 text-[#4B2E1D] text-center"
        style={{
          ...blogBackgroundStyle,
          minHeight: '100dvh',
        }}
      >
        <h1 className="text-4xl font-bold mb-6 text-[#BDA47A]">{t("contactPageTitle", "Свяжитесь с нами")}</h1>
        <p className="text-lg max-w-xl mb-4 text-[#4B2E1D]/80">
          {t("contactPageDescription", "Если у вас есть вопросы, предложения или хотите обсудить сотрудничество — свяжитесь с нами любым удобным способом.")}
        </p>
        <section className="w-full flex flex-col items-center">
          <p className="text-[#BDA47A] mb-2">
            {t("contactEmailLabel")}: <a href="mailto:info@amuerose.cz" className="text-[#4B2E1D] underline">info@amuerose.cz</a>
          </p>
          <p className="text-[#BDA47A] mb-4">
            {t("contactPhoneLabel")}: <a href="tel:+420603319872" className="text-[#4B2E1D] underline">+420 603 319 872</a>
          </p>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 rounded-full bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-[#BDA47A]/60 text-[#BDA47A] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] transition-transform ease-in-out duration-[1200ms] hover:scale-110 hover:bg-white/10 -mb-6"
              style={{ animation: "heartbeat 1.2s ease-in-out infinite" }}
            >
              {t("contactUs", "Связаться")}
            </button>
          ) : (
            <>
              {status && (
                <p className="mb-2 text-sm text-[#4B2E1D]">{status}</p>
              )}
              <form
                ref={formRef}
                className="mt-6 space-y-4 rounded-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 p-6 transition-all duration-300"
                onSubmit={handleSubmit}
              >
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
                className="px-6 py-2 rounded-full bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-[#BDA47A]/60 text-[#BDA47A] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/10 transition-all duration-200 mx-auto"
              >
                {t("submitContact", "Отправить")}
              </button>
              </form>
            </>
          )}
        </section>
      </div>
    </PageWithSafeAreaColors>
  );
}

export default Contact;
