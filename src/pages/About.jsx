import { useTranslation } from 'react-i18next';
import { blogBackgroundStyle } from '../styles/blogBackground';

function About() {
  const { t } = useTranslation();

  return (
    <div
      className="relative w-full min-h-[100dvh] overflow-hidden pt-[calc(90px+env(safe-area-inset-top))] pb-[calc(120px+env(safe-area-inset-bottom))]"
      style={blogBackgroundStyle}
    >
      <h1 className="mt-[8px] text-lg sm:text-xl md:text-3xl lg:text-4xl font-[Inter] font-extrabold text-[#BDA47A] text-center">
        {t('aboutTitle')}
      </h1>
      <div className="relative z-10 mt-10 px-4 sm:px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto">
        <div className="space-y-10 text-[#4B2E1D] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify">
          <div className="flex justify-center">
            <p className="max-w-[110ch] mx-auto text-justify">{t('aboutDesc1')}</p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
            <div className="flex-1 flex justify-center">
              <img
                src="/images/dort.png"
                alt={t('aboutDessertAlt', { defaultValue: 'Amuerose dessert' })}
                className="block w-full h-auto object-contain rounded-lg max-w-[80%] sm:max-w-[410px] md:max-w-[420px] lg:max-w-[520px] mx-auto"
              />
            </div>
            <div className="flex-1 space-y-4">
              <p>{t('aboutDesc2')}</p>
              <p>{t('aboutDesc3')}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-center gap-6 max-w-4xl w-full mx-auto">
            <div className="flex-1 space-y-4 text-justify">
              <h2 className="text-xl font-semibold mb-2 text-[#BDA47A]">{t('founderTitle')}</h2>
              <p>{t('founderDesc')}</p>
            </div>
            <img
              src="/images/lena.png"
              alt={t('aboutFounderAlt', { defaultValue: 'Elena Shalaeva' })}
              className="w-[563px] md:w-[450px] sm:w-[405px] h-auto object-cover rounded-lg self-start -mt-[40px] -ml-2"
            />
          </div>

          <div className="max-w-[110ch] mx-auto space-y-4">
            <p>{t('aboutConclusion')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
