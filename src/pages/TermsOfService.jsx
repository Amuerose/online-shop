

import React from "react";
import { blogBackgroundStyle } from "../styles/blogBackground";
import Seo from "../components/Seo";

function TermsOfService() {
  return (
    <>
      <Seo
        title="Uživatelská smlouva"
        description="Правила использования сайта Amuerose, включая registraci, platby и ochranu osobních údajů."
        canonicalPath="/terms-of-service"
      />
      <div
      className="min-h-[100dvh] px-4 pt-[calc(90px+var(--safe-area-inset-top,0px))] pb-[calc(90px+var(--safe-area-inset-bottom,0px))]"
      style={blogBackgroundStyle}
    >
      <div className="max-w-[800px] mx-auto bg-[rgba(255,255,255,0.6)] backdrop-blur-[18px] border border-white/30 rounded-[24px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_6px_18px_rgba(0,0,0,0.08)] p-6 text-[#4B2E1D]">
        <h1 className="text-2xl font-semibold text-[#BDA47A] mb-4">Uživatelská smlouva</h1>
        <p>
          Tato uživatelská smlouva upravuje vztahy mezi vámi a Amuerose při používání našeho webu.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Obecná ustanovení</h2>
        <p>
          Používáním webu potvrzujete, že jste se seznámili a souhlasíte s tímto ujednáním.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Registrace a uživatelský účet</h2>
        <p>
          Zavazujete se poskytovat pravdivé informace při registraci a přihlášení přes Google nebo Facebook.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Používání webu</h2>
        <p>
          Je zakázáno používat web k účelům, které jsou v rozporu se zákony České republiky.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Platby a vrácení</h2>
        <p>
          Všechny objednávky jsou hrazeny prostřednictvím integrovaných platebních systémů.
          Vrácení zboží se řídí platnou legislativou.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Ochrana osobních údajů</h2>
        <p>
          Osobní údaje zpracováváme v souladu se Zásadami ochrany osobních údajů.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Závěrečná ustanovení</h2>
        <p>
          Vyhrazujeme si právo měnit podmínky této smlouvy.
          Pokračování v používání webu znamená souhlas se změnami.
        </p>
      </div>
    </div>
    </>
  );
}

export default TermsOfService;
