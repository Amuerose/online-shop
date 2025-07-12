import useIsDesktop from '../hooks/useIsDesktop';
import { useTranslation } from 'react-i18next';

function About() {
  const isMobile = !useIsDesktop();
  const { t } = useTranslation();

  return (
    <div
      className="
        relative
        w-full
        h-[calc(100dvh+env(safe-area-inset-top)+env(safe-area-inset-bottom))]
        overflow-hidden
        pt-[calc(80px+env(safe-area-inset-top))]
        pb-[calc(200px+env(safe-area-inset-bottom))]
        min-w-full overflow
      "
      style={{
        scrollbarGutter: 'stable',
        background: [
          'linear-gradient(120deg, #F7F0E8 0%, #EDE3D4 50%, #E4D8C6 100%)',
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 70%)',
          'radial-gradient(circle at 80% 80%, rgba(189,164,122,0.2) 0%, transparent 60%)'
        ].join(', '),
      }}
    >
      <h1 className="mt-[16px] text-lg sm:text-xl md:text-3xl lg:text-4xl font-[Inter] font-extrabold text-[#BDA47A] text-center">
        {t('aboutTitle')}
      </h1>
      <div className="relative z-10 h-full overflow-hidden mt-12 px-4 sm:px-6 md:px-12 lg:px-32 max-w-[1400px] mx-auto">
        <div className="h-full overflow-y-auto pr-2 space-y-16">
          <div className="space-y-12 text-[#4B2E1D] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify">
            <div className="flex justify-center">
              <p className="max-w-[110ch] mx-auto text-justify text-xs sm:text-sm md:text-lg lg:text-xl leading-relaxed">
                {t('aboutDesc1')}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-center gap-16">
              <div className="flex-1 flex justify-center mt-16">
                <img
                  src="/images/gl.png"
                  alt="Десерт Amuerose"
                  className="block w-full h-auto object-contain rounded-lg max-w-[80%] sm:max-w-[410px] md:max-w-[420px] lg:max-w-[520px] mx-auto"
                />
              </div>
              <div className="flex-1 text-[#4B2E1D] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed space-y-4 mt-16">
                <p>
                  Amuerose nevznikla jako pouhý obchodní projekt, ale z vášně pro dokonalou kombinaci bobulí, datlí a čokolády. První experimenty nebyly plánovány pro trh – šlo o touhu vytvořit absolutní harmonii chutí a textur.
                </p>
                <p>
                  Používáme speciálně vyvinutou belgickou čokoládu přizpůsobenou struktuře a vlhkosti našich plodů, a královské odrůdy datlí Medjool plněné prvotřídními sýry (Dobbilé, Roquefort a pomalu karamelizovaný mléčný sýr bez přidaného cukru). 
                </p>
                <p>
                  Bobule – jahody, maliny a borůvky – pocházejí od prověřených pěstitelů v Belgii a Nizozemsku po celý rok; každá plodina prochází ruční selekcí, aby byla sladká, pevná a vizuálně dokonalá.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-center gap-6 max-w-4xl w-full mx-auto">
              <div className="text-[#4B2E1D] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed flex-1 space-y-4 text-justify">
                <h2 className="text-xl font-semibold mb-2 text-[#BDA47A]">{t('founderTitle')}</h2>
                <p>
                  Jelena Šalajevá, šéfkuchařka a autorka receptů Amuerose, vystudovala prestižní cukrářskou školu s vyznamenáním a ve 18 letech se stala šéfkuchařkou jednoho z nejlepších hotelů v Oděse. Její práce je výsledkem hlubokého porozumění technologii přípravy dezertů a umění vytvořit dokonalou chuťovou symfonii.
                </p>
              </div>
              <img
                src="/images/lena.png"
                alt="Елена Шалаева"
                className="w-[563px] md:w-[450px] sm:w-[405px] h-auto object-cover rounded-lg self-start -mt-[60px] -ml-4"
              />
            </div>

            <div className="max-w-[110ch] mx-auto text-[#4B2E1D] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed space-y-4">
              <p>
                Amuerose není masový ani sezónní produkt, ale řemeslná značka s jasnými principy a nejvyšší kvalitou. Vyrábíme dezerty na míru pro soukromé klienty, svatby, firemní akce i partnerské projekty – spolupráce s námi znamená chuťový i estetický zážitek.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;